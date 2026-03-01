<?php

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
