<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
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

        SEOMeta::setTitle('Galeri | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Koleksi foto dan galeri kegiatan di SMK Muhammadiyah Bligo.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Galeri', [
            'galleries' => $galleries,
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

        SEOMeta::setTitle($album['title'].' | Galeri SMK Muhammadiyah Bligo');
        SEOMeta::setDescription($album['description'] ?: 'Dokumentasi foto kegiatan '.$album['title']);
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'article');
        OpenGraph::addImage($thumbnailUrl);
        TwitterCard::setImage($thumbnailUrl);

        return Inertia::render('Public/GaleriDetail', [
            'album' => $album,
        ]);
    }
}
