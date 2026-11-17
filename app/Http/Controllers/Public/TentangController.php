<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\HalamanKonten;
use App\Models\Pengaturan;
use App\Models\StrukturOrganisasi;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
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

        $kontenHero = HalamanKonten::getSection('tentang', 'hero', $locale);
        $kontenProfil = HalamanKonten::getSection('tentang', 'profil', $locale);
        $kontenVisiMisi = HalamanKonten::getSection('tentang', 'visi_misi', $locale);
        $kontenNilai = HalamanKonten::getSection('tentang', 'nilai', $locale);

        $strukturOrganisasi = StrukturOrganisasi::where('level', 0)
            ->with(['children' => function ($q) {
                $q->with(['children' => function ($q2) {
                    $q2->where('is_active', true)->orderBy('urutan');
                }])->where('is_active', true)->orderBy('urutan');
            }])
            ->where('is_active', true)
            ->first();

        SEOMeta::setTitle('Tentang Kami | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Mengenal lebih dekat visi, misi, dan profil SMK Muhammadiyah Bligo, lembaga pendidikan menengah kejuruan unggul dan berakhlak.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

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
