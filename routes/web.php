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
    });
