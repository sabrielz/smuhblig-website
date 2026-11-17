<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class EkstrakurikulerController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $cacheKey = "public.ekskul.{$locale}";

        $ekskulList = Cache::remember($cacheKey, 600, function () use ($locale) {
            return Ekstrakurikuler::query()
                ->active()
                ->ordered()
                ->with(['translations', 'pembina', 'media'])
                ->get()
                ->map(function (Ekstrakurikuler $item) use ($locale) {
                    $trans = $item->translation($locale);
                    /** @var Guru|null $pembina */
                    $pembina = $item->pembina;

                    return [
                        'id' => $item->id,
                        'slug' => $item->slug,
                        'nama' => $trans ? $trans->nama : '',
                        'deskripsi' => $trans ? $trans->deskripsi : null,
                        'jadwal' => $trans ? $trans->jadwal : null,
                        'pembina' => $pembina ? [
                            'id' => $pembina->id,
                            'nama_lengkap' => $pembina->nama_lengkap,
                        ] : null,
                        'foto_url' => $item->getFirstMediaUrl('foto', 'medium') ?: $item->getFirstMediaUrl('foto') ?: null,
                    ];
                });
        });

        // SEO
        $title = $locale === 'en' ? 'Extracurricular Activities' : 'Ekstrakurikuler & Pengembangan Diri';
        $description = $locale === 'en'
            ? 'Explore extracurricular clubs and student activities at SMK Muhammadiyah Bligo.'
            : 'Jelajahi kegiatan ekstrakurikuler, kepanduan, olahraga, dan seni untuk pengembangan bakat siswa di SMK Muhammadiyah Bligo.';

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);

        return Inertia::render('Public/Ekstrakurikuler/Index', [
            'ekskulList' => $ekskulList,
        ]);
    }

    public function show(Ekstrakurikuler $ekstrakurikuler)
    {
        if (! $ekstrakurikuler->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();
        $ekstrakurikuler->load(['translations', 'pembina', 'media']);
        $trans = $ekstrakurikuler->translation($locale);
        /** @var Guru|null $pembina */
        $pembina = $ekstrakurikuler->pembina;

        $nama = $trans ? $trans->nama : $ekstrakurikuler->slug;
        $deskripsi = $trans ? $trans->deskripsi : '';
        $jadwal = $trans ? $trans->jadwal : null;
        $fotoUrl = $ekstrakurikuler->getFirstMediaUrl('foto') ?: null;

        // SEO
        SEOMeta::setTitle($nama);
        SEOMeta::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));
        OpenGraph::setTitle($nama);
        OpenGraph::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));
        if ($fotoUrl) {
            OpenGraph::addImage($fotoUrl);
        }
        TwitterCard::setTitle($nama);
        TwitterCard::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));

        return Inertia::render('Public/Ekstrakurikuler/Show', [
            'ekskul' => [
                'id' => $ekstrakurikuler->id,
                'slug' => $ekstrakurikuler->slug,
                'nama' => $nama,
                'deskripsi' => $deskripsi,
                'jadwal' => $jadwal,
                'pembina' => $pembina ? [
                    'id' => $pembina->id,
                    'nama_lengkap' => $pembina->nama_lengkap,
                    'jabatan' => $pembina->translation($locale)?->jabatan,
                    'foto_url' => $pembina->getFirstMediaUrl('foto', 'thumb') ?: null,
                ] : null,
                'foto_url' => $fotoUrl,
            ],
        ]);
    }
}
