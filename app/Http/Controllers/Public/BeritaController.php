<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Jobs\IncrementArticleViewCount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = Article::query()
            ->published()
            ->byLocale()
            ->with(['translations', 'category.translations', 'user', 'media'])
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->where('category_id', $request->category);
            })
            ->when($request->filled('q'), function ($query) use ($request) {
                // simple search by translation title
                $query->whereHas('translations', function ($q) use ($request) {
                    $q->where('title', 'like', '%' . $request->q . '%');
                });
            })
            ->orderByDesc('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through(function ($article) {
                return [
                    'id' => $article->id,
                    'slug' => $article->slug,
                    'title' => $article->translation()?->title ?? 'Untitled',
                    'excerpt' => $article->translation()?->excerpt ?? '',
                    'published_at' => $article->published_at ? $article->published_at->format('d M Y') : '',
                    'category' => [
                        'name' => $article->category ? ($article->category->translation()?->name ?? 'Uncategorized') : 'Uncategorized',
                        'color' => '#003f87', // default color if not in DB
                    ],
                    'author' => [
                        'name' => $article->user ? $article->user->name : 'Admin',
                        'avatar' => $article->user && method_exists($article->user, 'avatar_url') ? $article->user->avatar_url : 'https://ui-avatars.com/api/?name=Admin',
                    ],
                    'thumbnail' => $article->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/600x400',
                    'view_count' => $article->view_count,
                ];
            });

        $categories = Category::with('translations')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->translation()?->name,
                'slug' => $category->slug,
            ];
        });

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle('Berita | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription('Kumpulan berita dan informasi terbaru dari SMK Muhammadiyah Bligo.');
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Berita/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only(['category', 'q'])
        ]);
    }

    public function show(Article $article): Response
    {
        // Ensure article is published
        if ($article->status !== 'published') {
            abort(404);
        }

        IncrementArticleViewCount::dispatch($article);

        $article->load(['translations', 'category.translations', 'user', 'media']);

        $relatedArticles = Article::query()
            ->published()
            ->byLocale()
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->with(['translations', 'category.translations', 'user', 'media'])
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(function ($relArticle) {
                return [
                    'id' => $relArticle->id,
                    'slug' => $relArticle->slug,
                    'title' => $relArticle->translation()?->title ?? 'Untitled',
                    'excerpt' => $relArticle->translation()?->excerpt ?? '',
                    'published_at' => $relArticle->published_at ? $relArticle->published_at->format('d M Y') : '',
                    'category' => [
                        'name' => $relArticle->category ? ($relArticle->category->translation()?->name ?? 'Uncategorized') : 'Uncategorized',
                        'color' => '#003f87',
                    ],
                    'author' => [
                        'name' => $relArticle->user ? $relArticle->user->name : 'Admin',
                        'avatar' => $relArticle->user && method_exists($relArticle->user, 'avatar_url') ? $relArticle->user->avatar_url : 'https://ui-avatars.com/api/?name=Admin',
                    ],
                    'thumbnail' => $relArticle->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/600x400',
                ];
            });

        $categories = Category::withCount(['articles' => function ($query) {
            $query->published();
        }])->with('translations')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->translation()?->name,
                'slug' => $category->slug,
                'articles_count' => $category->articles_count,
            ];
        });

        $formattedArticle = [
            'id' => $article->id,
            'slug' => $article->slug,
            'title' => $article->translation()?->title,
            'excerpt' => $article->translation()?->excerpt,
            'content' => $article->translation()?->content,
            'published_at' => $article->published_at ? $article->published_at->format('d M Y') : '',
            'category' => [
                'id' => $article->category_id,
                'name' => $article->category ? $article->category->translation()?->name : null,
                'slug' => $article->category ? $article->category->slug : null,
                'color' => '#003f87',
            ],
            'author' => [
                'name' => $article->user ? $article->user->name : 'Admin',
                'avatar' => $article->user && method_exists($article->user, 'avatar_url') ? $article->user->avatar_url : 'https://ui-avatars.com/api/?name=Admin',
            ],
            'thumbnail' => $article->getFirstMediaUrl('thumbnail') ?: 'https://placehold.co/1200x600',
        ];

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle(($formattedArticle['title'] ?? 'Berita') . ' | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription($formattedArticle['excerpt'] ?? '');
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'article');
        \Artesaos\SEOTools\Facades\OpenGraph::addImage($formattedArticle['thumbnail']);
        \Artesaos\SEOTools\Facades\TwitterCard::setImage($formattedArticle['thumbnail']);

        return Inertia::render('Public/Berita/Show', [
            'article' => $formattedArticle,
            'relatedArticles' => $relatedArticles,
            'categories' => $categories,
        ]);
    }
}
