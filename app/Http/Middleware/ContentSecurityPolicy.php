<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Content Security Policy Middleware
 *
 * - Generate nonce unik per request
 * - Share nonce ke Inertia shared props via request attribute
 * - Terapkan header CSP ke semua response web
 * - Route /admin/ai/* mendapat connect-src yang lebih permissive
 */
class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Generate nonce kriptografis 16-byte → base64
        $nonce = base64_encode(random_bytes(16));

        // Simpan nonce di request attribute agar bisa diakses Blade & HandleInertiaRequests
        $request->attributes->set('csp_nonce', $nonce);

        // Beritahu Vite untuk otomatis inject nonce ke tag <script> dan <style> bawaannya
        \Illuminate\Support\Facades\Vite::useCspNonce($nonce);

        /** @var Response $response */
        $response = $next($request);

        // Tentukan apakah ini rute AI yang butuh Anthropic API access
        $isAiRoute = str_starts_with($request->path(), 'admin/ai');

        $csp = $this->buildCspHeader($nonce, $isAiRoute);

        $response->headers->set('Content-Security-Policy', $csp);

        // Tambahan security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        return $response;
    }

    private function buildCspHeader(string $nonce, bool $isAiRoute): string
    {
        $appUrl = config('app.url', '');
        $isLocal = app()->environment('local');

        // connect-src: tambahkan Anthropic API hanya untuk rute AI
        $connectSrc = "'self'";
        if ($isAiRoute) {
            $connectSrc .= ' https://api.anthropic.com https://api.openai.com';
        }

        $scriptSrc = "'self' 'nonce-{$nonce}' https://fonts.googleapis.com";
        $styleSrc  = "'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com";
        $imgSrc    = "'self' data: blob: https://picsum.photos https://*.googleusercontent.com";

        // Tambahkan exception untuk Vite dev server hanya di development environment
        if ($isLocal) {
            $viteHosts = 'http://localhost:5173 http://127.0.0.1:5173 ws://localhost:5173 ws://127.0.0.1:5173';

            // Vite HMR memerlukan eval() dan koneksi local
            $scriptSrc  .= " 'unsafe-eval' {$viteHosts}";
            $styleSrc   .= " {$viteHosts}";
            $connectSrc .= " {$viteHosts}";
            $imgSrc     .= " {$viteHosts}";
        }

        $directives = [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src {$styleSrc}",
            "font-src 'self' https://fonts.gstatic.com data:",
            "img-src {$imgSrc}",
            "connect-src {$connectSrc}",
            "frame-src https://www.google.com/maps/",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
        ];

        return implode('; ', $directives);
    }
}
