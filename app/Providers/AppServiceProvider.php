<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
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
        // Rate limiter for AI endpoints: 20 requests per minute per user
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
    }
}

