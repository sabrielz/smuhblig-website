<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateJurusanRequest;
use App\Models\Jurusan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
                    'color_gradient' => 'linear-gradient(to right, '.$jurusan->color_start.', '.$jurusan->color_end.')',
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
                ],
            ],
        ]);
    }

    public function update(UpdateJurusanRequest $request, Jurusan $jurusan)
    {
        $validated = $request->validated();

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
            if (! empty($validated['en']['nama'])) {
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
            if (! empty($validated['deleted_gallery_ids'])) {
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
