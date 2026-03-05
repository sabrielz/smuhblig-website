<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Carbon\Carbon;

class GaleriController extends Controller
{
    public function index()
    {
        $galeris = Galeri::with(['translations', 'media'])
            ->orderBy('sort_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function (\App\Models\Galeri $galeri) {
                return [
                    'id' => $galeri->id,
                    'judul' => $galeri->translation('id')?->judul ?? '-',
                    'event_date' => $galeri->event_date?->format('Y-m-d'),
                    'is_active' => $galeri->is_active,
                    'is_featured' => $galeri->is_featured,
                    'foto_count' => $galeri->media->count(),
                    'thumbnail' => $galeri->getFirstMediaUrl('photos', 'preview') ?: $galeri->getFirstMediaUrl('photos'),
                ];
            });

        return Inertia::render('Admin/Galeri/Index', [
            'galeris' => $galeris,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Galeri/Form', [
            'galeri' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul_id' => 'required|string|max:255',
            'judul_en' => 'nullable|string|max:255',
            'deskripsi_id' => 'nullable|string',
            'deskripsi_en' => 'nullable|string',
            'event_date' => 'nullable|date',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

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
                'reviewed' => !empty($validated['judul_en']),
            ],
        ]);

        return redirect()->route('admin.galeri.show', $galeri->id)
            ->with('success', 'Album galeri berhasil dibuat. Silakan upload foto.');
    }

    public function show(Galeri $galeri)
    {
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

    public function update(Request $request, Galeri $galeri)
    {
        $validated = $request->validate([
            'judul_id' => 'required|string|max:255',
            'judul_en' => 'nullable|string|max:255',
            'deskripsi_id' => 'nullable|string',
            'deskripsi_en' => 'nullable|string',
            'event_date' => 'nullable|date',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

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
                'reviewed' => !empty($validated['judul_en']),
            ]
        );

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Album galeri berhasil diperbarui.');
    }

    public function destroy(Galeri $galeri)
    {
        $galeri->delete();

        return redirect()->route('admin.galeri.index')
            ->with('success', 'Album galeri berhasil dihapus.');
    }

    public function uploadFoto(Request $request, Galeri $galeri)
    {
        $request->validate([
            'photos' => 'required|array|max:20',
            'photos.*' => 'required|file|image|mimes:jpg,jpeg,png,webp|max:5120', // 5MB max
        ]);

        foreach ($request->file('photos') as $photo) {
            $galeri->addMedia($photo)
                ->toMediaCollection('photos');
        }

        return redirect()->back()->with('success', 'Foto berhasil diupload.');
    }

    public function deleteFoto(Request $request, int $mediaId)
    {
        $media = \Spatie\MediaLibrary\MediaCollections\Models\Media::findOrFail($mediaId);
        $media->delete();

        return redirect()->back()->with('success', 'Foto berhasil dihapus.');
    }
}
