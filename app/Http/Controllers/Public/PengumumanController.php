<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PengumumanResource;
use App\Models\Pengaturan;
use App\Models\Pengumuman;
use App\Services\AnalitikService;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PengumumanController extends Controller
{
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();
        $tipe = $request->query('tipe');
        $page = $request->query('page', 1);

        $cacheKey = "pengumuman_publik_{$locale}_{$tipe}_{$page}";

        $pengumuman = Cache::remember($cacheKey, 600, function () use ($tipe) {
            return Pengumuman::query()
                ->aktif()
                ->with('translations')
                ->when($tipe, function ($query, $tipe) {
                    $query->where('tipe', $tipe);
                })
                ->orderByDesc('tanggal_mulai')
                ->orderByDesc('created_at')
                ->paginate(9)
                ->withQueryString();
        });

        SEOMeta::setTitle('Pengumuman | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Pengumuman dan informasi resmi SMK Muhammadiyah Bligo.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Pengumuman/Index', [
            'pengumuman' => PengumumanResource::collection($pengumuman)->response()->getData(true),
            'filters' => [
                'tipe' => $tipe,
            ],
        ]);
    }

    public function show(Pengumuman $pengumuman): Response
    {
        if (! $pengumuman->is_active) {
            abort(404);
        }

        // Cek apakah aktif secara rentang tanggal (BR-003)
        $today = now()->startOfDay();
        if ($pengumuman->tanggal_mulai && $pengumuman->tanggal_mulai->startOfDay()->isFuture()) {
            abort(404);
        }
        if ($pengumuman->tanggal_selesai && $pengumuman->tanggal_selesai->startOfDay()->isPast()) {
            abort(404);
        }

        $pengumuman->load('translations');
        AnalitikService::catat(request(), 'pengumuman', $pengumuman->id);
        $resource = (new PengumumanResource($pengumuman))->resolve();

        $siteLogo = Pengaturan::get('site_logo') ?: url('/images/og-default.jpg');
        SEOMeta::setTitle(($resource['judul'] ?? 'Pengumuman').' | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription(strip_tags(mb_substr($resource['konten'] ?? '', 0, 160)));
        SEOMeta::setCanonical(route('pengumuman.show', ['pengumuman' => $pengumuman->slug]));
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'article');
        OpenGraph::addImage($siteLogo);
        TwitterCard::setImage($siteLogo);

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $resource['judul'] ?? 'Pengumuman',
            'description' => strip_tags(mb_substr($resource['konten'] ?? '', 0, 160)),
            'datePublished' => $pengumuman->created_at ? $pengumuman->created_at->toIso8601String() : null,
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => route('pengumuman.show', ['pengumuman' => $pengumuman->slug]),
            ],
        ];

        return Inertia::render('Public/Pengumuman/Show', [
            'pengumuman' => $resource,
            'jsonLd' => [$jsonLd],
        ]);
    }
}
