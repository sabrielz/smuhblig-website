<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Jurusan;
use App\Models\Pengaturan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class BerandaController extends Controller
{
    public function __invoke(): Response
    {
        $locale = app()->getLocale();

        $data = Cache::remember("beranda:{$locale}", now()->addMinutes(30), function () use ($locale) {
            // ── Jurusan aktif dengan translation locale aktif ──────────────────
            $jurusan = Jurusan::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->with(['translations' => fn ($q) => $q->where('locale', $locale)])
                ->get()
                ->map(fn (Jurusan $j) => [
                    'kode'        => $j->kode,
                    'slug'        => $j->slug,
                    'nama'        => optional($j->translations->first())->nama ?? $j->kode,
                    'tagline'     => optional($j->translations->first())->tagline ?? '',
                    'deskripsi'   => optional($j->translations->first())->deskripsi ?? '',
                    'color_start' => $j->color_start,
                    'color_end'   => $j->color_end,
                    'icon_name'   => $j->icon_name,
                ]);

            // ── 3 Artikel published terbaru ────────────────────────────────────
            $beritaTerbaru = Article::query()
                ->published()
                ->orderByDesc('published_at')
                ->limit(3)
                ->with([
                    'category',
                    'category.translations' => fn ($q) => $q->where('locale', $locale),
                    'translations'          => fn ($q) => $q->where('locale', $locale),
                    'user:id,name',
                ])
                ->get()
                ->map(fn (Article $a) => [
                    'id'           => $a->id,
                    'title'        => optional($a->translations->first())->title ?? $a->slug,
                    'excerpt'      => optional($a->translations->first())->excerpt ?? '',
                    'slug'         => $a->slug,
                    'thumbnail'    => $a->getFirstMediaUrl('thumbnail') ?: 'https://picsum.photos/seed/' . $a->id . 'news/800/450',
                    'published_at' => optional($a->published_at)->translatedFormat('d M Y') ?? '',
                    'category'     => [
                        'name'  => optional($a->category)->name ?? '',
                        'color' => optional($a->category)->color ?? '#003f87',
                    ],
                    'author' => [
                        'name'   => optional($a->user)->name ?? 'Admin',
                        'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode(optional($a->user)->name ?? 'A') . '&background=003f87&color=fff&size=64',
                    ],
                ]);

            // ── Pengaturan ─────────────────────────────────────────────────────
            $settings = Pengaturan::whereIn('key', ['site_name', 'tagline', 'spmb_url'])
                ->pluck('value', 'key')
                ->toArray();

            return [
                'jurusan'       => $jurusan,
                'beritaTerbaru' => $beritaTerbaru,
                'pengaturan'    => [
                    'site_name' => $settings['site_name'] ?? 'SMK Muhammadiyah Bligo',
                    'tagline'   => $settings['tagline'] ?? 'Mencetak Generasi Unggul dan Berakhlak Mulia',
                    'spmb_url'  => $settings['spmb_url'] ?? '#',
                ],
            ];
        });

        // ── Statistik (hardcode, nanti dari pengaturan) ──────────────────────
        $statistik = [
            'totalSiswa'   => 800,
            'totalLulusan' => 5000,
            'pengajar'     => 60,
            'tahunBerdiri' => 1985,
        ];

        return Inertia::render('Public/Beranda', array_merge($data, [
            'statistik' => $statistik,
        ]));
    }
}
