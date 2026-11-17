<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Jurusan;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $cacheKey = "public.guru.{$locale}";

        $data = Cache::remember($cacheKey, 600, function () use ($locale) {
            $gurus = Guru::query()
                ->active()
                ->ordered()
                ->with(['translations', 'jurusan.translations', 'media'])
                ->get()
                ->map(function (Guru $guru) use ($locale) {
                    $trans = $guru->translation($locale);
                    /** @var Jurusan|null $jurusan */
                    $jurusan = $guru->jurusan;
                    $jurusanTrans = $jurusan?->translation($locale);

                    return [
                        'id' => $guru->id,
                        'nama' => $guru->nama,
                        'nama_lengkap' => $guru->nama_lengkap,
                        'kelompok' => $guru->kelompok,
                        'jurusan_id' => $guru->jurusan_id,
                        'jurusan' => $jurusan ? [
                            'id' => $jurusan->id,
                            'nama' => $jurusanTrans ? $jurusanTrans->nama : $jurusan->kode,
                            'slug' => $jurusan->slug,
                        ] : null,
                        'jabatan' => $trans ? $trans->jabatan : '',
                        'mapel' => $trans ? $trans->mapel : null,
                        'foto_url' => $guru->getFirstMediaUrl('foto', 'webp') ?: $guru->getFirstMediaUrl('foto') ?: null,
                    ];
                });

            $jurusans = Jurusan::ordered()->with('translations')->get()->map(function (Jurusan $j) use ($locale) {
                $trans = $j->translation($locale);

                return [
                    'id' => $j->id,
                    'nama' => $trans ? $trans->nama : $j->kode,
                    'slug' => $j->slug,
                ];
            });

            return [
                'guruList' => $gurus,
                'jurusans' => $jurusans,
            ];
        });

        $pageTitle = $locale === 'id' ? 'Guru & Tenaga Kependidikan' : 'Teachers & Staff';
        $pageDesc = $locale === 'id'
            ? 'Profil dewan guru dan tenaga kependidikan SMK Muhammadiyah Bligo yang berdedikasi dan profesional.'
            : 'Profiles of dedicated and professional teaching and administrative staff at SMK Muhammadiyah Bligo.';

        SEOMeta::setTitle("{$pageTitle} | SMK Muhammadiyah Bligo");
        SEOMeta::setDescription($pageDesc);
        OpenGraph::setTitle("{$pageTitle} | SMK Muhammadiyah Bligo");
        OpenGraph::setDescription($pageDesc);
        OpenGraph::setUrl(request()->url());
        TwitterCard::setTitle("{$pageTitle} | SMK Muhammadiyah Bligo");
        TwitterCard::setDescription($pageDesc);

        return Inertia::render('Public/Guru', [
            'guruList' => $data['guruList'],
            'jurusans' => $data['jurusans'],
        ]);
    }
}
