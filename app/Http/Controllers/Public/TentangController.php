<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TentangController extends Controller
{
    public function index(): Response
    {
        $locale = app()->getLocale();

        $data = Cache::remember('public.tentang', 60 * 60, function () {
            return [
                'pengaturan' => Pengaturan::getAllSettings(),
            ];
        });

        $kontenHero = \App\Models\HalamanKonten::getSection('tentang', 'hero', $locale);
        $kontenProfil = \App\Models\HalamanKonten::getSection('tentang', 'profil', $locale);
        $kontenVisiMisi = \App\Models\HalamanKonten::getSection('tentang', 'visi_misi', $locale);
        $kontenNilai = \App\Models\HalamanKonten::getSection('tentang', 'nilai', $locale);

        $strukturOrganisasi = \App\Models\StrukturOrganisasi::where('level', 0)
            ->with(['children' => function ($q) {
                $q->with(['children' => function ($q2) {
                    $q2->where('is_active', true)->orderBy('urutan');
                }])->where('is_active', true)->orderBy('urutan');
            }])
            ->where('is_active', true)
            ->first();

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle('Tentang Kami | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription('Mengenal lebih dekat visi, misi, dan profil SMK Muhammadiyah Bligo, lembaga pendidikan menengah kejuruan unggul dan berakhlak.');
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Tentang', [
            'pengaturan' => $data['pengaturan'],
            'kontenHero' => $kontenHero,
            'kontenProfil' => $kontenProfil,
            'kontenVisiMisi' => $kontenVisiMisi,
            'kontenNilai' => $kontenNilai,
            'strukturOrganisasi' => $strukturOrganisasi,
        ]);
    }
}
