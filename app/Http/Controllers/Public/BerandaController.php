<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\HalamanKonten;
use App\Models\Jurusan;
use App\Models\Mitra;
use App\Models\Pengaturan;
use App\Models\Pengumuman;
use App\Models\Prestasi;
use App\Models\Statistik;
use App\Models\Testimoni;
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

        $cacheCallback = function () use ($locale) {
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

            // ── 3 Prestasi terbaru ───────────────────────────────────────
            $prestasiTerbaru = Prestasi::query()
                ->active()
                ->ordered()
                ->limit(3)
                ->with(['translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id']), 'media'])
                ->get()
                ->map(function (Prestasi $p) use ($locale) {
                    $translation = $p->translation($locale);

                    return [
                        'id' => $p->id,
                        'slug' => $p->slug,
                        'tingkat' => $p->tingkat->value,
                        'tingkat_label' => $p->tingkat->label($locale),
                        'kategori' => $p->kategori->value,
                        'tahun' => $p->tahun,
                        'judul' => $translation ? $translation->judul : $p->slug,
                        'ringkasan' => $translation ? ($translation->ringkasan ?? '') : '',
                        'foto_url' => $p->getFirstMediaUrl('foto', 'medium') ?: $p->getFirstMediaUrl('foto') ?: null,
                    ];
                });

            // ── Testimoni (maks 8 yang berizin & aktif) ───────────────────────
            $testimoni = Testimoni::query()
                ->tampil()
                ->ordered()
                ->limit(8)
                ->with(['translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id']), 'media'])
                ->get()
                ->map(function (Testimoni $t) use ($locale) {
                    $translation = $t->translation($locale);
                    $media = $t->getFirstMedia('foto');

                    return [
                        'id' => $t->id,
                        'nama' => $t->nama,
                        'peran' => $t->peran,
                        'keterangan' => $t->keterangan,
                        'kutipan' => $translation ? $translation->kutipan : '',
                        'foto_url' => $media ? ($media->getUrl('thumb') ?: $media->getUrl()) : null,
                    ];
                });

            // ── Mitra Industri Aktif ──────────────────────────────────────────
            $mitraIndustri = Mitra::query()
                ->active()
                ->ordered()
                ->with('media')
                ->get()
                ->map(function (Mitra $m) {
                    $media = $m->getFirstMedia('logo');

                    return [
                        'id' => $m->id,
                        'nama' => $m->nama,
                        'bidang' => $m->bidang,
                        'url' => $m->url,
                        'logo_url' => $media ? ($media->getUrl('thumb') ?: $media->getUrl()) : null,
                    ];
                });

            // ── Pengaturan ─────────────────────────────────────────────────────
            $settings = Pengaturan::getAllSettings();

            return [
                'jurusan' => $jurusan,
                'prestasiTerbaru' => $prestasiTerbaru,
                'beritaTerbaru' => $beritaTerbaru,
                'testimoni' => $testimoni,
                'mitraIndustri' => $mitraIndustri,
                'pengaturan' => [
                    'site_name' => $settings['site_name'] ?? 'SMK Muhammadiyah Bligo',
                    'tagline' => $settings['site_tagline'] ?? 'Mencetak Generasi Unggul dan Berakhlak Mulia',
                    'spmb_url' => $settings['spmb_url'] ?? '#',
                    ...$settings,
                ],
            ];
        };

        if (Cache::supportsTags()) {
            $data = Cache::tags(['publik', 'beranda'])->remember("beranda:{$locale}", now()->addMinutes(30), $cacheCallback);
        } else {
            $data = Cache::remember("beranda:{$locale}", now()->addMinutes(30), $cacheCallback);
        }

        $kontenHero = HalamanKonten::getSection('beranda', 'hero', $locale);
        $kontenStatistik = HalamanKonten::getSection('beranda', 'statistik', $locale);
        $kontenJurusan = HalamanKonten::getSection('beranda', 'jurusan', $locale);
        $kontenBerita = HalamanKonten::getSection('beranda', 'berita', $locale);
        $kontenCtaAkhir = HalamanKonten::getSection('beranda', 'cta_akhir', $locale);
        $statistik = Statistik::active()->ordered()->get();

        $pengumumanUrgentModel = Pengumuman::query()
            ->aktif()
            ->where('tipe', 'urgent')
            ->with(['translations' => fn ($q) => $q->whereIn('locale', [$locale, 'id'])])
            ->orderByDesc('tanggal_mulai')
            ->orderByDesc('created_at')
            ->first();

        $pengumumanUrgent = null;
        if ($pengumumanUrgentModel) {
            $trans = $pengumumanUrgentModel->translation($locale) ?? $pengumumanUrgentModel->translation('id');
            $pengumumanUrgent = [
                'id' => $pengumumanUrgentModel->id,
                'slug' => $pengumumanUrgentModel->slug,
                'judul' => $trans ? $trans->judul : 'Pengumuman Penting',
            ];
        }

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
            'pengumumanUrgent' => $pengumumanUrgent,
        ]));
    }
}
