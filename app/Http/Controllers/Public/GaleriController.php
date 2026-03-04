<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Galeri;
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
                        $query->where('locale', $locale);
                    },
                    'media' => function ($query) {
                        $query->where('collection_name', 'photos');
                    }
                ])
                ->orderBy('sort_order', 'asc')
                ->get()
                ->map(function ($galeri) use ($locale) {
                    $translation = $galeri->translations->first();
                    $photos = $galeri->getMedia('photos');

                    return [
                        'id' => $galeri->id,
                        'slug' => $galeri->slug,
                        'title' => $translation ? $translation->title : '',
                        'description' => $translation ? $translation->description : '',
                        'event_date' => $galeri->event_date ? $galeri->event_date->format('Y-m-d') : null,
                        'formatted_date' => $galeri->event_date ? $galeri->event_date->translatedFormat('d F Y') : null,
                        'photo_count' => $photos->count() > 0 ? $photos->count() : 4,
                        'thumbnail_url' => $photos->first() ? $photos->first()->getUrl() : 'https://picsum.photos/seed/galeri-'.$galeri->id.'/800/600',
                        'photos' => $photos->isEmpty() ? [
                            'https://picsum.photos/seed/galeri-'.$galeri->id.'-1/800/1000',
                            'https://picsum.photos/seed/galeri-'.$galeri->id.'-2/1000/800',
                            'https://picsum.photos/seed/galeri-'.$galeri->id.'-3/800/800',
                            'https://picsum.photos/seed/galeri-'.$galeri->id.'-4/1200/800',
                        ] : $photos->map(fn ($media) => $media->getUrl())->toArray(),
                    ];
                });
        });

        return Inertia::render('Public/Galeri', [
            'galleries' => $galleries,
        ]);
    }
}
