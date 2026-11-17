<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Fasilitas;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class FasilitasController extends Controller
{
    public function index(Request $request)
    {
        $locale = app()->getLocale();
        $cacheKey = "public.fasilitas.{$locale}";

        $fasilitas = Cache::remember($cacheKey, 600, function () use ($locale) {
            return Fasilitas::query()
                ->active()
                ->ordered()
                ->with(['translations', 'media'])
                ->get()
                ->map(function (Fasilitas $item) use ($locale) {
                    $trans = $item->translation($locale);
                    $firstMedia = $item->getFirstMedia('foto');

                    return [
                        'id' => $item->id,
                        'slug' => $item->slug,
                        'kategori' => $item->kategori,
                        'nama' => $trans ? $trans->nama : '',
                        'deskripsi' => $trans ? $trans->deskripsi : null,
                        'cover_url' => $firstMedia ? ($firstMedia->getUrl('medium') ?: $firstMedia->getUrl()) : null,
                        'foto_count' => $item->getMedia('foto')->count(),
                    ];
                });
        });

        // SEO
        $title = $locale === 'en' ? 'School Facilities' : 'Fasilitas Sekolah';
        $description = $locale === 'en'
            ? 'Explore facilities and learning infrastructure at SMK Muhammadiyah Bligo.'
            : 'Jelajahi sarana prasarana dan fasilitas pembelajaran modern di SMK Muhammadiyah Bligo.';

        SEOMeta::setTitle($title);
        SEOMeta::setDescription($description);
        OpenGraph::setTitle($title);
        OpenGraph::setDescription($description);
        TwitterCard::setTitle($title);
        TwitterCard::setDescription($description);

        return Inertia::render('Public/Fasilitas/Index', [
            'fasilitas' => $fasilitas,
        ]);
    }

    public function show(Fasilitas $fasilitas)
    {
        if (! $fasilitas->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();
        $fasilitas->load(['translations', 'media']);
        $trans = $fasilitas->translation($locale);

        $photos = $fasilitas->getMedia('foto')->map(function (Media $media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb_url' => $media->getUrl('medium') ?: $media->getUrl(),
                'file_name' => $media->file_name,
            ];
        });

        $nama = $trans ? $trans->nama : $fasilitas->slug;
        $deskripsi = $trans ? $trans->deskripsi : '';

        // SEO
        SEOMeta::setTitle($nama);
        SEOMeta::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));
        OpenGraph::setTitle($nama);
        OpenGraph::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));
        if ($photos->isNotEmpty()) {
            OpenGraph::addImage($photos[0]['url']);
        }
        TwitterCard::setTitle($nama);
        TwitterCard::setDescription(strip_tags(mb_substr($deskripsi ?: $nama, 0, 160)));

        return Inertia::render('Public/Fasilitas/Show', [
            'fasilitas' => [
                'id' => $fasilitas->id,
                'slug' => $fasilitas->slug,
                'kategori' => $fasilitas->kategori,
                'nama' => $nama,
                'deskripsi' => $deskripsi,
                'photos' => $photos,
            ],
        ]);
    }
}
