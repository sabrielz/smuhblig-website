<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Unduhan;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class UnduhanController extends Controller
{
    /**
     * Display a listing of public downloadable documents.
     */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();
        $cacheKey = "public.unduhan.{$locale}";

        $unduhanList = Cache::remember($cacheKey, 600, function () use ($locale) {
            return Unduhan::query()
                ->active()
                ->ordered()
                ->with(['translations', 'media'])
                ->get()
                ->map(function (Unduhan $item) use ($locale) {
                    $trans = $item->translation($locale);
                    $media = $item->getFirstMedia('berkas');

                    return [
                        'id' => $item->id,
                        'slug' => $item->slug,
                        'kategori' => $item->kategori,
                        'tanggal_terbit' => $item->tanggal_terbit?->format('d M Y'),
                        'jumlah_unduh' => $item->jumlah_unduh,
                        'judul' => $trans ? $trans->judul : '',
                        'deskripsi' => $trans ? $trans->deskripsi : null,
                        'file' => $media ? [
                            'file_name' => $media->file_name,
                            'extension' => strtoupper($media->extension),
                            'size' => $media->size,
                            'human_size' => $media->human_readable_size,
                        ] : null,
                        'download_url' => route('unduhan.download', ['unduhan' => $item->slug]),
                    ];
                });
        });

        // SEO Meta
        $pageTitle = $locale === 'en' ? 'Document Downloads' : 'Unduhan Dokumen Resmi';
        $pageDesc = $locale === 'en'
            ? 'Official school document downloads for SMK Muhammadiyah Bligo: brochures, academic calendars, forms, and decision letters.'
            : 'Pusat unduhan berkas dan dokumen resmi SMK Muhammadiyah Bligo: brosur, kalender akademik, formulir pendaftaran, dan SK resmi.';

        SEOMeta::setTitle($pageTitle);
        SEOMeta::setDescription($pageDesc);
        SEOMeta::setCanonical(route('unduhan.index'));

        OpenGraph::setTitle($pageTitle);
        OpenGraph::setDescription($pageDesc);
        OpenGraph::setUrl(route('unduhan.index'));
        OpenGraph::setType('website');

        TwitterCard::setTitle($pageTitle);
        TwitterCard::setDescription($pageDesc);

        return Inertia::render('Public/Unduhan', [
            'unduhanList' => $unduhanList,
        ]);
    }

    /**
     * Download the official document file.
     * Enforces is_active check and increments download counter.
     */
    public function download(Request $request, Unduhan $unduhan): BinaryFileResponse
    {
        // Pastikan dokumen aktif
        abort_unless($unduhan->is_active, 404);

        $media = $unduhan->getFirstMedia('berkas');
        abort_if(! $media, 404);

        $filePath = $media->getPath();
        abort_unless(file_exists($filePath), 404);

        // Tambah counter unduhan
        $unduhan->increment('jumlah_unduh');

        return response()->download($filePath, $media->file_name);
    }
}
