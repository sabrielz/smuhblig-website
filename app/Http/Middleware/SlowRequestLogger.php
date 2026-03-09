<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class SlowRequestLogger
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Menjalankan middleware saat respon dikirimkan ke client.
     */
    public function terminate(Request $request, Response $response): void
    {
        $duration = microtime(true) - LARAVEL_START;

        if ($duration > 3) {
            Log::channel('slow-requests')->warning('Slow request detected', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'duration' => round($duration, 2) . 's',
                'user_id' => $request->user()?->id ?? 'guest',
                'ip' => $request->ip(),
            ]);
        }
    }
}
