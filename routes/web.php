<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Public\BerandaController;
use App\Http\Controllers\Public\JurusanController;
use App\Http\Controllers\Public\TentangController;
use App\Http\Controllers\Public\KontakController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', BerandaController::class)->name('beranda');

// Jurusan (Program Keahlian)
Route::get('/jurusan', [JurusanController::class, 'index'])->name('jurusan.index');
Route::get('/jurusan/{jurusan:slug}', [JurusanController::class, 'show'])->name('jurusan.show');

// Halaman statis publik
Route::get('/tentang', [TentangController::class, 'index'])->name('tentang');
Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');

// Berita & Informasi
use App\Http\Controllers\Public\BeritaController;
Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{article:slug}', [BeritaController::class, 'show'])->name('berita.show');
Route::get('/galeri', [\App\Http\Controllers\Public\GaleriController::class, 'index'])->name('galeri');
Route::get('/tautan', [\App\Http\Controllers\Public\TautanController::class, 'index'])->name('tautan');
Route::get('/portal', function () {
    return Inertia::render('Portal');
})->name('portal');

use App\Http\Controllers\Public\AgendaPublikController;
Route::get('/agenda', [AgendaPublikController::class, 'index'])->name('agenda.index');
Route::get('/agenda/{agenda:slug}', [AgendaPublikController::class, 'show'])->name('agenda.show');

Route::get('/sitemap.xml', function () {
    \Illuminate\Support\Facades\Artisan::call('sitemap:generate');
    return response()->file(public_path('sitemap.xml'));
});

/*
|--------------------------------------------------------------------------
| Locale Switcher
|--------------------------------------------------------------------------
*/

Route::post('/locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->input('locale', 'id');

    if (in_array($locale, config('app.available_locales', ['id', 'en']))) {
        session()->put('locale', $locale);
        app()->setLocale($locale);
    }

    return back();
})->name('locale.switch');

/*
|--------------------------------------------------------------------------
| Auth Routes (Guest only)
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
Route::get('/logout', [LoginController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| Admin Routes — protected by auth + CMS role
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', \App\Http\Middleware\EnsureHasCmsRole::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Redirect /admin → /admin/dashboard
        Route::get('/', fn () => redirect()->route('admin.dashboard'));

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Artikel
        Route::post('/artikel/{artikel}/publish', [\App\Http\Controllers\Admin\ArtikelController::class, 'publish'])->name('artikel.publish');
        Route::patch('/artikel/{artikel}/translation/reviewed', [\App\Http\Controllers\Admin\ArtikelController::class, 'markTranslationReviewed'])->name('artikel.translation.reviewed');
        Route::resource('artikel', \App\Http\Controllers\Admin\ArtikelController::class)->except(['show']);

        // Galeri
        Route::get('/galeri', [\App\Http\Controllers\Admin\GaleriController::class, 'index'])->name('galeri.index');
        Route::get('/galeri/buat', [\App\Http\Controllers\Admin\GaleriController::class, 'create'])->name('galeri.create');
        Route::post('/galeri', [\App\Http\Controllers\Admin\GaleriController::class, 'store'])->name('galeri.store');
        Route::get('/galeri/{galeri}', [\App\Http\Controllers\Admin\GaleriController::class, 'show'])->name('galeri.show');
        Route::get('/galeri/{galeri}/edit', [\App\Http\Controllers\Admin\GaleriController::class, 'edit'])->name('galeri.edit');
        Route::put('/galeri/{galeri}', [\App\Http\Controllers\Admin\GaleriController::class, 'update'])->name('galeri.update');
        Route::delete('/galeri/{galeri}', [\App\Http\Controllers\Admin\GaleriController::class, 'destroy'])->name('galeri.destroy');
        Route::post('/galeri/{galeri}/foto', [\App\Http\Controllers\Admin\GaleriController::class, 'uploadFoto'])->name('galeri.uploadFoto');
        Route::delete('/galeri/foto/{mediaId}', [\App\Http\Controllers\Admin\GaleriController::class, 'deleteFoto'])->name('galeri.deleteFoto');

        // Pengumuman
        Route::get('/pengumuman', [\App\Http\Controllers\Admin\PengumumanController::class, 'index'])->name('pengumuman.index');
        Route::get('/pengumuman/buat', [\App\Http\Controllers\Admin\PengumumanController::class, 'create'])->name('pengumuman.create');
        Route::post('/pengumuman', [\App\Http\Controllers\Admin\PengumumanController::class, 'store'])->name('pengumuman.store');
        Route::get('/pengumuman/{pengumuman}/edit', [\App\Http\Controllers\Admin\PengumumanController::class, 'edit'])->name('pengumuman.edit');
        Route::put('/pengumuman/{pengumuman}', [\App\Http\Controllers\Admin\PengumumanController::class, 'update'])->name('pengumuman.update');
        Route::delete('/pengumuman/{pengumuman}', [\App\Http\Controllers\Admin\PengumumanController::class, 'destroy'])->name('pengumuman.destroy');

        // Agenda
        Route::resource('agenda', \App\Http\Controllers\Admin\AgendaController::class)->except(['show']);

        // Jurusan (Edit 5 existing only)
        Route::get('/jurusan', [\App\Http\Controllers\Admin\JurusanController::class, 'index'])->name('jurusan.index');
        Route::get('/jurusan/{jurusan}/edit', [\App\Http\Controllers\Admin\JurusanController::class, 'edit'])->name('jurusan.edit');
        Route::put('/jurusan/{jurusan}', [\App\Http\Controllers\Admin\JurusanController::class, 'update'])->name('jurusan.update');

        // Tautan CRUD
        Route::resource('tautan', \App\Http\Controllers\Admin\TautanController::class);

        // Pengaturan
        Route::get('/pengaturan', [\App\Http\Controllers\Admin\PengaturanController::class, 'index'])->name('pengaturan.index');
        Route::post('/pengaturan', [\App\Http\Controllers\Admin\PengaturanController::class, 'store'])->name('pengaturan.store');

        // Statistik
        Route::get('/statistik', [\App\Http\Controllers\Admin\StatistikController::class, 'index'])->name('statistik.index');
        Route::put('/statistik/{statistik}', [\App\Http\Controllers\Admin\StatistikController::class, 'update'])->name('statistik.update');
        Route::post('/statistik/reorder', [\App\Http\Controllers\Admin\StatistikController::class, 'reorder'])->name('statistik.reorder');

        // Struktur Organisasi
        Route::post('/struktur-organisasi/reorder', [\App\Http\Controllers\Admin\StrukturOrganisasiController::class, 'reorder'])->name('struktur-organisasi.reorder');
        Route::resource('struktur-organisasi', \App\Http\Controllers\Admin\StrukturOrganisasiController::class)->except(['show']);

        // Pengguna CRUD - Hanya Admin
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('pengguna', \App\Http\Controllers\Admin\PenggunaController::class);
        });

        // AI Features (async via queue)
        Route::middleware(['throttle:ai'])->prefix('ai')->name('ai.')->group(function () {
            Route::post('/generate',  [\App\Http\Controllers\Admin\AiController::class, 'generate'])->name('generate');
            Route::post('/revise',    [\App\Http\Controllers\Admin\AiController::class, 'revise'])->name('revise');
            Route::post('/correct',   [\App\Http\Controllers\Admin\AiController::class, 'correct'])->name('correct');
            Route::post('/translate', [\App\Http\Controllers\Admin\AiController::class, 'translate'])->name('translate');
            Route::post('/seo',       [\App\Http\Controllers\Admin\AiController::class, 'analyzeSeo'])->name('seo');
            Route::get('/jobs/{aiJob}/status', [\App\Http\Controllers\Admin\AiController::class, 'jobStatus'])->name('job.status');
        });

        // Konten Halaman Publik (CMS teks dinamis)
        Route::get('/konten/{halaman}/data', [\App\Http\Controllers\Admin\KontenHalamanController::class, 'show'])->name('konten.show');
        Route::get('/konten/{halaman}', [\App\Http\Controllers\Admin\KontenHalamanController::class, 'edit'])->name('konten.edit');
        Route::post('/konten/{halaman}', [\App\Http\Controllers\Admin\KontenHalamanController::class, 'update'])->name('konten.update');
        Route::post('/konten/{halaman}/translate', [\App\Http\Controllers\Admin\KontenHalamanController::class, 'translateAll'])->name('konten.translate');

        // Media Upload (TipTap inline images)
        Route::post('/media/upload', [\App\Http\Controllers\Admin\MediaUploadController::class, 'upload'])->name('media.upload');
    });
