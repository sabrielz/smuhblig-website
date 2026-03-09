<?php

namespace App\Providers;

use App\Models\Article;
use App\Observers\ArticleObserver;
use App\Services\EmailConfigService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use App\Models\AiJob;
use App\Observers\AiJobObserver;
use App\Http\Middleware\SlowRequestLogger;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Konfigurasi SMTP dinamis dari database
        EmailConfigService::configure();

        // 2. Daftarkan observer untuk Article & AiJob
        Article::observe(ArticleObserver::class);
        AiJob::observe(AiJobObserver::class);

        // 2.5 Daftarkan middleware pencatatan request lambat secara global (atau bisa ke grup khusus)
        // Kita tidak menggunakan Kernel HTTP Laravel versi lama, melainkan Router:
        if (! $this->app->runningInConsole()) {
            Route::pushMiddlewareToGroup('web', SlowRequestLogger::class);
            Route::pushMiddlewareToGroup('api', SlowRequestLogger::class);
        }

        // 3. Customisasi URL reset password agar mengarah ke halaman Inertia
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return url(route('password.reset', [
                'token' => $token,
                'email' => $user->getEmailForPasswordReset(),
            ], false));
        });

        // =====================================================================
        // 4. Rate Limiters — Semua terpusat di sini
        // =====================================================================

        // Form kontak publik: 3 percobaan per 10 menit per IP
        RateLimiter::for('form-kontak', function (Request $request) {
            return Limit::perMinutes(10, 3)
                ->by($request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'rate_limit' => 'Terlalu banyak percobaan pengiriman pesan. Silakan coba lagi dalam beberapa menit.',
                    ]);
                });
        });

        // Admin AI endpoints: 20 request per menit per user
        RateLimiter::for('admin-ai', function (Request $request) {
            $limit = (int) config('ai.rate_limit_per_minute', 20);

            return Limit::perMinute($limit)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan AI. Coba lagi dalam beberapa saat.',
                    ], 429);
                });
        });

        // Alias 'ai' untuk backward compatibility dengan route throttle:ai
        RateLimiter::for('ai', function (Request $request) {
            $limit = (int) config('ai.rate_limit_per_minute', 20);

            return Limit::perMinute($limit)
                ->by($request->user()?->id ?: $request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan AI. Coba lagi dalam beberapa saat.',
                    ], 429);
                });
        });

        // Pencarian cepat: 30 request per menit per IP
        RateLimiter::for('pencarian-cepat', function (Request $request) {
            return Limit::perMinute(30)
                ->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'message' => 'Terlalu banyak permintaan pencarian. Silakan tunggu sebentar.',
                    ], 429);
                });
        });

        // Login: 5 percobaan per menit per IP
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'email' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam 1 menit.',
                    ]);
                });
        });

        // Password reset: 3 request per jam per IP
        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perHour(3)
                ->by($request->ip())
                ->response(function () {
                    return back()->withErrors([
                        'email' => 'Terlalu banyak permintaan reset password. Silakan coba lagi dalam 1 jam.',
                    ]);
                });
        });
    }
}

