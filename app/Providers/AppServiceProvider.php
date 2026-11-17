<?php

namespace App\Providers;

use App\Http\Middleware\SlowRequestLogger;
use App\Listeners\CatatLogin;
use App\Models\Agenda;
use App\Models\AiJob;
use App\Models\Article;
use App\Models\Ekstrakurikuler;
use App\Models\Faq;
use App\Models\Fasilitas;
use App\Models\Galeri;
use App\Models\Guru;
use App\Models\Jurusan;
use App\Models\Mitra;
use App\Models\Pengumuman;
use App\Models\Prestasi;
use App\Models\Statistik;
use App\Models\StrukturOrganisasi;
use App\Models\Testimoni;
use App\Models\Unduhan;
use App\Models\Video;
use App\Observers\AiJobObserver;
use App\Observers\ArticleObserver;
use App\Observers\PublicCacheObserver;
use App\Services\EmailConfigService;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
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

        // 2.0 Daftarkan PublicCacheObserver untuk model-model publik
        $publicModels = [
            Article::class,
            Agenda::class,
            Ekstrakurikuler::class,
            Fasilitas::class,
            Faq::class,
            Galeri::class,
            Guru::class,
            Jurusan::class,
            Mitra::class,
            Pengumuman::class,
            Prestasi::class,
            Statistik::class,
            StrukturOrganisasi::class,
            Testimoni::class,
            Unduhan::class,
            Video::class,
        ];
        foreach ($publicModels as $modelClass) {
            $modelClass::observe(PublicCacheObserver::class);
        }

        // 2.1 Daftarkan listener login untuk audit trail aktivitas (Sesi 6-04)
        Event::listen(Login::class, [CatatLogin::class, 'handle']);
        Event::listen(Failed::class, [CatatLogin::class, 'handle']);

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
