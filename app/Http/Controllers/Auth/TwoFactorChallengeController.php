<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorChallengeController extends Controller
{
    /**
     * Tampilkan halaman challenge 2FA.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        return Inertia::render('Auth/TwoFactorChallenge');
    }

    /**
     * Verifikasi kode OTP atau kode pemulihan.
     */
    public function store(Request $request): RedirectResponse
    {
        if (! $request->session()->has('login.id')) {
            return redirect()->route('login');
        }

        $userId = $request->session()->get('login.id');
        /** @var User|null $user */
        $user = User::find($userId);

        if (! $user || ! $user->hasTwoFactorEnabled()) {
            $request->session()->forget(['login.id', 'login.remember']);

            return redirect()->route('login');
        }

        $code = $request->input('code');
        $recoveryCode = $request->input('recovery_code');

        if (! empty($code)) {
            $google2fa = new Google2FA;
            $valid = $google2fa->verifyKey($user->two_factor_secret, (string) $code);

            if (! $valid) {
                return back()->withErrors(['code' => 'Kode autentikasi tidak valid atau sudah kedaluwarsa.']);
            }
        } elseif (! empty($recoveryCode)) {
            /** @var array<string> $recoveryCodes */
            $recoveryCodes = is_array($user->two_factor_recovery_codes) ? $user->two_factor_recovery_codes : [];
            $foundIndex = null;

            foreach ($recoveryCodes as $index => $rc) {
                if (hash_equals($rc, trim((string) $recoveryCode))) {
                    $foundIndex = $index;
                    break;
                }
            }

            if ($foundIndex === null) {
                return back()->withErrors(['recovery_code' => 'Kode pemulihan tidak valid atau sudah digunakan.']);
            }

            // Hapus kode pemulihan yang sudah digunakan (sekali pakai)
            unset($recoveryCodes[$foundIndex]);
            $user->forceFill([
                'two_factor_recovery_codes' => array_values($recoveryCodes),
            ])->save();
        } else {
            return back()->withErrors(['code' => 'Harap masukkan kode OTP atau kode pemulihan.']);
        }

        $remember = (bool) $request->session()->get('login.remember', false);
        $request->session()->forget(['login.id', 'login.remember']);

        Auth::login($user, $remember);
        $request->session()->regenerate();

        $user->update([
            'last_login_at' => now(),
        ]);

        return redirect()->intended(route('admin.dashboard'));
    }
}
