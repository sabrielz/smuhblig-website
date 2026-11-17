<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArtikelRequest;
use App\Http\Requests\Admin\UpdateArtikelRequest;
use App\Http\Resources\Admin\ArtikelResource;
use App\Http\Resources\Public\BeritaDetailResource;
use App\Jobs\TranslateArticle;
use App\Models\Article;
use App\Models\ArticleRevision;
use App\Models\ArticleTranslation;
use App\Models\Category;
use App\Models\Pengaturan;
use App\Models\User;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Article::class);

        $query = Article::query()
            ->with(['translations', 'category.translations', 'user', 'media']);

        // Author can only see their own articles
        /** @var User $user */
        $user = Auth::user();
        if ($user->isAuthor()) {
            $query->where('user_id', $user->id);
        }

        // Filter search by title matching translation ID
        if ($search = $request->input('search')) {
            $query->whereHas('translations', function ($q) use ($search) {
                $q->where('locale', 'id')
                    ->where('title', 'like', "%{$search}%");
            });
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }

        // Apply ordering based on newest
        $query->latest();

        $articles = $query->paginate(15)->withQueryString();

        $categories = Category::with(['translations' => function ($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (Category $cat) {
            $trans = $cat->translation('id');

            return [
                'id' => $cat->id,
                'name' => $trans ? $trans->name : $cat->name,
                'color' => $cat->color,
            ];
        });

        return Inertia::render('Admin/Artikel/Index', [
            'articles' => ArtikelResource::collection($articles),
            'filters' => $request->only(['search', 'status', 'category_id', 'user_id']),
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Article::class);

        $categories = Category::with(['translations' => function ($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (Category $cat) {
            $trans = $cat->translation('id');

            return [
                'id' => $cat->id,
                'name' => $trans ? $trans->name : $cat->name,
                'color' => $cat->color,
            ];
        });

        return Inertia::render('Admin/Artikel/Form', [
            'article' => null,
            'categories' => $categories,
        ]);
    }

    public function store(StoreArtikelRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Inject title into request for Spatie Slug generation
            $request->merge(['title' => $validated['title_id']]);

            $article = Article::create([
                'user_id' => Auth::id(),
                'category_id' => $validated['category_id'],
                'status' => $validated['status'],
                'published_at' => $validated['published_at'],
                'meta_title' => $validated['meta_title'],
                'meta_description' => $validated['meta_description'],
            ]);

            // Save ID translation (sanitise HTML from TipTap)
            $article->translations()->create([
                'locale' => 'id',
                'title' => $validated['title_id'],
                'excerpt' => $validated['excerpt_id'] ?? null,
                'content' => HtmlSanitizer::clean($validated['content_id']),
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            // Save EN translation if available
            if (! empty($validated['title_en'])) {
                $article->translations()->create([
                    'locale' => 'en',
                    'title' => $validated['title_en'],
                    'excerpt' => $validated['excerpt_en'] ?? null,
                    'content' => HtmlSanitizer::clean($validated['content_en'] ?? ''),
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }

            if ($request->hasFile('thumbnail')) {
                $alt = $request->input('thumbnail_alt') ?: ($validated['title_id'] ?? 'Thumbnail artikel');
                $article->addMediaFromRequest('thumbnail')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('thumbnail');
            }

            if ($request->has('tags')) {
                $article->syncTags($validated['tags'] ?? []);
            }

            DB::commit();

            // Auto-translate EN if conditions met
            if (
                $validated['status'] === ArticleStatus::Published->value
                && Pengaturan::bool('ai_translate_auto', false)
                && Pengaturan::bool('artikel_ai_enabled', true)
                && empty($validated['title_en'])
            ) {
                TranslateArticle::dispatch($article);
            }

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal membuat artikel', ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan saat membuat artikel, silakan coba lagi.');
        }
    }

    public function edit(Article $artikel)
    {
        Gate::authorize('update', $artikel);

        $artikel->load(['translations', 'category', 'media', 'tags', 'revisions.user']);

        $categories = Category::with(['translations' => function ($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (Category $cat) {
            $trans = $cat->translation('id');

            return [
                'id' => $cat->id,
                'name' => $trans ? $trans->name : $cat->name,
                'color' => $cat->color,
            ];
        });

        return Inertia::render('Admin/Artikel/Form', [
            'article' => (new ArtikelResource($artikel))->resolve(),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateArtikelRequest $request, Article $artikel)
    {
        Gate::authorize('update', $artikel);

        $validated = $request->validated();

        DB::beginTransaction();

        try {
            // Simpan snapshot revisi sebelum perubahan (Sesi 6-06)
            /** @var ArticleTranslation|null $oldTransId */
            $oldTransId = $artikel->translations->where('locale', 'id')->first();
            /** @var ArticleTranslation|null $oldTransEn */
            $oldTransEn = $artikel->translations->where('locale', 'en')->first();
            $tags = $artikel->tags;
            $snapshot = [
                'status' => $artikel->status->value,
                'category_id' => $artikel->category_id,
                'meta_title' => $artikel->meta_title,
                'meta_description' => $artikel->meta_description,
                'translations' => [
                    'id' => [
                        'title' => $oldTransId ? $oldTransId->title : '',
                        'excerpt' => $oldTransId ? ($oldTransId->excerpt ?? '') : '',
                        'content' => $oldTransId ? $oldTransId->content : '',
                    ],
                    'en' => [
                        'title' => $oldTransEn ? $oldTransEn->title : '',
                        'excerpt' => $oldTransEn ? ($oldTransEn->excerpt ?? '') : '',
                        'content' => $oldTransEn ? $oldTransEn->content : '',
                    ],
                ],
                'tags' => $tags->pluck('name')->toArray(),
            ];

            $artikel->revisions()->create([
                'user_id' => $request->user()?->id,
                'snapshot' => $snapshot,
            ]);

            // Batasi maks 30 revisi per artikel (hapus revisi tertua bila > 30)
            $excessRevisions = $artikel->revisions()->skip(30)->take(100)->pluck('id');
            if ($excessRevisions->isNotEmpty()) {
                ArticleRevision::whereIn('id', $excessRevisions)->delete();
            }

            $artikel->update([
                'category_id' => $validated['category_id'],
                'status' => $validated['status'],
                'published_at' => $validated['published_at'],
                'meta_title' => $validated['meta_title'],
                'meta_description' => $validated['meta_description'],
            ]);

            // Update or Create ID translation (sanitise HTML from TipTap)
            $artikel->translations()->updateOrCreate(
                ['locale' => 'id'],
                [
                    'title' => $validated['title_id'],
                    'excerpt' => $validated['excerpt_id'] ?? null,
                    'content' => HtmlSanitizer::clean($validated['content_id']),
                    'reviewed' => true,
                ]
            );

            // Update, Create, or Delete EN translation
            if (! empty($validated['title_en'])) {
                $artikel->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'title' => $validated['title_en'],
                        'excerpt' => $validated['excerpt_en'] ?? null,
                        'content' => HtmlSanitizer::clean($validated['content_en'] ?? ''),
                        'reviewed' => true,
                    ]
                );
            } else {
                $artikel->translations()->where('locale', 'en')->delete();
            }

            if ($request->hasFile('thumbnail')) {
                $alt = $request->input('thumbnail_alt') ?: ($validated['title_id'] ?? 'Thumbnail artikel');
                $artikel->clearMediaCollection('thumbnail');
                $artikel->addMediaFromRequest('thumbnail')
                    ->withCustomProperties(['alt' => $alt])
                    ->toMediaCollection('thumbnail');
            }

            if ($request->has('tags')) {
                $artikel->syncTags($validated['tags'] ?? []);
            }

            DB::commit();

            // Auto-translate EN if conditions met
            if (
                $validated['status'] === ArticleStatus::Published->value
                && Pengaturan::bool('ai_translate_auto', false)
                && Pengaturan::bool('artikel_ai_enabled', true)
                && empty($validated['title_en'])
                && ! $artikel->translations()->where('locale', 'en')->exists()
            ) {
                TranslateArticle::dispatch($artikel);
            }

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal memperbarui artikel', ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan saat memperbarui artikel, silakan coba lagi.');
        }
    }

    public function destroy(Article $artikel)
    {
        Gate::authorize('delete', $artikel);

        DB::beginTransaction();
        try {
            $artikel->translations()->delete();
            $artikel->clearMediaCollection('thumbnail');
            $artikel->delete();
            DB::commit();

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal menghapus artikel', ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan saat menghapus artikel, silakan coba lagi.');
        }
    }

    public function publish(Request $request, Article $artikel)
    {
        Gate::authorize('publish', $artikel);

        DB::beginTransaction();
        try {
            $artikel->update([
                'status' => ArticleStatus::Published->value,
                'published_at' => now(),
            ]);
            DB::commit();

            // Auto-translate EN if conditions met
            if (
                Pengaturan::bool('ai_translate_auto', false)
                && Pengaturan::bool('artikel_ai_enabled', true)
                && ! $artikel->translations()->where('locale', 'en')->exists()
            ) {
                TranslateArticle::dispatch($artikel);
            }

            return back()->with('success', 'Artikel berhasil dipublish.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal mempublish artikel', ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan saat mempublish artikel, silakan coba lagi.');
        }
    }

    /**
     * Mark the EN translation as reviewed by an editor.
     * Called by frontend via PATCH /admin/artikel/{artikel}/translation/reviewed
     */
    public function markTranslationReviewed(Article $artikel)
    {
        Gate::authorize('markTranslationReviewed', $artikel);

        /** @var ArticleTranslation|null $enTranslation */
        $enTranslation = $artikel->translations()->where('locale', 'en')->first();

        if (! $enTranslation) {
            return response()->json(['message' => 'Terjemahan EN tidak ditemukan.'], 404);
        }

        $enTranslation->update(['reviewed' => true]);

        return back()->with('success', 'Terjemahan ditandai sudah direview.');
    }

    /**
     * Preview draft article with public view layout.
     */
    public function preview(Article $artikel)
    {
        Gate::authorize('update', $artikel);

        $artikel->load(['translations', 'category.translations', 'user', 'media']);

        $formattedArticle = (new BeritaDetailResource($artikel))->resolve();

        $relatedArticles = Article::query()
            ->terbit()
            ->where('id', '!=', $artikel->id)
            ->with(['translations', 'category.translations', 'user', 'media'])
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(function (Article $relArticle) {
                /** @var Category|null $category */
                $category = $relArticle->category;
                /** @var User|null $author */
                $author = $relArticle->user;

                $relTrans = $relArticle->translation();
                $catTrans = $category?->translation();

                return [
                    'id' => $relArticle->id,
                    'slug' => $relArticle->slug,
                    'title' => $relTrans ? $relTrans->title : 'Untitled',
                    'excerpt' => $relTrans ? $relTrans->excerpt : '',
                    'published_at' => $relArticle->published_at ? $relArticle->published_at->format('d M Y') : '',
                    'category' => [
                        'name' => $catTrans ? $catTrans->name : 'Uncategorized',
                        'color' => '#003f87',
                    ],
                    'author' => [
                        'name' => $author ? $author->name : 'Admin',
                        'avatar' => $author ? $author->avatar_url : 'https://ui-avatars.com/api/?name=Admin',
                    ],
                    'thumbnail' => $relArticle->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/600x400',
                ];
            });

        $categories = Category::withCount(['articles' => function ($query) {
            $query->terbit();
        }])->with('translations')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->translation()?->name,
                'slug' => $category->slug,
                'articles_count' => $category->articles_count,
            ];
        });

        return Inertia::render('Public/Berita/Show', [
            'article' => $formattedArticle,
            'relatedArticles' => $relatedArticles,
            'categories' => $categories,
            'isPreview' => true,
        ]);
    }

    /**
     * Pulihkan snapshot revisi artikel (Sesi 6-06).
     */
    public function restoreRevision(Request $request, Article $artikel, ArticleRevision $revision)
    {
        Gate::authorize('update', $artikel);

        if ($revision->article_id !== $artikel->id) {
            abort(404);
        }

        $snapshot = (array) $revision->snapshot;

        DB::beginTransaction();

        try {
            // 1. Simpan snapshot kondisi saat ini sebelum restore
            /** @var ArticleTranslation|null $curTransId */
            $curTransId = $artikel->translations->where('locale', 'id')->first();
            /** @var ArticleTranslation|null $curTransEn */
            $curTransEn = $artikel->translations->where('locale', 'en')->first();
            $curTags = $artikel->tags;
            $preRestoreSnapshot = [
                'status' => $artikel->status->value,
                'category_id' => $artikel->category_id,
                'meta_title' => $artikel->meta_title,
                'meta_description' => $artikel->meta_description,
                'translations' => [
                    'id' => [
                        'title' => $curTransId ? $curTransId->title : '',
                        'excerpt' => $curTransId ? ($curTransId->excerpt ?? '') : '',
                        'content' => $curTransId ? $curTransId->content : '',
                    ],
                    'en' => [
                        'title' => $curTransEn ? $curTransEn->title : '',
                        'excerpt' => $curTransEn ? ($curTransEn->excerpt ?? '') : '',
                        'content' => $curTransEn ? $curTransEn->content : '',
                    ],
                ],
                'tags' => $curTags->pluck('name')->toArray(),
            ];

            $artikel->revisions()->create([
                'user_id' => $request->user()?->id,
                'snapshot' => $preRestoreSnapshot,
            ]);

            // Batasi maks 30 revisi
            $excessRevisions = $artikel->revisions()->skip(30)->take(100)->pluck('id');
            if ($excessRevisions->isNotEmpty()) {
                ArticleRevision::whereIn('id', $excessRevisions)->delete();
            }

            // 2. Pulihkan data artikel dari snapshot
            $artikel->update([
                'category_id' => $snapshot['category_id'] ?? $artikel->category_id,
                'status' => $snapshot['status'] ?? $artikel->status,
                'meta_title' => $snapshot['meta_title'] ?? null,
                'meta_description' => $snapshot['meta_description'] ?? null,
            ]);

            // 3. Pulihkan translasi ID (sanitasi HTML)
            $transId = $snapshot['translations']['id'] ?? [];
            if (! empty($transId['title'])) {
                $artikel->translations()->updateOrCreate(
                    ['locale' => 'id'],
                    [
                        'title' => $transId['title'],
                        'excerpt' => $transId['excerpt'] ?? null,
                        'content' => HtmlSanitizer::clean($transId['content'] ?? ''),
                        'reviewed' => true,
                    ]
                );
            }

            // 4. Pulihkan translasi EN (sanitasi HTML)
            $transEn = $snapshot['translations']['en'] ?? [];
            if (! empty($transEn['title'])) {
                $artikel->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    [
                        'title' => $transEn['title'],
                        'excerpt' => $transEn['excerpt'] ?? null,
                        'content' => HtmlSanitizer::clean($transEn['content'] ?? ''),
                        'reviewed' => true,
                    ]
                );
            } else {
                $artikel->translations()->where('locale', 'en')->delete();
            }

            // 5. Pulihkan tags
            if (isset($snapshot['tags']) && is_array($snapshot['tags'])) {
                $artikel->syncTags($snapshot['tags']);
            }

            DB::commit();

            return redirect()->route('admin.artikel.edit', $artikel)
                ->with('success', 'Revisi artikel berhasil dipulihkan.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal memulihkan revisi artikel', ['exception' => $e]);

            return back()->with('error', 'Terjadi kesalahan saat memulihkan revisi.');
        }
    }
}
