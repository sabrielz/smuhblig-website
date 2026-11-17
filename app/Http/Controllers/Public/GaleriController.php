<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
use App\Models\Video;
use App\Services\AnalitikService;
use App\Support\JsonLd;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class GaleriController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $cacheKey = "public_galeri_{$locale}";
        $galleries = Cache::remember($cacheKey, now()->addMinutes(30), function () use ($locale) {
            return Galeri::query()
                ->active()
                ->with([
                    'translations' => function ($query) use ($locale) {
                        $query->whereIn('locale', [$locale, 'id']);
                    },
                    'media' => function ($query) {
                        $query->where('collection_name', 'photos');
                    },
                ])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($galeri) use ($locale) {
                    $translation = call_user_func([$galeri, 'translation'], $locale) ?? $galeri->translations->first();
                    $photos = $galeri->getMedia('photos');

                    return [
                        'id' => $galeri->id,
                        'slug' => $galeri->slug,
                        'title' => $translation ? $translation->title : '',
                        'description' => $translation ? $translation->description : '',
                        'event_date' => $galeri->event_date ? $galeri->event_date->format('Y-m-d') : null,
                        'formatted_date' => $galeri->event_date ? $galeri->event_date->translatedFormat('d F Y') : null,
                        'photo_count' => $photos->count(),
                        'thumbnail_url' => $photos->first() ? $photos->first()->getUrl() : asset('images/placeholder-artikel.svg'),
                        'photos' => $photos->map(fn ($media) => $media->getUrl())->toArray(),
                    ];
                });
        });

        $videoCacheKey = "public_video_{$locale}";
        $videos = Cache::remember($videoCacheKey, now()->addMinutes(30), function () use ($locale) {
            return Video::query()
                ->active()
                ->ordered()
                ->with(['translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id']), 'galeri.translations'])
                ->get()
                ->map(function (Video $v) use ($locale) {
                    $trans = $v->translation($locale);

                    return [
                        'id' => $v->id,
                        'youtube_id' => $v->youtube_id,
                        'thumbnail_url' => $v->thumbnail_url,
                        'watch_url' => $v->watch_url,
                        'judul' => $trans ? $trans->judul : '',
                        'galeri_id' => $v->galeri_id,
                        'galeri_title' => $v->galeri ? (($trans = $v->galeri->translation($locale)) ? $trans->title : $v->galeri->slug) : null,
                    ];
                });
        });

        SEOMeta::setTitle('Galeri | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Koleksi foto dan video kegiatan di SMK Muhammadiyah Bligo.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Galeri', [
            'galleries' => $galleries,
            'videos' => $videos,
        ]);
    }

    public function show(Galeri $galeri): Response
    {
        if (! $galeri->is_active) {
            abort(404);
        }

        $locale = app()->getLocale();
        $galeri->load([
            'translations' => function ($query) use ($locale) {
                $query->whereIn('locale', [$locale, 'id']);
            },
            'media' => function ($query) {
                $query->where('collection_name', 'photos');
            },
        ]);

        $translation = call_user_func([$galeri, 'translation'], $locale) ?? $galeri->translations->first();
        $photos = $galeri->getMedia('photos');
        $photoUrls = $photos->map(fn ($media) => $media->getUrl())->toArray();
        $thumbnailUrl = $photoUrls[0] ?? asset('images/placeholder-artikel.svg');

        $album = [
            'id' => $galeri->id,
            'slug' => $galeri->slug,
            'title' => $translation ? $translation->title : 'Album Foto',
            'description' => $translation ? $translation->description : '',
            'event_date' => $galeri->event_date ? $galeri->event_date->format('Y-m-d') : null,
            'formatted_date' => $galeri->event_date ? $galeri->event_date->translatedFormat('d F Y') : null,
            'photo_count' => count($photoUrls),
            'thumbnail_url' => $thumbnailUrl,
            'photos' => $photoUrls,
        ];

        AnalitikService::catat(request(), 'galeri', $galeri->id);

        SEOMeta::setTitle($album['title'].' | Galeri SMK Muhammadiyah Bligo');
        SEOMeta::setDescription($album['description'] ?: 'Dokumentasi foto kegiatan '.$album['title']);
        SEOMeta::setCanonical(route('galeri.show', ['galeri' => $galeri->slug]));
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'article');
        OpenGraph::addImage($thumbnailUrl ?: url('/images/og-default.jpg'));
        TwitterCard::setImage($thumbnailUrl ?: url('/images/og-default.jpg'));

        $jsonLd = JsonLd::imageGallery($galeri, $album);

        return Inertia::render('Public/GaleriDetail', [
            'album' => $album,
            'jsonLd' => [$jsonLd],
        ]);
    }
}
