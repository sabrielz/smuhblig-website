<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\PengumumanResource;
use App\Models\Pengumuman;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
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
        $resource = (new PengumumanResource($pengumuman))->resolve();

        SEOMeta::setTitle(($resource['judul'] ?? 'Pengumuman').' | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription(strip_tags(mb_substr($resource['konten'] ?? '', 0, 160)));
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'article');

        return Inertia::render('Public/Pengumuman/Show', [
            'pengumuman' => $resource,
        ]);
    }
}
