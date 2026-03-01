<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * Detects locale from:
     * 1. Session (persisted from user choice)
     * 2. Query param ?lang=en
     * 3. Browser Accept-Language header
     * 4. Default: 'id'
     */
    public function handle(Request $request, Closure $next): Response
    {
        $availableLocales = config('app.available_locales', ['id', 'en']);

        // 1. Check query param
        if ($request->has('lang') && in_array($request->query('lang'), $availableLocales)) {
            $locale = $request->query('lang');
            session()->put('locale', $locale);
            app()->setLocale($locale);

            return $next($request);
        }

        // 2. Check session
        if (session()->has('locale') && in_array(session('locale'), $availableLocales)) {
            app()->setLocale(session('locale'));

            return $next($request);
        }

        // 3. Check Accept-Language header
        $browserLocale = $request->getPreferredLanguage($availableLocales);
        if ($browserLocale && in_array($browserLocale, $availableLocales)) {
            app()->setLocale($browserLocale);
            session()->put('locale', $browserLocale);

            return $next($request);
        }

        // 4. Default
        app()->setLocale(config('app.locale', 'id'));

        return $next($request);
    }
}
