<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\Public\BerandaController;
use App\Http\Controllers\Public\GaleriController;
use App\Http\Controllers\Public\JurusanController;
use App\Http\Controllers\Public\KontakController;
use App\Http\Controllers\Public\PesanKontakController as PublicPesanKontakController;
use App\Http\Controllers\Public\TautanController;
use App\Http\Controllers\Public\TentangController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/health', [HealthController::class, 'check'])
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->middleware('throttle:60,1')
    ->name('health');

Route::get('/', BerandaController::class)->name('beranda');

// Jurusan (Program Keahlian)
Route::get('/jurusan', [JurusanController::class, 'index'])->name('jurusan.index');
Route::get('/jurusan/{jurusan:slug}', [JurusanController::class, 'show'])->name('jurusan.show');

// Halaman statis publik
Route::get('/tentang', [TentangController::class, 'index'])->name('tentang');
Route::get('/guru', [App\Http\Controllers\Public\GuruController::class, 'index'])->name('guru.index');
Route::get('/fasilitas', [App\Http\Controllers\Public\FasilitasController::class, 'index'])->name('fasilitas.index');
Route::get('/fasilitas/{fasilitas:slug}', [App\Http\Controllers\Public\FasilitasController::class, 'show'])->name('fasilitas.show');
Route::get('/ekstrakurikuler', [App\Http\Controllers\Public\EkstrakurikulerController::class, 'index'])->name('ekstrakurikuler.index');
Route::get('/ekstrakurikuler/{ekstrakurikuler:slug}', [App\Http\Controllers\Public\EkstrakurikulerController::class, 'show'])->name('ekstrakurikuler.show');
Route::get('/prestasi', [App\Http\Controllers\Public\PrestasiController::class, 'index'])->name('prestasi.index');
Route::get('/prestasi/{prestasi:slug}', [App\Http\Controllers\Public\PrestasiController::class, 'show'])->name('prestasi.show');
Route::get('/kontak', [KontakController::class, 'index'])->name('kontak');
Route::post('/kontak/kirim', [PublicPesanKontakController::class, 'store'])->middleware('throttle:form-kontak')->name('kontak.kirim');

// Berita & Informasi
use App\Http\Controllers\Public\BeritaController;

Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
Route::get('/berita/{article:slug}', [BeritaController::class, 'show'])->name('berita.show');
Route::get('/galeri', [GaleriController::class, 'index'])->name('galeri');
Route::get('/galeri/{galeri:slug}', [GaleriController::class, 'show'])->name('galeri.show');
Route::get('/tautan', [TautanController::class, 'index'])->name('tautan');
Route::get('/portal', function () {
    return Inertia::render('Portal');
})->name('portal');

use App\Http\Controllers\Public\PencarianController;

Route::get('/pencarian', [PencarianController::class, 'index'])->middleware('throttle:pencarian-cepat')->name('pencarian.index');
Route::get('/api/pencarian/cepat', [PencarianController::class, 'cepat'])->middleware('throttle:pencarian-cepat')->name('pencarian.cepat');

use App\Http\Controllers\Admin\AgendaController;
use App\Http\Controllers\Admin\AiController;
use App\Http\Controllers\Admin\ArtikelController;
use App\Http\Controllers\Admin\KontenHalamanController;
use App\Http\Controllers\Admin\MediaUploadController;
use App\Http\Controllers\Admin\NotifikasiController;
use App\Http\Controllers\Admin\PengaturanController;
use App\Http\Controllers\Admin\PenggunaController;
use App\Http\Controllers\Admin\PengumumanController;
use App\Http\Controllers\Admin\PesanKontakController;
use App\Http\Controllers\Admin\StatistikController;
use App\Http\Controllers\Admin\StrukturOrganisasiController;
use App\Http\Controllers\Public\AgendaPublikController;
use App\Http\Middleware\EnsureAiEnabled;
use App\Http\Middleware\EnsureHasCmsRole;
use App\Models\Pengaturan;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;

Route::get('/agenda', [AgendaPublikController::class, 'index'])->name('agenda.index');
Route::get('/agenda/{agenda:slug}', [AgendaPublikController::class, 'show'])->name('agenda.show');
Route::get('/agenda/{agenda:slug}/ics', [AgendaPublikController::class, 'ics'])->name('agenda.ics');

use App\Http\Controllers\Admin\EkstrakurikulerController;
use App\Http\Controllers\Admin\FasilitasController;
use App\Http\Controllers\Admin\GuruController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\PrestasiController;
use App\Http\Controllers\Admin\ProfilController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UnduhanController;
use App\Http\Controllers\Public\PengumumanController as PublicPengumumanController;

Route::get('/pengumuman', [PublicPengumumanController::class, 'index'])->name('pengumuman.index');
Route::get('/pengumuman/{pengumuman:slug}', [PublicPengumumanController::class, 'show'])->name('pengumuman.show');

Route::get('/daftar', function () {
    $spmbUrl = Pengaturan::get('spmb_url');

    return $spmbUrl ? redirect()->away($spmbUrl) : redirect()->route('beranda');
})->name('daftar');

/*
|--------------------------------------------------------------------------
| Locale Switcher
|--------------------------------------------------------------------------
*/

Route::post('/locale', function (Request $request) {
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
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:login')->name('login.store');

    // Password Reset
    Route::get('/lupa-password', [LoginController::class, 'showForgotForm'])->name('password.request');
    Route::post('/lupa-password', [LoginController::class, 'sendResetLink'])->middleware('throttle:password-reset')->name('password.email');
    Route::get('/reset-password/{token}', [LoginController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [LoginController::class, 'resetPassword'])->middleware('throttle:password-reset')->name('password.update');
});

Route::post('/logout', [LoginController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

/*
|--------------------------------------------------------------------------
| Admin Routes — protected by auth + CMS role
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', EnsureHasCmsRole::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Redirect /admin → /admin/dashboard
        Route::get('/', fn () => redirect()->route('admin.dashboard'));

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Artikel
        Route::get('/artikel/{artikel}/preview', [ArtikelController::class, 'preview'])->name('artikel.preview');
        Route::post('/artikel/{artikel}/publish', [ArtikelController::class, 'publish'])->name('artikel.publish');
        Route::patch('/artikel/{artikel}/translation/reviewed', [ArtikelController::class, 'markTranslationReviewed'])->name('artikel.translation.reviewed');
        Route::resource('artikel', ArtikelController::class)->except(['show']);

        // Kategori Artikel
        Route::resource('kategori', KategoriController::class)->except(['show']);

        // Tag Artikel
        Route::get('/tag', [TagController::class, 'index'])->name('tag.index');
        Route::post('/tag/merge', [TagController::class, 'merge'])->name('tag.merge');
        Route::delete('/tag/{tag}', [TagController::class, 'destroy'])->name('tag.destroy');

        // Galeri
        Route::get('/galeri', [App\Http\Controllers\Admin\GaleriController::class, 'index'])->name('galeri.index');
        Route::get('/galeri/buat', [App\Http\Controllers\Admin\GaleriController::class, 'create'])->name('galeri.create');
        Route::post('/galeri', [App\Http\Controllers\Admin\GaleriController::class, 'store'])->name('galeri.store');
        Route::get('/galeri/{galeri}', [App\Http\Controllers\Admin\GaleriController::class, 'show'])->name('galeri.show');
        Route::get('/galeri/{galeri}/edit', [App\Http\Controllers\Admin\GaleriController::class, 'edit'])->name('galeri.edit');
        Route::put('/galeri/{galeri}', [App\Http\Controllers\Admin\GaleriController::class, 'update'])->name('galeri.update');
        Route::delete('/galeri/{galeri}', [App\Http\Controllers\Admin\GaleriController::class, 'destroy'])->name('galeri.destroy');
        Route::post('/galeri/{galeri}/foto', [App\Http\Controllers\Admin\GaleriController::class, 'uploadFoto'])->name('galeri.uploadFoto');
        Route::delete('/galeri/foto/{mediaId}', [App\Http\Controllers\Admin\GaleriController::class, 'deleteFoto'])->name('galeri.deleteFoto');

        // Pengumuman
        Route::get('/pengumuman/{pengumuman}/preview', [PengumumanController::class, 'preview'])->name('pengumuman.preview');
        Route::get('/pengumuman', [PengumumanController::class, 'index'])->name('pengumuman.index');
        Route::get('/pengumuman/buat', [PengumumanController::class, 'create'])->name('pengumuman.create');
        Route::post('/pengumuman', [PengumumanController::class, 'store'])->name('pengumuman.store');
        Route::get('/pengumuman/{pengumuman}/edit', [PengumumanController::class, 'edit'])->name('pengumuman.edit');
        Route::put('/pengumuman/{pengumuman}', [PengumumanController::class, 'update'])->name('pengumuman.update');
        Route::delete('/pengumuman/{pengumuman}', [PengumumanController::class, 'destroy'])->name('pengumuman.destroy');

        // Agenda
        Route::resource('agenda', AgendaController::class)->except(['show']);

        // Guru & Tenaga Kependidikan
        Route::post('/guru/reorder', [GuruController::class, 'reorder'])->name('guru.reorder');
        Route::resource('guru', GuruController::class)->except(['show']);

        // Fasilitas
        Route::post('/fasilitas/reorder', [FasilitasController::class, 'reorder'])->name('fasilitas.reorder');
        Route::resource('fasilitas', FasilitasController::class)->except(['show']);

        // Ekstrakurikuler
        Route::post('/ekstrakurikuler/reorder', [EkstrakurikulerController::class, 'reorder'])->name('ekstrakurikuler.reorder');
        Route::resource('ekstrakurikuler', EkstrakurikulerController::class)->except(['show']);

        // Prestasi
        Route::resource('prestasi', PrestasiController::class)->except(['show']);

        // Unduhan Dokumen
        Route::resource('unduhan', UnduhanController::class)->except(['show']);

        // Jurusan (Edit 5 existing only)
        Route::get('/jurusan', [App\Http\Controllers\Admin\JurusanController::class, 'index'])->name('jurusan.index');
        Route::get('/jurusan/{jurusan}/edit', [App\Http\Controllers\Admin\JurusanController::class, 'edit'])->name('jurusan.edit');
        Route::put('/jurusan/{jurusan}', [App\Http\Controllers\Admin\JurusanController::class, 'update'])->name('jurusan.update');

        // Tautan CRUD — admin only (pengaturan link penting)
        Route::middleware(['role:admin'])->group(function () {
            Route::resource('tautan', App\Http\Controllers\Admin\TautanController::class);
        });

        // Pengaturan — admin only (konfigurasi sensitif: SMTP, API keys, dll)
        Route::middleware(['role:admin'])->group(function () {
            Route::get('/pengaturan', [PengaturanController::class, 'index'])->name('pengaturan.index');
            Route::post('/pengaturan', [PengaturanController::class, 'store'])->name('pengaturan.store');
            Route::post('/pengaturan/test-email', [PengaturanController::class, 'testEmail'])->name('pengaturan.test-email');
        });

        // Notifikasi Admin — semua role CMS bisa akses notifikasi mereka sendiri
        Route::prefix('notifikasi')->name('notifikasi.')->group(function () {
            Route::get('/', [NotifikasiController::class, 'index'])->name('index');
            Route::post('/baca-semua', [NotifikasiController::class, 'bacaSemua'])->name('baca-semua');
            Route::post('/{notifikasi}/baca', [NotifikasiController::class, 'baca'])->name('baca');
            Route::delete('/{notifikasi}', [NotifikasiController::class, 'hapus'])->name('hapus');
            // AJAX endpoints
            Route::get('/recent', [NotifikasiController::class, 'recent'])->name('recent');
            Route::post('/ajax/baca-semua', [NotifikasiController::class, 'bacaSemuaAjax'])->name('ajax.baca-semua');
            Route::post('/ajax/{notifikasi}/baca', [NotifikasiController::class, 'bacaAjax'])->name('ajax.baca');
        });

        // Statistik — admin only
        Route::middleware(['role:admin'])->group(function () {
            Route::get('/statistik', [StatistikController::class, 'index'])->name('statistik.index');
            Route::put('/statistik/{statistik}', [StatistikController::class, 'update'])->name('statistik.update');
            Route::post('/statistik/reorder', [StatistikController::class, 'reorder'])->name('statistik.reorder');

            // Struktur Organisasi — admin only
            Route::post('/struktur-organisasi/reorder', [StrukturOrganisasiController::class, 'reorder'])->name('struktur-organisasi.reorder');
            Route::resource('struktur-organisasi', StrukturOrganisasiController::class)->except(['show']);

            // Pengguna CRUD — hanya admin
            Route::resource('pengguna', PenggunaController::class);
        });

        // AI Features (async via queue)
        Route::middleware(['throttle:ai', EnsureAiEnabled::class])->prefix('ai')->name('ai.')->group(function () {
            Route::post('/generate', [AiController::class, 'generate'])->name('generate');
            Route::post('/revise', [AiController::class, 'revise'])->name('revise');
            Route::post('/correct', [AiController::class, 'correct'])->name('correct');
            Route::post('/translate', [AiController::class, 'translate'])->name('translate');
            Route::post('/seo', [AiController::class, 'analyzeSeo'])->name('seo');
            Route::get('/jobs/{aiJob}/status', [AiController::class, 'jobStatus'])->name('job.status');
        });

        // Konten Halaman Publik (CMS teks dinamis) — admin only untuk update
        Route::get('/konten/{halaman}/data', [KontenHalamanController::class, 'show'])->name('konten.show');
        Route::get('/konten/{halaman}', [KontenHalamanController::class, 'edit'])->name('konten.edit');
        Route::middleware(['role:admin'])->group(function () {
            Route::post('/konten/{halaman}', [KontenHalamanController::class, 'update'])->name('konten.update');
            Route::post('/konten/{halaman}/translate', [KontenHalamanController::class, 'translateAll'])->name('konten.translate');
        });

        // Media Upload (TipTap inline images) — semua role CMS bisa upload
        Route::post('/media/upload', [MediaUploadController::class, 'upload'])->name('media.upload');

        // Profil Saya — semua peran CMS
        Route::prefix('profil')->name('profil.')->group(function () {
            Route::get('/', [ProfilController::class, 'edit'])->name('edit');
            Route::put('/', [ProfilController::class, 'update'])->name('update');
            Route::put('/password', [ProfilController::class, 'updatePassword'])->name('password');
            Route::post('/logout-others', [ProfilController::class, 'logoutOtherDevices'])->name('logout-others');
        });

        // Pesan Kontak (CMS Inbox)
        Route::get('/pesan', [PesanKontakController::class, 'index'])->name('pesan.index');
        Route::post('/pesan/bulk-arsip', [PesanKontakController::class, 'bulkArsip'])->name('pesan.bulk-arsip');
        Route::get('/pesan/{pesanKontak}', [PesanKontakController::class, 'show'])->name('pesan.show');
        Route::patch('/pesan/{pesanKontak}/arsip', [PesanKontakController::class, 'arsip'])->name('pesan.arsip');
        // Hapus pesan — admin only
        Route::middleware(['role:admin'])->group(function () {
            Route::delete('/pesan/{pesanKontak}', [PesanKontakController::class, 'destroy'])->name('pesan.destroy');
        });
    });
