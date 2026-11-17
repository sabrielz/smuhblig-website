<?php

namespace App\Http\Middleware;

use App\Models\Pengaturan;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAiEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Pengaturan::bool('artikel_ai_enabled', true)) {
            return response()->json([
                'message' => 'Fitur AI dinonaktifkan oleh admin.',
            ], 403);
        }

        return $next($request);
    }
}
