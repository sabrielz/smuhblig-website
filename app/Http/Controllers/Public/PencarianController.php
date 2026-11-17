<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\PencarianRequest;
use App\Models\Agenda;
use App\Models\Article;
use App\Models\Fasilitas;
use App\Models\Guru;
use App\Models\Jurusan;
use App\Models\Pengumuman;
use Artesaos\SEOTools\Facades\SEOMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PencarianController extends Controller
{
    /**
     * Helper to highlight text without breaking HTML tags.
     */
    private function highlight($text, $keyword)
    {
        if (empty($text) || empty($keyword)) {
            return $text;
        }

        // Only highlight in text, not within tags
        $keyword = preg_quote(trim($keyword), '/');

        return preg_replace("/(?!<[^>]*?>)($keyword)(?![^<]*?>)/i", '<mark class="bg-[#c9a84c]/30 text-inherit rounded-sm px-0.5">$1</mark>', $text);
    }

    public function index(PencarianRequest $request)
    {
        $q = strip_tags(trim($request->input('q')));
        $type = $request->input('type', 'semua');
        $locale = app()->getLocale();

        $hasil = [
            'artikel' => null,
            'jurusan' => [],
            'pengumuman' => [],
            'agenda' => [],
            'guru' => [],
            'fasilitas' => [],
        ];
        $totalHasil = 0;

        $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';

        // Search Jurusan
        if ($type === 'semua' || $type === 'jurusan') {
            $jurusanQuery = Jurusan::query()
                ->where('is_active', true)
                ->join('jurusan_translations', function ($join) use ($locale) {
                    $join->on('jurusans.id', '=', 'jurusan_translations.jurusan_id')
                        ->where('jurusan_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('jurusan_translations.nama', $operator, "%{$q}%")
                        ->orWhere('jurusan_translations.deskripsi_singkat', $operator, "%{$q}%")
                        ->orWhere('jurusan_translations.deskripsi_lengkap', $operator, "%{$q}%");
                })
                ->select('jurusans.*', 'jurusan_translations.nama', 'jurusan_translations.deskripsi_singkat')
                ->with('media') // For thumbnail
                ->get();

            $hasil['jurusan'] = $jurusanQuery->map(function ($j) use ($q) {
                return [
                    'id' => $j->id,
                    'slug' => $j->slug,
                    'kode' => $j->kode,
                    'nama' => $this->highlight($j->nama ?? $j->kode, $q),
                    'deskripsi_singkat' => $this->highlight($j->deskripsi_singkat, $q),
                    'thumbnail' => $j->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/400x300',
                ];
            });

            $totalHasil += $hasil['jurusan']->count();
        }

        // Search Pengumuman
        if ($type === 'semua' || $type === 'pengumuman') {
            $pengumumanQuery = Pengumuman::query()
                ->aktif()
                ->join('pengumuman_translations', function ($join) use ($locale) {
                    $join->on('pengumuman.id', '=', 'pengumuman_translations.pengumuman_id')
                        ->where('pengumuman_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('pengumuman_translations.judul', $operator, "%{$q}%")
                        ->orWhere('pengumuman_translations.konten', $operator, "%{$q}%");
                })
                ->select('pengumuman.*', 'pengumuman_translations.judul', 'pengumuman_translations.konten')
                ->orderByDesc('created_at')
                ->get();

            $hasil['pengumuman'] = $pengumumanQuery->map(function ($p) use ($q) {
                return [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'tipe' => $p->tipe,
                    'judul' => $this->highlight($p->judul ?? 'Pengumuman', $q),
                    'konten' => $this->highlight(strip_tags($p->konten ?? ''), $q),
                    'tanggal_mulai' => $p->tanggal_mulai ? $p->tanggal_mulai->format('d M Y') : null,
                ];
            });

            $totalHasil += $hasil['pengumuman']->count();
        }

        // Search Agenda
        if ($type === 'semua' || $type === 'agenda') {
            $agendaQuery = Agenda::query()
                ->active()
                ->join('agenda_translations', function ($join) use ($locale) {
                    $join->on('agendas.id', '=', 'agenda_translations.agenda_id')
                        ->where('agenda_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('agenda_translations.judul', $operator, "%{$q}%")
                        ->orWhere('agenda_translations.deskripsi', $operator, "%{$q}%")
                        ->orWhere('agenda_translations.lokasi', $operator, "%{$q}%");
                })
                ->select('agendas.*', 'agenda_translations.judul', 'agenda_translations.deskripsi', 'agenda_translations.lokasi')
                ->orderByDesc('tanggal_mulai')
                ->get();

            $hasil['agenda'] = $agendaQuery->map(function ($ag) use ($q) {
                return [
                    'id' => $ag->id,
                    'slug' => $ag->slug,
                    'tipe' => $ag->tipe,
                    'warna' => $ag->warna,
                    'judul' => $this->highlight($ag->judul ?? 'Agenda', $q),
                    'deskripsi' => $this->highlight(strip_tags($ag->deskripsi ?? ''), $q),
                    'lokasi' => $this->highlight($ag->lokasi ?? '', $q),
                    'tanggal_mulai' => $ag->tanggal_mulai->format('d M Y'),
                    'tanggal_selesai' => $ag->tanggal_selesai ? $ag->tanggal_selesai->format('d M Y') : null,
                ];
            });

            $totalHasil += $hasil['agenda']->count();
        }

        // Search Guru & Tendik
        if ($type === 'semua' || $type === 'guru') {
            $guruQuery = Guru::query()
                ->active()
                ->join('guru_translations', function ($join) use ($locale) {
                    $join->on('guru.id', '=', 'guru_translations.guru_id')
                        ->where('guru_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('guru.nama', $operator, "%{$q}%")
                        ->orWhere('guru_translations.jabatan', $operator, "%{$q}%")
                        ->orWhere('guru_translations.mapel', $operator, "%{$q}%");
                })
                ->select('guru.*', 'guru_translations.jabatan', 'guru_translations.mapel')
                ->with('media')
                ->get();

            $hasil['guru'] = $guruQuery->map(function ($g) use ($q) {
                return [
                    'id' => $g->id,
                    'nama' => $this->highlight($g->nama_lengkap, $q),
                    'kelompok' => $g->kelompok,
                    'jabatan' => $this->highlight($g->jabatan ?? '', $q),
                    'mapel' => $this->highlight($g->mapel ?? '', $q),
                    'foto_url' => $g->getFirstMediaUrl('foto', 'webp') ?: $g->getFirstMediaUrl('foto') ?: null,
                    'url' => route('guru.index'),
                ];
            });

            $totalHasil += $hasil['guru']->count();
        }

        // Search Fasilitas
        if ($type === 'semua' || $type === 'fasilitas') {
            $fasilitasQuery = Fasilitas::query()
                ->active()
                ->join('fasilitas_translations', function ($join) use ($locale) {
                    $join->on('fasilitas.id', '=', 'fasilitas_translations.fasilitas_id')
                        ->where('fasilitas_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('fasilitas_translations.nama', $operator, "%{$q}%")
                        ->orWhere('fasilitas_translations.deskripsi', $operator, "%{$q}%");
                })
                ->select('fasilitas.*', 'fasilitas_translations.nama', 'fasilitas_translations.deskripsi')
                ->with('media')
                ->get();

            $hasil['fasilitas'] = $fasilitasQuery->map(function ($f) use ($q) {
                $firstMedia = $f->getFirstMedia('foto');

                return [
                    'id' => $f->id,
                    'slug' => $f->slug,
                    'kategori' => $f->kategori,
                    'nama' => $this->highlight($f->nama ?? 'Fasilitas', $q),
                    'deskripsi' => $this->highlight(strip_tags($f->deskripsi ?? ''), $q),
                    'cover_url' => $firstMedia ? ($firstMedia->getUrl('medium') ?: $firstMedia->getUrl()) : null,
                    'url' => route('fasilitas.show', $f->slug),
                ];
            });

            $totalHasil += $hasil['fasilitas']->count();
        }

        // Search Artikel
        if ($type === 'semua' || $type === 'artikel') {
            $artikelQuery = Article::query()
                ->terbit()
                ->join('article_translations', function ($join) use ($locale) {
                    $join->on('articles.id', '=', 'article_translations.article_id')
                        ->where('article_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q, $operator) {
                    $query->where('article_translations.title', $operator, "%{$q}%")
                        ->orWhere('article_translations.excerpt', $operator, "%{$q}%")
                        ->orWhere('article_translations.content', $operator, "%{$q}%");
                })
                ->with(['category.translations', 'media'])
                ->select('articles.*', 'article_translations.title', 'article_translations.excerpt', 'article_translations.content')
                ->orderByDesc('published_at')
                ->paginate(8)
                ->withQueryString();

            $totalHasil += $artikelQuery->total();

            $hasil['artikel'] = tap($artikelQuery, function ($paginated) use ($q) {
                return $paginated->getCollection()->transform(function ($a) use ($q) {
                    return [
                        'id' => $a->id,
                        'slug' => $a->slug,
                        'title' => $this->highlight($a->title ?? 'Untitled', $q),
                        'excerpt' => $this->highlight($a->excerpt ?? '', $q),
                        'published_at' => $a->published_at ? $a->published_at->format('d M Y') : '',
                        'category' => [
                            'name' => $a->category ? ($a->category->translation()?->name ?? 'Uncategorized') : 'Uncategorized',
                        ],
                        'thumbnail' => $a->getFirstMediaUrl('thumbnail') ?: asset('images/placeholder-artikel.svg'),
                    ];
                });
            });
        }

        SEOMeta::setTitle("Pencarian: {$q} | SMK Muhammadiyah Bligo");

        return Inertia::render('Public/Pencarian', [
            'keyword' => $q,
            'type' => $type,
            'hasil' => $hasil,
            'totalHasil' => $totalHasil,
        ]);
    }

    public function cepat(Request $request)
    {
        $q = strip_tags(trim($request->input('q')));
        if (empty($q) || strlen($q) < 2) {
            return response()->json([
                'artikel' => [],
                'jurusan' => [],
                'pengumuman' => [],
                'agenda' => [],
            ]);
        }

        $locale = app()->getLocale();
        $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';

        // Limit Jurusan 3
        $jurusan = Jurusan::query()
            ->where('is_active', true)
            ->join('jurusan_translations', function ($join) use ($locale) {
                $join->on('jurusans.id', '=', 'jurusan_translations.jurusan_id')
                    ->where('jurusan_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('jurusan_translations.nama', $operator, "%{$q}%")
                    ->orWhere('jurusan_translations.deskripsi_singkat', $operator, "%{$q}%");
            })
            ->select('jurusans.id', 'jurusans.slug', 'jurusan_translations.nama')
            ->limit(3)
            ->get()
            ->map(function ($j) use ($q) {
                return [
                    'id' => $j->id,
                    'slug' => $j->slug,
                    'title' => $this->highlight($j->nama ?? '', $q),
                    'type' => 'Jurusan',
                    'url' => route('jurusan.show', $j->slug),
                ];
            });

        // Limit Pengumuman 3
        $pengumuman = Pengumuman::query()
            ->aktif()
            ->join('pengumuman_translations', function ($join) use ($locale) {
                $join->on('pengumuman.id', '=', 'pengumuman_translations.pengumuman_id')
                    ->where('pengumuman_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('pengumuman_translations.judul', $operator, "%{$q}%")
                    ->orWhere('pengumuman_translations.konten', $operator, "%{$q}%");
            })
            ->select('pengumuman.id', 'pengumuman.slug', 'pengumuman_translations.judul')
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(function ($p) use ($q) {
                return [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'title' => $this->highlight($p->judul ?? 'Pengumuman', $q),
                    'type' => 'Pengumuman',
                    'url' => route('pengumuman.show', $p->slug),
                ];
            });

        // Limit Agenda 3
        $agenda = Agenda::query()
            ->active()
            ->join('agenda_translations', function ($join) use ($locale) {
                $join->on('agendas.id', '=', 'agenda_translations.agenda_id')
                    ->where('agenda_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('agenda_translations.judul', $operator, "%{$q}%")
                    ->orWhere('agenda_translations.deskripsi', $operator, "%{$q}%");
            })
            ->select('agendas.id', 'agendas.slug', 'agenda_translations.judul')
            ->orderByDesc('tanggal_mulai')
            ->limit(3)
            ->get()
            ->map(function ($ag) use ($q) {
                return [
                    'id' => $ag->id,
                    'slug' => $ag->slug,
                    'title' => $this->highlight($ag->judul ?? 'Agenda', $q),
                    'type' => 'Agenda',
                    'url' => route('agenda.show', $ag->slug),
                ];
            });

        // Limit Guru 3
        $guru = Guru::query()
            ->active()
            ->join('guru_translations', function ($join) use ($locale) {
                $join->on('guru.id', '=', 'guru_translations.guru_id')
                    ->where('guru_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('guru.nama', $operator, "%{$q}%")
                    ->orWhere('guru_translations.jabatan', $operator, "%{$q}%")
                    ->orWhere('guru_translations.mapel', $operator, "%{$q}%");
            })
            ->select('guru.*', 'guru_translations.jabatan')
            ->orderBy('urutan')
            ->limit(3)
            ->get()
            ->map(function ($g) use ($q) {
                return [
                    'id' => $g->id,
                    'title' => $this->highlight($g->nama_lengkap, $q),
                    'type' => $g->kelompok === 'guru' ? 'Guru' : 'Tendik',
                    'url' => route('guru.index'),
                ];
            });

        // Limit Fasilitas 3
        $fasilitas = Fasilitas::query()
            ->active()
            ->join('fasilitas_translations', function ($join) use ($locale) {
                $join->on('fasilitas.id', '=', 'fasilitas_translations.fasilitas_id')
                    ->where('fasilitas_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('fasilitas_translations.nama', $operator, "%{$q}%")
                    ->orWhere('fasilitas_translations.deskripsi', $operator, "%{$q}%");
            })
            ->select('fasilitas.id', 'fasilitas.slug', 'fasilitas_translations.nama')
            ->orderBy('urutan')
            ->limit(3)
            ->get()
            ->map(function ($f) use ($q) {
                return [
                    'id' => $f->id,
                    'slug' => $f->slug,
                    'title' => $this->highlight($f->nama ?? 'Fasilitas', $q),
                    'type' => 'Fasilitas',
                    'url' => route('fasilitas.show', $f->slug),
                ];
            });

        // Limit Artikel 5
        $artikel = Article::query()
            ->terbit()
            ->join('article_translations', function ($join) use ($locale) {
                $join->on('articles.id', '=', 'article_translations.article_id')
                    ->where('article_translations.locale', '=', $locale);
            })
            ->where(function ($query) use ($q, $operator) {
                $query->where('article_translations.title', $operator, "%{$q}%")
                    ->orWhere('article_translations.excerpt', $operator, "%{$q}%");
            })
            ->select('articles.id', 'articles.slug', 'article_translations.title')
            ->orderByDesc('published_at')
            ->limit(5)
            ->get()
            ->map(function ($a) use ($q) {
                return [
                    'id' => $a->id,
                    'slug' => $a->slug,
                    'title' => $this->highlight($a->title ?? 'Untitled', $q),
                    'type' => 'Artikel',
                    'url' => route('berita.show', $a->slug),
                ];
            });

        return response()->json([
            'jurusan' => $jurusan,
            'fasilitas' => $fasilitas,
            'artikel' => $artikel,
            'pengumuman' => $pengumuman,
            'agenda' => $agenda,
            'guru' => $guru,
        ]);
    }
}
