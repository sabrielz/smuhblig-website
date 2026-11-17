<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreGaleriRequest;
use App\Http\Requests\Admin\UpdateGaleriRequest;
use App\Http\Requests\Admin\UploadFotoGaleriRequest;
use App\Http\Resources\Admin\GaleriResource;
use App\Models\Galeri;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class GaleriController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Galeri::class);

        $galeris = Galeri::with(['translations', 'media'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Galeri/Index', [
            'galeris' => GaleriResource::collection($galeris),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Galeri::class);

        return Inertia::render('Admin/Galeri/Form', [
            'galeri' => null,
        ]);
    }

    public function store(StoreGaleriRequest $request)
    {
        Gate::authorize('create', Galeri::class);

        $validated = $request->validated();

        $galeri = Galeri::create([
            'slug' => Str::slug($validated['judul_id']),
            'event_date' => $validated['event_date'] ? Carbon::parse($validated['event_date']) : null,
            'is_active' => $validated['is_active'] ?? true,
            'is_featured' => $validated['is_featured'] ?? false,
            'sort_order' => Galeri::max('sort_order') + 1,
        ]);

        $galeri->translations()->createMany([
            [
                'locale' => 'id',
                'judul' => $validated['judul_id'],
                'deskripsi' => $validated['deskripsi_id'],
                'ai_translated' => false,
                'reviewed' => true,
            ],
            [
                'locale' => 'en',
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'deskripsi' => $validated['deskripsi_en'] ?? $validated['deskripsi_id'],
                'ai_translated' => empty($validated['judul_en']),
                'reviewed' => ! empty($validated['judul_en']),
            ],
        ]);

        return redirect()->route('admin.galeri.show', $galeri->id)
            ->with('success', 'Album galeri berhasil dibuat. Silakan upload foto.');
    }

    public function show(Galeri $galeri)
    {
        Gate::authorize('view', $galeri);

        $galeri->load(['translations', 'media']);

        $photos = $galeri->getMedia('photos')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'preview_url' => $media->getUrl('preview') ?: $media->getUrl(),
                'name' => $media->name,
                'size' => $media->human_readable_size,
                'sort_order' => $media->order_column,
            ];
        });

        return Inertia::render('Admin/Galeri/Show', [
            'galeri' => [
                'id' => $galeri->id,
                'judul_id' => $galeri->translation('id')?->judul,
                'deskripsi_id' => $galeri->translation('id')?->deskripsi,
                'event_date' => $galeri->event_date?->format('Y-m-d'),
                'is_active' => $galeri->is_active,
            ],
            'photos' => $photos,
        ]);
    }

    public function edit(Galeri $galeri)
    {
        Gate::authorize('update', $galeri);

        $galeri->load('translations');

        return Inertia::render('Admin/Galeri/Form', [
            'galeri' => [
                'id' => $galeri->id,
                'judul_id' => $galeri->translation('id')?->judul,
                'judul_en' => $galeri->translation('en')?->judul,
                'deskripsi_id' => $galeri->translation('id')?->deskripsi,
                'deskripsi_en' => $galeri->translation('en')?->deskripsi,
                'event_date' => $galeri->event_date?->format('Y-m-d'),
                'is_active' => $galeri->is_active,
                'is_featured' => $galeri->is_featured,
            ],
        ]);
    }

    public function update(UpdateGaleriRequest $request, Galeri $galeri)
    {
        Gate::authorize('update', $galeri);

        $validated = $request->validated();

        $galeri->update([
            'slug' => Str::slug($validated['judul_id']),
            'event_date' => $validated['event_date'] ? Carbon::parse($validated['event_date']) : null,
            'is_active' => $validated['is_active'] ?? $galeri->is_active,
            'is_featured' => $validated['is_featured'] ?? $galeri->is_featured,
        ]);

        $galeri->translations()->where('locale', 'id')->update([
            'judul' => $validated['judul_id'],
            'deskripsi' => $validated['deskripsi_id'],
        ]);

        $galeri->translations()->updateOrCreate(
            ['locale' => 'en'],
            [
                'judul' => $validated['judul_en'] ?? $validated['judul_id'],
                'deskripsi' => $validated['deskripsi_en'] ?? $validated['deskripsi_id'],
                'ai_translated' => empty($validated['judul_en']),
                'reviewed' => ! empty($validated['judul_en']),
            ]
        );

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Album galeri berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        Gate::authorize('delete', $galeri);

        $galeri->delete();

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Album galeri berhasil dihapus.');
    }

    public function uploadFoto(UploadFotoGaleriRequest $request, Galeri $galeri)
    {
        Gate::authorize('update', $galeri);

        $photos = $request->file('photos');
        if (is_array($photos)) {
            foreach ($photos as $photo) {
                $galeri->addMedia($photo)
                    ->toMediaCollection('photos');
            }
        }

        return redirect()->back()->with('success', 'Foto berhasil diupload.');
    }

    public function deleteFoto(Request $request, int $mediaId)
    {
        $media = Media::findOrFail($mediaId);
        $galeri = Galeri::findOrFail($media->model_id);
        Gate::authorize('update', $galeri);

        $media->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}
