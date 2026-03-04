<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Tautan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TautanController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();

        $cacheKey = "public_tautan_{$locale}";
        $groupedLinks = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($locale) {
            $tautans = Tautan::query()
                ->active()
                ->ordered()
                ->get()
                ->map(function ($tautan) use ($locale) {
                    return [
                        'id' => $tautan->id,
                        'label' => $locale === 'en' && $tautan->label_en ? $tautan->label_en : $tautan->label,
                        'description' => $locale === 'en' && $tautan->deskripsi_en ? $tautan->deskripsi_en : $tautan->deskripsi,
                        'url' => $tautan->url,
                        'icon_name' => $tautan->icon_name,
                        'kategori' => $tautan->kategori,
                        'buka_tab_baru' => $tautan->buka_tab_baru,
                    ];
                });

            // Group by category
            return $tautans->groupBy('kategori')->map(function ($items, $category) {
                return [
                    'category' => $category,
                    'items' => $items->values()->toArray(),
                ];
            })->values()->toArray();
        });

        return Inertia::render('Public/Tautan', [
            'groupedLinks' => $groupedLinks,
        ]);
    }
}
