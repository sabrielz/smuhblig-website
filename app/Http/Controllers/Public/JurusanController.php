<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurusanResource;
use App\Models\Jurusan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class JurusanController extends Controller
{
    /**
     * Listing halaman: semua jurusan aktif.
     * Cache: 60 menit.
     */
    public function index(): Response
    {
        $locale = app()->getLocale();

        $jurusan = Cache::remember("public.jurusan.index.{$locale}", 3600, function () {
            return Jurusan::active()
                ->ordered()
                ->with('translations')
                ->withCount('translations')
                ->get();
        });

        return Inertia::render('Public/Jurusan/Index', [
            'jurusan' => JurusanResource::collection($jurusan)->resolve(),
            'seo'     => [
                'title'       => 'Program Keahlian — SMK Muhammadiyah Bligo',
                'description' => 'Lima program keahlian unggulan SMK Muhammadiyah Bligo: AKL, FKK, TKJ, TKR, TSM. Pilih jurusan terbaik untuk masa depan Anda.',
            ],
        ]);
    }

    /**
     * Detail jurusan: route model binding via slug.
     * Cache: 60 menit per slug.
     */
    public function show(Jurusan $jurusan): Response
    {
        abort_if(! $jurusan->is_active, 404);

        $locale = app()->getLocale();

        $data = Cache::remember("public.jurusan.show.{$jurusan->slug}.{$locale}", 3600, function () use ($jurusan) {
            // Load relasi yang dibutuhkan
            $jurusan->load(['translations', 'media']);

            return $jurusan;
        });

        return Inertia::render('Public/Jurusan/Show', [
            'jurusan' => new JurusanResource($data),
            'seo'     => [
                'title'       => ($data->translation()?->nama ?? $data->kode) . ' — SMK Muhammadiyah Bligo',
                'description' => $data->translation()?->deskripsi_singkat ?? '',
            ],
        ]);
    }
}
