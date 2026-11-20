<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\Article;
use App\Models\Galeri;
use App\Models\Jurusan;
use App\Models\KunjunganHarian;
use App\Models\Pengumuman;
use App\Models\PesanKontak;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard tailored to user role.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $role = 'author';
        if ($user->isAdmin()) {
            $role = 'admin';
        } elseif ($user->isEditor()) {
            $role = 'editor';
        }

        // 1. Author Dashboard Data
        $authorStats = null;
        $authorArticles = null;

        if ($role === 'author' || $role === 'admin') {
            $authorStats = [
                'draft' => Article::where('user_id', $user->id)->where('status', ArticleStatus::Draft->value)->count(),
                'pending' => Article::where('user_id', $user->id)->where('status', ArticleStatus::PendingReview->value)->count(),
                'published' => Article::where('user_id', $user->id)->where('status', ArticleStatus::Published->value)->count(),
                'archived' => Article::where('user_id', $user->id)->where('status', ArticleStatus::Archived->value)->count(),
            ];

            $authorArticles = Article::with(['translations'])
                ->where('user_id', $user->id)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($article) => [
                    'id' => $article->id,
                    'title' => ($trans = $article->translation()) ? $trans->title : 'Untitled',
                    'status' => $article->status,
                    'created_at' => $article->created_at->format('Y-m-d H:i'),
                ]);
        }

        // 2. Editor Dashboard Data
        $editorStats = null;
        $pendingArticles = null;
        $activePengumuman = null;
        $pesanBaruCount = null;

        if ($role === 'editor' || $role === 'admin') {
            $pendingArticles = Article::with(['user:id,name', 'translations'])
                ->where('status', ArticleStatus::PendingReview->value)
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($article) => [
                    'id' => $article->id,
                    'title' => ($trans = $article->translation()) ? $trans->title : 'Untitled',
                    'author' => $article->user ? $article->user->name : 'Anonim',
                    'created_at' => $article->created_at->format('Y-m-d H:i'),
                ]);

            $activePengumuman = Pengumuman::aktif()->count();
            $pesanBaruCount = PesanKontak::baru()->count();

            $editorStats = [
                'pending_review' => Article::where('status', ArticleStatus::PendingReview->value)->count(),
                'pengumuman_aktif' => $activePengumuman,
                'pesan_baru' => $pesanBaruCount,
            ];
        }

        // 3. Admin Dashboard Data
        $adminStats = null;
        $kunjungan30Hari = null;
        $kontenTerpopuler = null;
        $aiJobsTerbaru = null;

        if ($role === 'admin') {
            $adminStats = [
                'total_artikel' => Article::count(),
                'total_galeri' => Galeri::count(),
                'total_pengguna' => User::count(),
                'total_jurusan' => Jurusan::active()->count(),
            ];

            // Kunjungan 30 hari terakhir
            $startDate = Carbon::today()->subDays(29);
            $kunjunganRecords = KunjunganHarian::where('tanggal', '>=', $startDate->toDateString())
                ->groupBy('tanggal')
                ->select('tanggal', DB::raw('SUM(jumlah) as total'))
                ->orderBy('tanggal', 'asc')
                ->pluck('total', 'tanggal')
                ->all();

            $kunjungan30Hari = [];
            for ($i = 0; $i < 30; $i++) {
                $d = $startDate->copy()->addDays($i)->toDateString();
                $label = Carbon::parse($d)->format('d M');
                $kunjungan30Hari[] = [
                    'label' => $label,
                    'value' => (int) ($kunjunganRecords[$d] ?? 0),
                ];
            }

            // 5 Konten Terpopuler
            $kontenTerpopuler = Article::terbit()
                ->with(['translations'])
                ->orderByDesc('view_count')
                ->take(5)
                ->get()
                ->map(fn ($article) => [
                    'id' => $article->id,
                    'title' => ($trans = $article->translation()) ? $trans->title : 'Untitled',
                    'view_count' => $article->view_count,
                    'slug' => $article->slug,
                ]);

            // AI Jobs Terbaru
            $aiJobsTerbaru = AiJob::latest()
                ->take(5)
                ->get(['id', 'job_type', 'status', 'created_at'])
                ->map(fn ($job) => [
                    'id' => $job->id,
                    'job_type' => $job->job_type,
                    'status' => $job->status,
                    'created_at' => $job->created_at->diffForHumans(),
                ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'role' => $role,
            'authorStats' => $authorStats,
            'authorArticles' => $authorArticles,
            'editorStats' => $editorStats,
            'pendingArticles' => $pendingArticles,
            'adminStats' => $adminStats,
            'kunjungan30Hari' => $kunjungan30Hari,
            'kontenTerpopuler' => $kontenTerpopuler,
            'aiJobsTerbaru' => $aiJobsTerbaru,
        ]);
    }
}
