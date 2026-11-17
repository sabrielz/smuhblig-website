<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\HalamanKonten;
use App\Models\Pengaturan;
use App\Models\Tautan;
use Artesaos\SEOTools\Facades\OpenGraph;
use Artesaos\SEOTools\Facades\SEOMeta;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class KontakController extends Controller
{
    public function index(): Response
    {
        $tautan = Cache::remember('public.kontak.tautan', 60 * 60, function () {
            return Tautan::active()->ordered()->get()->map(fn ($t) => [
                'id' => $t->id,
                'label' => $t->label,
                'url' => $t->url,
                'deskripsi' => $t->deskripsi,
                'icon_name' => $t->icon_name,
                'kategori' => $t->kategori,
                'buka_tab_baru' => $t->buka_tab_baru,
            ]);
        });

        $pengaturan = Cache::remember('public.kontak.pengaturan', 60 * 60, function () {
            return Pengaturan::getAllSettings();
        });

        $kontenInfo = HalamanKonten::getSection('kontak', 'info', app()->getLocale());

        $locale = app()->getLocale();
        $faqUmum = Cache::remember("public.kontak.faq_umum.{$locale}", 600, function () use ($locale) {
            return Faq::query()
                ->active()
                ->where('kategori', 'umum')
                ->ordered()
                ->limit(5)
                ->with('translations')
                ->get()
                ->map(function (Faq $item) use ($locale) {
                    $trans = $item->translation($locale);

                    return [
                        'id' => $item->id,
                        'pertanyaan' => $trans ? $trans->pertanyaan : '',
                        'jawaban' => $trans ? $trans->jawaban : '',
                    ];
                });
        });

        SEOMeta::setTitle('Kontak | SMK Muhammadiyah Bligo');
        SEOMeta::setDescription('Hubungi SMK Muhammadiyah Bligo. Kami siap membantu pertanyaan Anda terkait PPDB, informasi sekolah, atau kerjasama.');
        OpenGraph::setUrl(request()->url());
        OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Kontak', [
            'pengaturan' => $pengaturan,
            'tautan' => $tautan,
            'kontenInfo' => $kontenInfo,
            'faqUmum' => $faqUmum,
        ]);
    }
}
