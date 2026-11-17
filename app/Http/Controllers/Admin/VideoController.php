<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreVideoRequest;
use App\Http\Requests\Admin\UpdateVideoRequest;
use App\Http\Resources\Admin\VideoResource;
use App\Models\Galeri;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class VideoController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Video::class);

        $query = Video::query()->with(['translations', 'galeri.translations']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('youtube_id', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($qt) use ($search) {
                        $qt->where('judul', 'like', "%{$search}%");
                    });
            });
        }

        $videos = $query->ordered()->paginate(15)->withQueryString()->through(function (Video $item) {
            return (new VideoResource($item))->resolve();
        });

        return Inertia::render('Admin/Video/Index', [
            'videos' => $videos,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Video::class);

        $galeris = Galeri::active()->with('translations')->get()->map(function ($g) {
            $trans = $g->translation();

            return [
                'id' => $g->id,
                'title' => $trans ? $trans->title : $g->slug,
            ];
        });

        return Inertia::render('Admin/Video/Form', [
            'video' => null,
            'galeris' => $galeris,
        ]);
    }

    public function store(StoreVideoRequest $request)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $validated) {
            $maxUrutan = Video::max('urutan') ?? 0;

            /** @var Video $video */
            $video = Video::create([
                'youtube_id' => $validated['youtube_id'],
                'galeri_id' => $validated['galeri_id'] ?? null,
                'urutan' => $validated['urutan'] ?? ($maxUrutan + 1),
                'is_active' => $request->boolean('is_active', true),
            ]);

            $video->translations()->create([
                'locale' => 'id',
                'judul' => $validated['translations']['id']['judul'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            if (! empty($validated['translations']['en']['judul'])) {
                $video->translations()->create([
                    'locale' => 'en',
                    'judul' => $validated['translations']['en']['judul'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        });

        Cache::forget('public.video.id');
        Cache::forget('public.video.en');

        return redirect()->route('admin.video.index')->with('success', 'Video berhasil ditambahkan.');
    }

    public function edit(Video $video): Response
    {
        Gate::authorize('update', $video);

        $video->load(['translations', 'galeri.translations']);

        $galeris = Galeri::active()->with('translations')->get()->map(function ($g) {
            $trans = $g->translation();

            return [
                'id' => $g->id,
                'title' => $trans ? $trans->title : $g->slug,
            ];
        });

        return Inertia::render('Admin/Video/Form', [
            'video' => (new VideoResource($video))->resolve(),
            'galeris' => $galeris,
        ]);
    }

    public function update(UpdateVideoRequest $request, Video $video)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($request, $video, $validated) {
            $video->update([
                'youtube_id' => $validated['youtube_id'],
                'galeri_id' => $validated['galeri_id'] ?? null,
                'urutan' => $validated['urutan'] ?? $video->urutan,
                'is_active' => $request->boolean('is_active', true),
            ]);

            $video->translations()->updateOrCreate(
                ['locale' => 'id'],
                ['judul' => $validated['translations']['id']['judul']]
            );

            if (! empty($validated['translations']['en']['judul'])) {
                $video->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    ['judul' => $validated['translations']['en']['judul']]
                );
            } else {
                $video->translations()->where('locale', 'en')->delete();
            }
        });

        Cache::forget('public.video.id');
        Cache::forget('public.video.en');

        return redirect()->route('admin.video.index')->with('success', 'Video berhasil diperbarui.');
    }

    public function destroy(Video $video)
    {
        Gate::authorize('delete', $video);

        $video->delete();

        Cache::forget('public.video.id');
        Cache::forget('public.video.en');

        return redirect()->route('admin.video.index')->with('success', 'Video berhasil dihapus.');
    }
}
