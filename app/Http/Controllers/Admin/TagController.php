<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MergeTagRequest;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Tags\Tag;

class TagController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        if (! $user || (! $user->isAdmin() && ! $user->isEditor())) {
            abort(403);
        }

        $tags = Tag::query()
            ->select('tags.*')
            ->selectSub(
                DB::table('taggables')
                    ->selectRaw('count(*)')
                    ->whereColumn('taggables.tag_id', 'tags.id')
                    ->where('taggables.taggable_type', Article::class),
                'articles_count'
            )
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(function (Tag $tag) {
                /** @var mixed $rawCount */
                $rawCount = $tag->getAttribute('articles_count');

                return [
                    'id' => $tag->id,
                    'name' => (string) $tag->name,
                    'slug' => (string) $tag->slug,
                    'articles_count' => (int) ($rawCount ?? 0),
                    'created_at' => $tag->created_at?->format('Y-m-d H:i:s'),
                ];
            });

        $allTags = Tag::query()
            ->orderBy('name')
            ->get()
            ->map(function (Tag $t) {
                return [
                    'id' => $t->id,
                    'name' => (string) $t->name,
                ];
            });

        return Inertia::render('Admin/Tag/Index', [
            'tags' => $tags,
            'allTags' => $allTags,
        ]);
    }

    public function merge(MergeTagRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            $sourceTag = Tag::findOrFail($validated['source_id']);
            $targetTag = Tag::findOrFail($validated['target_id']);

            // Dapatkan seluruh taggable yang dimiliki oleh source tag
            $taggables = DB::table('taggables')
                ->where('tag_id', $sourceTag->id)
                ->get();

            foreach ($taggables as $taggable) {
                // Tambahkan relasi ke targetTag bila belum ada
                $exists = DB::table('taggables')
                    ->where('tag_id', $targetTag->id)
                    ->where('taggable_id', $taggable->taggable_id)
                    ->where('taggable_type', $taggable->taggable_type)
                    ->exists();

                if (! $exists) {
                    DB::table('taggables')->insert([
                        'tag_id' => $targetTag->id,
                        'taggable_id' => $taggable->taggable_id,
                        'taggable_type' => $taggable->taggable_type,
                    ]);
                }
            }

            // Hapus source tag (dan relasi taggables-nya akan terhapus via cascade)
            $sourceTag->delete();
        });

        return redirect()
            ->route('admin.tag.index')
            ->with('success', 'Tag berhasil digabungkan.');
    }

    public function destroy(Request $request, Tag $tag): RedirectResponse
    {
        $user = $request->user();
        if (! $user || (! $user->isAdmin() && ! $user->isEditor())) {
            abort(403);
        }

        DB::transaction(function () use ($tag) {
            // Lepas dari artikel / taggables lalu hapus tag
            DB::table('taggables')->where('tag_id', $tag->id)->delete();
            $tag->delete();
        });

        return redirect()
            ->route('admin.tag.index')
            ->with('success', 'Tag berhasil dihapus.');
    }
}
