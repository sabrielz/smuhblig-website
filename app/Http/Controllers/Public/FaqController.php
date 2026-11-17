<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Artesaos\SEOTools\Facades\TwitterCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    /**
     * Display a listing of public FAQ items grouped by category with JSON-LD FAQPage.
     */
    public function index(Request $request): Response
    {
        $locale = app()->getLocale();
        $cacheKey = "public.faq.{$locale}";

        $faqData = Cache::remember($cacheKey, 600, function () use ($locale) {
            $faqs = Faq::query()
                ->active()
                ->ordered()
                ->with('translations')
                ->get()
                ->map(function (Faq $item) use ($locale) {
                    $trans = $item->translation($locale);

                    return [
                        'id' => $item->id,
                        'kategori' => $item->kategori,
                        'urutan' => $item->urutan,
                        'pertanyaan' => $trans ? $trans->pertanyaan : '',
                        'jawaban' => $trans ? $trans->jawaban : '',
                    ];
                });

            // Format FAQPage JSON-LD
            $mainEntity = $faqs->map(function ($item) {
                return [
                    '@type' => 'Question',
                    'name' => $item['pertanyaan'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => trim(strip_tags($item['jawaban'])),
                    ],
                ];
            })->values()->all();

            $jsonLd = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => $mainEntity,
            ];

            return [
                'faqs' => $faqs,
                'jsonLd' => $jsonLd,
            ];
        });

        // SEO Meta
        $pageTitle = $locale === 'en' ? 'Frequently Asked Questions (FAQ)' : 'Tanya Jawab (FAQ)';
        $pageDesc = $locale === 'en'
            ? 'Frequently asked questions regarding admission, academics, programs, and facilities at SMK Muhammadiyah Bligo.'
            : 'Pertanyaan umum dan informasi lengkap seputar pendaftaran siswa baru, kegiatan akademik, jurusan, dan fasilitas di SMK Muhammadiyah Bligo.';

        SEOMeta::setTitle($pageTitle);
        SEOMeta::setDescription($pageDesc);
        SEOMeta::setCanonical(route('faq'));

        OpenGraph::setTitle($pageTitle);
        OpenGraph::setDescription($pageDesc);
        OpenGraph::setUrl(route('faq'));
        OpenGraph::setType('website');

        TwitterCard::setTitle($pageTitle);
        TwitterCard::setDescription($pageDesc);

        return Inertia::render('Public/Faq', [
            'faqs' => $faqData['faqs'],
            'faqJsonLd' => $faqData['jsonLd'],
        ]);
    }
}
