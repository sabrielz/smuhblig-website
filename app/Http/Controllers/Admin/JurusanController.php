<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class JurusanController extends Controller
{
    public function index()
    {
        $jurusans = Jurusan::with(['translations'])
            ->ordered()
            ->get()
            ->map(function ($jurusan) {
                return [
                    'id' => $jurusan->id,
                    'slug' => $jurusan->slug,
                    'kode' => $jurusan->kode,
                    'icon_name' => $jurusan->icon_name,
                    'color_gradient' => 'linear-gradient(to right, ' . $jurusan->color_start . ', ' . $jurusan->color_end . ')',
                    'is_active' => $jurusan->is_active,
                    'nama' => $jurusan->translation('id')?->nama ?: $jurusan->slug,
                    'cover_url' => $jurusan->getFirstMediaUrl('cover'),
                ];
            });

        return Inertia::render('Admin/Jurusan/Index', [
            'jurusans' => $jurusans,
        ]);
    }

    public function edit(Jurusan $jurusan)
    {
        $jurusan->load(['translations', 'media']);

        $dataId = $jurusan->translation('id');
        $dataEn = $jurusan->translation('en');

        $gallery = $jurusan->getMedia('gallery')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
            ];
        });

        return Inertia::render('Admin/Jurusan/Edit', [
            'jurusan' => [
                'id' => $jurusan->id,
                'slug' => $jurusan->slug,
                'kode' => $jurusan->kode,
                'color_start' => $jurusan->color_start,
                'color_end' => $jurusan->color_end,
                'icon_name' => $jurusan->icon_name,
                'is_active' => $jurusan->is_active,
                'akreditasi' => $jurusan->akreditasi,
                'total_siswa' => $jurusan->total_siswa,
                'lama_pendidikan' => $jurusan->lama_pendidikan,
                'highlight_1_icon' => $jurusan->highlight_1_icon,
                'highlight_2_icon' => $jurusan->highlight_2_icon,
                'highlight_3_icon' => $jurusan->highlight_3_icon,
                'cover_url' => $jurusan->getFirstMediaUrl('cover'),
                'gallery' => $gallery,
                'id_data' => [
                    'nama' => $dataId?->nama ?? '',
                    'tagline' => $dataId?->tagline ?? '',
                    'deskripsi_singkat' => $dataId?->deskripsi_singkat ?? '',
                    'deskripsi_lengkap' => $dataId?->deskripsi_lengkap ?? '',
                    'konten_hero' => $dataId?->konten_hero ?? '',
                    'kompetensi' => $dataId?->kompetensi ?? [],
                    'prospek_karir' => $dataId?->prospek_karir ?? [],
                    'fasilitas' => $dataId?->fasilitas ?? [],
                    'highlight_1_label' => $dataId?->highlight_1_label ?? '',
                    'highlight_2_label' => $dataId?->highlight_2_label ?? '',
                    'highlight_3_label' => $dataId?->highlight_3_label ?? '',
                ],
                'en_data' => [
                    'nama' => $dataEn?->nama ?? '',
                    'tagline' => $dataEn?->tagline ?? '',
                    'deskripsi_singkat' => $dataEn?->deskripsi_singkat ?? '',
                    'deskripsi_lengkap' => $dataEn?->deskripsi_lengkap ?? '',
                    'konten_hero' => $dataEn?->konten_hero ?? '',
                    'kompetensi' => $dataEn?->kompetensi ?? [],
                    'prospek_karir' => $dataEn?->prospek_karir ?? [],
                    'fasilitas' => $dataEn?->fasilitas ?? [],
                    'highlight_1_en' => $dataEn?->highlight_1_en ?? '',
                    'highlight_2_en' => $dataEn?->highlight_2_en ?? '',
                    'highlight_3_en' => $dataEn?->highlight_3_en ?? '',
                ]
            ]
        ]);
    }

    public function update(Request $request, Jurusan $jurusan)
    {
        $validated = $request->validate([
            'is_active' => 'boolean',
            'color_start' => 'required|string|max:7',
            'color_end' => 'required|string|max:7',
            'icon_name' => 'nullable|string|max:100',
            'akreditasi' => 'nullable|string|max:10',
            'total_siswa' => 'nullable|integer',
            'lama_pendidikan' => 'nullable|string|max:50',
            'highlight_1_icon' => 'nullable|string|max:100',
            'highlight_2_icon' => 'nullable|string|max:100',
            'highlight_3_icon' => 'nullable|string|max:100',

            'cover' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array|max:8',
            'gallery.*' => 'image|max:2048',
            'deleted_gallery_ids' => 'nullable|array',
            'deleted_gallery_ids.*' => 'integer',

            'id.nama' => 'required|string|max:255',
            'id.tagline' => 'nullable|string|max:255',
            'id.deskripsi_singkat' => 'nullable|string',
            'id.deskripsi_lengkap' => 'nullable|string',
            'id.konten_hero' => 'nullable|string',
            'id.kompetensi' => 'array',
            'id.kompetensi.*' => 'string|max:255',
            'id.prospek_karir' => 'array',
            'id.prospek_karir.*' => 'string|max:255',
            'id.fasilitas' => 'array',
            'id.fasilitas.*' => 'string|max:255',
            'id.highlight_1_label' => 'nullable|string|max:255',
            'id.highlight_2_label' => 'nullable|string|max:255',
            'id.highlight_3_label' => 'nullable|string|max:255',

            'en.nama' => 'nullable|string|max:255',
            'en.tagline' => 'nullable|string|max:255',
            'en.deskripsi_singkat' => 'nullable|string',
            'en.deskripsi_lengkap' => 'nullable|string',
            'en.konten_hero' => 'nullable|string',
            'en.kompetensi' => 'array',
            'en.kompetensi.*' => 'string|max:255',
            'en.prospek_karir' => 'array',
            'en.prospek_karir.*' => 'string|max:255',
            'en.fasilitas' => 'array',
            'en.fasilitas.*' => 'string|max:255',
            'en.highlight_1_en' => 'nullable|string|max:255',
            'en.highlight_2_en' => 'nullable|string|max:255',
            'en.highlight_3_en' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($jurusan, $validated, $request) {
            $jurusan->update([
                'is_active' => $validated['is_active'] ?? $jurusan->is_active,
                'color_start' => $validated['color_start'],
                'color_end' => $validated['color_end'],
                'icon_name' => $validated['icon_name'] ?? null,
                'akreditasi' => $validated['akreditasi'] ?? null,
                'total_siswa' => $validated['total_siswa'] ?? 0,
                'lama_pendidikan' => $validated['lama_pendidikan'] ?? '3 Tahun',
                'highlight_1_icon' => $validated['highlight_1_icon'] ?? null,
                'highlight_2_icon' => $validated['highlight_2_icon'] ?? null,
                'highlight_3_icon' => $validated['highlight_3_icon'] ?? null,
            ]);

            // ID Translation
            $jurusan->translations()->updateOrCreate(
                ['locale' => 'id'],
                $validated['id']
            );

            // EN Translation
            if (!empty($validated['en']['nama'])) {
                $jurusan->translations()->updateOrCreate(
                    ['locale' => 'en'],
                    $validated['en']
                );
            }

            // Handle Cover Image
            if ($request->hasFile('cover')) {
                $jurusan->clearMediaCollection('cover');
                $jurusan->addMediaFromRequest('cover')->toMediaCollection('cover');
            }

            // Handle Deleted Gallery Images
            if (!empty($validated['deleted_gallery_ids'])) {
                $jurusan->media()->whereIn('id', $validated['deleted_gallery_ids'])->delete();
            }

            // Handle New Gallery Images
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $file) {
                    $jurusan->addMedia($file)->toMediaCollection('gallery');
                }
            }
        });

        // Clear cache
        Cache::tags(['jurusan'])->flush();

        return redirect()->route('admin.jurusan.index')->with('success', 'Jurusan berhasil diperbarui');
    }
}

