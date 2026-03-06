<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Http\Requests\Admin\StoreArtikelRequest;
use App\Http\Requests\Admin\UpdateArtikelRequest;
use App\Http\Resources\Admin\ArtikelResource;
use App\Services\HtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        $query = Article::query()
            ->with(['translations', 'category.translations', 'user', 'media']);

        // Filter search by title matching translation ID
        if ($search = $request->input('search')) {
            $query->whereHas('translations', function($q) use ($search) {
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

        $categories = Category::with(['translations' => function($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (\App\Models\Category $cat) {
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
        $categories = Category::with(['translations' => function($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (\App\Models\Category $cat) {
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
            if (!empty($validated['title_en'])) {
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
                $article->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
            }

            DB::commit();

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal membuat artikel: ' . $e->getMessage());
        }
    }

    public function edit(Article $artikel)
    {
        $artikel->load(['translations', 'category', 'media']);

        $categories = Category::with(['translations' => function($q) {
            $q->where('locale', 'id');
        }])->get()->map(function (\App\Models\Category $cat) {
            $trans = $cat->translation('id');
            return [
                'id' => $cat->id,
                'name' => $trans ? $trans->name : $cat->name,
                'color' => $cat->color,
            ];
        });

        return Inertia::render('Admin/Artikel/Form', [
            'article' => new ArtikelResource($artikel),
            'categories' => $categories,
        ]);
    }

    public function update(UpdateArtikelRequest $request, Article $artikel)
    {
        $validated = $request->validated();

        DB::beginTransaction();

        try {
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
            if (!empty($validated['title_en'])) {
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
                $artikel->clearMediaCollection('thumbnail');
                $artikel->addMediaFromRequest('thumbnail')->toMediaCollection('thumbnail');
            }

            DB::commit();

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal memperbarui artikel: ' . $e->getMessage());
        }
    }

    public function destroy(Article $artikel)
    {
        DB::beginTransaction();
        try {
            $artikel->translations()->delete();
            $artikel->clearMediaCollection('thumbnail');
            $artikel->delete();
            DB::commit();

            return redirect()->route('admin.artikel.index')->with('success', 'Artikel berhasil dihapus.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal menghapus artikel: ' . $e->getMessage());
        }
    }

    public function publish(Request $request, Article $artikel)
    {
        DB::beginTransaction();
        try {
            $artikel->update([
                'status' => 'published',
                'published_at' => now(),
            ]);
            DB::commit();

            return back()->with('success', 'Artikel berhasil dipublish.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Gagal mempublish artikel: ' . $e->getMessage());
        }
    }

    /**
     * Mark the EN translation as reviewed by an editor.
     * Called by frontend via PATCH /admin/artikel/{artikel}/translation/reviewed
     */
    public function markTranslationReviewed(Article $artikel)
    {
        /** @var \App\Models\ArticleTranslation|null $enTranslation */
        $enTranslation = $artikel->translations()->where('locale', 'en')->first();

        if (!$enTranslation) {
            return response()->json(['message' => 'Terjemahan EN tidak ditemukan.'], 404);
        }

        $enTranslation->update(['reviewed' => true]);

        return back()->with('success', 'Terjemahan ditandai sudah direview.');
    }
}

