<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Jurusan;
use App\Models\Prestasi;
use App\Support\JsonLd;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $cacheKey = "public.prestasi.{$locale}";

        $prestasiList = Cache::remember($cacheKey, 600, function () use ($locale) {
            return Prestasi::query()
                ->active()
                ->ordered()
                ->with(['translations', 'jurusan.translations', 'media'])
                ->get()
                ->map(function (Prestasi $item) use ($locale) {
                    $trans = $item->translation($locale);
                    /** @var Jurusan|null $jurusan */
                    $jurusan = $item->jurusan;
                    $jurusanTrans = $jurusan?->translation($locale);

                    return [
                        'id' => $item->id,
                        'slug' => $item->slug,
                        'tingkat' => $item->tingkat->value,
                        'tingkat_label' => $item->tingkat->label($locale),
                        'kategori' => $item->kategori->value,
                        'kategori_label' => $item->kategori->label($locale),
                        'tahun' => $item->tahun,
                        'tanggal' => $item->tanggal?->format('d M Y'),
                        'jurusan_id' => $item->jurusan_id,
                        'jurusan' => $jurusan ? [
                            'id' => $jurusan->id,
                            'nama' => $jurusanTrans ? $jurusanTrans->nama : $jurusan->kode,
                            'slug' => $jurusan->slug,
                        ] : null,
                        'judul' => $trans ? $trans->judul : '',
                        'ringkasan' => $trans ? $trans->ringkasan : null,
                        'foto_url' => $item->getFirstMediaUrl('foto', 'medium') ?: $item->getFirstMediaUrl('foto') ?: null,
                    ];
                });
        });

        // SEO
        $title = $locale === 'en' ? 'Achievements & Honors' : 'Prestasi & Kejuaraan Siswa';
        $description = $locale === 'en'
            ? 'Explore academic and non-academic awards, competition honors, and student achievements at SMK Muhammadiyah Bligo.'
            : 'Jejak prestasi, penghargaan kejuaraan akademik dan non-akademik siswa SMK Muhammadiyah Bligo di tingkat kabupaten hingga nasional.';

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);

        return Inertia::render('Public/Prestasi/Index', [
            'prestasiList' => $prestasiList,
        ]);
    }

    public function show(Prestasi $prestasi)
    {
        if (! $prestasi->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();
        $prestasi->load(['translations', 'jurusan.translations', 'media']);
        $trans = $prestasi->translation($locale);
        /** @var Jurusan|null $jurusan */
        $jurusan = $prestasi->jurusan;
        $jurusanTrans = $jurusan?->translation($locale);

        $judul = $trans ? $trans->judul : $prestasi->slug;
        $ringkasan = $trans ? $trans->ringkasan : '';
        $fotoUrl = $prestasi->getFirstMediaUrl('foto') ?: null;

        // SEO
        SEOMeta::setTitle($judul.' | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription(strip_tags(mb_substr($ringkasan ?: $judul, 0, 160)));
        SEOMeta::setCanonical(route('prestasi.show', ['prestasi' => $prestasi->slug]));
        OpenGraph::setTitle($judul);
        OpenGraph::setDescription(strip_tags(mb_substr($ringkasan ?: $judul, 0, 160)));
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'article');
        $img = $fotoUrl ?: url('/images/og-default.jpg');
        OpenGraph::addImage($img);
        TwitterCard::setTitle($judul);
        TwitterCard::setDescription(strip_tags(mb_substr($ringkasan ?: $judul, 0, 160)));
        TwitterCard::setImage($img);

        $jsonLd = JsonLd::achievement($prestasi, [
            'judul' => $judul,
            'ringkasan' => $ringkasan,
        ]);

        return Inertia::render('Public/Prestasi/Show', [
            'prestasi' => [
                'id' => $prestasi->id,
                'slug' => $prestasi->slug,
                'tingkat' => $prestasi->tingkat->value,
                'tingkat_label' => $prestasi->tingkat->label($locale),
                'kategori' => $prestasi->kategori->value,
                'kategori_label' => $prestasi->kategori->label($locale),
                'tahun' => $prestasi->tahun,
                'tanggal' => $prestasi->tanggal?->format('d F Y'),
                'jurusan' => $jurusan ? [
                    'id' => $jurusan->id,
                    'nama' => $jurusanTrans ? $jurusanTrans->nama : $jurusan->kode,
                    'slug' => $jurusan->slug,
                ] : null,
                'judul' => $judul,
                'ringkasan' => $ringkasan,
                'foto_url' => $fotoUrl,
            ],
            'jsonLd' => [$jsonLd],
        ]);
    }
}
