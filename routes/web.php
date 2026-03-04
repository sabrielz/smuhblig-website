<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Public/Beranda');
})->name('beranda');

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
