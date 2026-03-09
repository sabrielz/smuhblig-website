<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\JurusanResource;
use App\Models\Jurusan;
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

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle('Program Keahlian | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription('Lima program keahlian unggulan SMK Muhammadiyah Bligo: AKL, FKK, TKJ, TKR, TSM. Pilih jurusan terbaik untuk masa depan Anda.');
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'website');

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
            $jurusan->load(['translations', 'media']);

            return $jurusan;
        });

        $translationTitle = $data->translation()?->nama ?? $data->kode;
        $translationDesc = $data->translation()?->deskripsi_singkat ?? '';

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle($translationTitle . ' | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription(Str::limit($translationDesc, 155));
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'website');
        if ($data->getFirstMediaUrl('cover')) {
            \Artesaos\SEOTools\Facades\OpenGraph::addImage($data->getFirstMediaUrl('cover'));
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
            // Asumsi ada model Pengaturan, jika tidak ada, default to '#'
            // Kita coba pakai DB facade jika model tidak ada
            try {
                $setting = \Illuminate\Support\Facades\DB::table('settings')->where('key', 'spmb_url')->first();
                return $setting ? $setting->value : '#';
            } catch (\Exception $e) {
                return '#'; // Fallback
            }
        });

        return Inertia::render('Public/Jurusan/Show', [
            'jurusan' => new JurusanResource($data),
            'jurusanLain' => JurusanResource::collection($jurusanLain)->resolve(),
            'pengaturan' => [
                'spmb_url' => $pengaturan
            ]
        ]);
    }
}
