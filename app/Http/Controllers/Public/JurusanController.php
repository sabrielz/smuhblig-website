<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurusanResource;
use App\Models\Jurusan;
use App\Models\Pengaturan;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
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

        SEOMeta::setTitle('Program Keahlian | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Lima program keahlian unggulan SMK Muhammadiyah Bligo: AKL, FKK, TKJ, TKR, TSM. Pilih jurusan terbaik untuk masa depan Anda.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Jurusan/Index', [
            'jurusan' => JurusanResource::collection($jurusan)->resolve(),
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
            $jurusan->load(['translations', 'media', 'mitras.media']);

            return $jurusan;
        });

        $translationTitle = $data->translation()?->nama ?? $data->kode;
        $translationDesc = $data->translation()?->deskripsi_singkat ?? '';

        SEOMeta::setTitle($translationTitle.' | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription(Str::limit($translationDesc, 155));
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');
        if ($data->getFirstMediaUrl('cover')) {
            OpenGraph::addImage($data->getFirstMediaUrl('cover'));
        }

        // Ambil jurusan lain
        $jurusanLain = Cache::remember("public.jurusan.others.{$jurusan->id}.{$locale}", 3600, function () use ($jurusan) {
            return Jurusan::active()
                ->where('id', '!=', $jurusan->id)
                ->ordered()
                ->limit(4)
                ->with('translations')
                ->get();
        });

        // Ambil pengaturan spmb_url jika ada. Jika tidak ada fallback ke '#' atau route.
        $pengaturan = Cache::remember('public.pengaturan.spmb_url', 3600, function () {
            return Pengaturan::get('spmb_url') ?: '#';
        });

        return Inertia::render('Public/Jurusan/Show', [
            'jurusan' => new JurusanResource($data),
            'jurusanLain' => JurusanResource::collection($jurusanLain)->resolve(),
            'pengaturan' => [
                'spmb_url' => $pengaturan,
            ],
        ]);
    }
}
