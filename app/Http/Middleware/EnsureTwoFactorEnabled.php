<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTwoFactorEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Admin wajib mengaktifkan 2FA
        if ($user && $user->isAdmin() && ! $user->hasTwoFactorEnabled()) {
            // Kecualikan rute 2FA dan rute profil/logout agar tidak infinite redirect loop
            $excludedRoutes = [
                'admin.profil.edit',
                'admin.profil.update',
                'admin.profil.password',
                'admin.two-factor.enable',
                'admin.two-factor.confirm',
                'admin.two-factor.disable',
                'admin.two-factor.recovery-codes',
                'logout',
            ];

            $currentRoute = $request->route()?->getName();
            if (! in_array($currentRoute, $excludedRoutes, true)) {
                return redirect()->route('admin.profil.edit')
                    ->with('warning', 'Sebagai Administrator, Anda wajib mengaktifkan Autentikasi Dua Faktor (2FA) demi keamanan.');
            }
        }

        return $next($request);
    }
}
