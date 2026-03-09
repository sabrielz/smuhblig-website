<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Jurusan;
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
        return preg_replace("/(?!<[^>]*?>)($keyword)(?![^<]*?>)/i", "<mark class=\"bg-[#c9a84c]/30 text-inherit rounded-sm px-0.5\">$1</mark>", $text);
    }

    public function index(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
            'type' => 'nullable|in:artikel,jurusan,semua',
        ]);

        $q = strip_tags(trim($request->input('q')));
        $type = $request->input('type', 'semua');
        $locale = app()->getLocale();

        $hasil = [
            'artikel' => null,
            'jurusan' => [],
        ];
        $totalHasil = 0;

        // Search Jurusan
        if ($type !== 'artikel') {
            $jurusanQuery = Jurusan::query()
                ->where('is_active', true)
                ->join('jurusan_translations', function ($join) use ($locale) {
                    $join->on('jurusans.id', '=', 'jurusan_translations.jurusan_id')
                         ->where('jurusan_translations.locale', '=', $locale);
                })
                ->where(function ($query) use ($q) {
                    // PostgreSQL ILIKE is used via 'ilike' operator in Laravel. If DB is MySQL, 'like' acts as ilike structurally but Laravel supports 'ilike' syntax
                    $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';
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

        // Search Artikel
        if ($type !== 'jurusan') {
            $operator = config('database.default') === 'pgsql' ? 'ilike' : 'like';

            $artikelQuery = Article::query()
                ->where('status', 'published')
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

            $hasil['artikel'] = tap($artikelQuery, function($paginated) use ($q) {
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
                        'thumbnail' => $a->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/600x400',
                    ];
                });
            });
        }

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle("Pencarian: {$q} | SMK Muhammadiyah Bligo");

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
            return response()->json(['artikel' => [], 'jurusan' => []]);
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

        // Limit Artikel 5
        $artikel = Article::query()
            ->where('status', 'published')
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
            'artikel' => $artikel,
        ]);
    }
}
