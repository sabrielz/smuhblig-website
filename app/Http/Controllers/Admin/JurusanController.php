<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
                    'color_gradient' => $jurusan->color_gradient,
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
        $jurusan->load('translations');

        $dataId = $jurusan->translation('id');
        $dataEn = $jurusan->translation('en');

        return Inertia::render('Admin/Jurusan/Edit', [
            'jurusan' => [
                'id' => $jurusan->id,
                'slug' => $jurusan->slug,
                'kode' => $jurusan->kode,
                'color_gradient' => $jurusan->color_gradient,
                'icon_name' => $jurusan->icon_name,
                'is_active' => $jurusan->is_active,
                'cover_url' => $jurusan->getFirstMediaUrl('cover'),
                'id_data' => [
                    'nama' => $dataId?->nama ?? '',
                    'tagline' => $dataId?->tagline ?? '',
                    'deskripsi_singkat' => $dataId?->deskripsi_singkat ?? '',
                    'deskripsi_lengkap' => $dataId?->deskripsi_lengkap ?? '',
                    'kompetensi' => $dataId?->kompetensi ?? [],
                    'prospek_karir' => $dataId?->prospek_karir ?? [],
                    'fasilitas' => $dataId?->fasilitas ?? [],
                ],
                'en_data' => [
                    'nama' => $dataEn?->nama ?? '',
                    'tagline' => $dataEn?->tagline ?? '',
                    'deskripsi_singkat' => $dataEn?->deskripsi_singkat ?? '',
                    'deskripsi_lengkap' => $dataEn?->deskripsi_lengkap ?? '',
                    'kompetensi' => $dataEn?->kompetensi ?? [],
                    'prospek_karir' => $dataEn?->prospek_karir ?? [],
                    'fasilitas' => $dataEn?->fasilitas ?? [],
                ]
            ]
        ]);
    }

    public function update(Request $request, Jurusan $jurusan)
    {
        $validated = $request->validate([
            'cover' => 'nullable|image|max:2048',
            'id.nama' => 'required|string|max:255',
            'id.tagline' => 'required|string|max:255',
            'id.deskripsi_singkat' => 'required|string',
            'id.deskripsi_lengkap' => 'required|string',
            'id.kompetensi' => 'array',
            'id.kompetensi.*' => 'string|max:255',
            'id.prospek_karir' => 'array',
            'id.prospek_karir.*' => 'string|max:255',
            'id.fasilitas' => 'array',
            'id.fasilitas.*' => 'string|max:255',
            'en.nama' => 'nullable|string|max:255',
            'en.tagline' => 'nullable|string|max:255',
            'en.deskripsi_singkat' => 'nullable|string',
            'en.deskripsi_lengkap' => 'nullable|string',
            'en.kompetensi' => 'array',
            'en.kompetensi.*' => 'string|max:255',
            'en.prospek_karir' => 'array',
            'en.prospek_karir.*' => 'string|max:255',
            'en.fasilitas' => 'array',
            'en.fasilitas.*' => 'string|max:255',
        ]);

        DB::transaction(function () use ($jurusan, $validated, $request) {
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
        });

        return redirect()->route('admin.jurusan.index')->with('success', 'Jurusan berhasil diperbarui');
    }
}
