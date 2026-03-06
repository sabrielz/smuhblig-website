<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class TentangController extends Controller
{
    public function index(): Response
    {
        $data = Cache::remember('public.tentang', 60 * 60, function () {
            return [
                'pengaturan' => Pengaturan::getAllSettings(),
            ];
        });

        \Artesaos\SEOTools\Facades\SEOMeta::setTitle('Tentang Kami | SMK Muhammadiyah Bligo');
        \Artesaos\SEOTools\Facades\SEOMeta::setDescription('Mengenal lebih dekat visi, misi, dan profil SMK Muhammadiyah Bligo, lembaga pendidikan menengah kejuruan unggul dan berakhlak.');
        \Artesaos\SEOTools\Facades\OpenGraph::setUrl(request()->url());
        \Artesaos\SEOTools\Facades\OpenGraph::addProperty('type', 'website');

        return Inertia::render('Public/Tentang', [
            'pengaturan' => $data['pengaturan'],
        ]);
    }
}
