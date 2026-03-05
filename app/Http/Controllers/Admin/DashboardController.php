<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Galeri;
use App\Models\User;
use App\Models\AiJob;
use App\Models\Jurusan;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index(): Response
    {
        $totalArtikel = [
            'draft' => Article::where('status', 'draft')->count(),
            'pending' => Article::where('status', 'pending')->count(),
            'published' => Article::where('status', 'published')->count(),
            'archived' => Article::where('status', 'archived')->count(),
            'total' => Article::count(),
        ];

        $totalGaleri = Galeri::count();
        $totalPengguna = User::count();
        $totalJurusanAktif = Jurusan::active()->count();

        $artikelTerbaru = Article::with(['user:id,name', 'translations:id,article_id,title,locale'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->translation() ? $article->translation()->title : 'Untitled',
                    'status' => $article->status,
                    'author' => $article->user ? $article->user->name : 'Unknown',
                    'created_at' => $article->created_at->format('Y-m-d H:i')
                ];
            });

        $aiJobsTerbaru = AiJob::latest()
            ->take(5)
            ->get(['id', 'job_type', 'status', 'created_at'])
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'job_type' => $job->job_type,
                    'status' => $job->status,
                    'created_at' => $job->created_at->diffForHumans()
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'totalArtikel' => $totalArtikel,
            'totalGaleri' => $totalGaleri,
            'totalPengguna' => $totalPengguna,
            'totalJurusanAktif' => $totalJurusanAktif,
            'artikelTerbaru' => $artikelTerbaru,
            'aiJobsTerbaru' => $aiJobsTerbaru,
        ]);
    }
}
