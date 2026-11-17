<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\HalamanKonten;
use App\Models\Jurusan;
use App\Models\Pengaturan;
use App\Models\Statistik;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
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
                ->with(['translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id'])])
                ->get()
                ->map(function (Jurusan $j) use ($locale) {
                    $translation = $j->translation($locale);

                    return [
                        'kode' => $j->kode,
                        'slug' => $j->slug,
                        'nama' => $translation?->nama ?? $j->kode,
                        'tagline' => $translation?->tagline ?? '',
                        'deskripsi' => $translation?->deskripsi ?? '',
                        'color_start' => $j->color_start,
                        'color_end' => $j->color_end,
                        'icon_name' => $j->icon_name,
                    ];
                });

            // ── 3 Artikel terbit terbaru ────────────────────────────────────
            $beritaTerbaru = Article::query()
                ->terbit()
                ->orderByDesc('published_at')
                ->limit(3)
                ->with([
                    'category',
                    'category.translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id']),
                    'translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id']),
                    'user:id,name',
                ])
                ->get()
                ->map(function (Article $a) use ($locale) {
                    $translation = $a->translation($locale);
                    $catTranslation = $a->category ? $a->category->translation($locale) : null;

                    return [
                        'id' => $a->id,
                        'title' => $translation?->title ?? $a->slug,
                        'excerpt' => $translation?->excerpt ?? '',
                        'slug' => $a->slug,
                        'thumbnail' => $a->getFirstMediaUrl('thumbnail') ?: asset('images/placeholder-artikel.svg'),
                        'published_at' => optional($a->published_at)->translatedFormat('d M Y') ?? '',
                        'category' => [
                            'name' => $catTranslation?->name ?? optional($a->category)->name ?? '',
                            'color' => optional($a->category)->color ?? '#003f87',
                        ],
                        'author' => [
                            'name' => optional($a->user)->name ?? 'Admin',
                            'avatar' => 'https://ui-avatars.com/api/?name='.urlencode(optional($a->user)->name ?? 'A').'&background=003f87&color=fff&size=64',
                        ],
                    ];
                });

            // ── Pengaturan ─────────────────────────────────────────────────────
            $settings = Pengaturan::getAllSettings();

            return [
                'jurusan' => $jurusan,
                'beritaTerbaru' => $beritaTerbaru,
                'pengaturan' => [
                    'site_name' => $settings['site_name'] ?? 'SMK Muhammadiyah Bligo',
                    'tagline' => $settings['site_tagline'] ?? 'Mencetak Generasi Unggul dan Berakhlak Mulia',
                    'spmb_url' => $settings['spmb_url'] ?? '#',
                    ...$settings,
                ],
            ];
        });

        $kontenHero = HalamanKonten::getSection('beranda', 'hero', $locale);
        $kontenStatistik = HalamanKonten::getSection('beranda', 'statistik', $locale);
        $kontenJurusan = HalamanKonten::getSection('beranda', 'jurusan', $locale);
        $kontenBerita = HalamanKonten::getSection('beranda', 'berita', $locale);
        $kontenCtaAkhir = HalamanKonten::getSection('beranda', 'cta_akhir', $locale);
        $statistik = Statistik::active()->ordered()->get();

        $siteName = $data['pengaturan']['site_name'];
        $tagline = $data['pengaturan']['tagline'];
        SEOMeta::setTitle('Beranda | '.$siteName);
        SEOMeta::setDescription($tagline);
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Beranda', array_merge($data, [
            'statistik' => $statistik,
            'kontenHero' => $kontenHero,
            'kontenStatistik' => $kontenStatistik,
            'kontenJurusan' => $kontenJurusan,
            'kontenBerita' => $kontenBerita,
            'kontenCtaAkhir' => $kontenCtaAkhir,
        ]));
    }
}
