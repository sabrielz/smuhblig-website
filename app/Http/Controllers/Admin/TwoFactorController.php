<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    /**
     * Mengaktifkan 2FA: buat secret & QR code SVG
     */
    public function enable(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (! $user) {
            abort(401);
        }

        $google2fa = new Google2FA;

        if (empty($user->two_factor_secret)) {
            $user->forceFill([
                'two_factor_secret' => $google2fa->generateSecretKey(),
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ])->save();
        }

        return back()->with('success', 'Kode rahasia 2FA berhasil dibuat. Silakan pindai kode QR dan verifikasi.');
    }

    /**
     * Konfirmasi 2FA dengan OTP 6 digit.
     */
    public function confirm(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'string'],
        ]);

        $user = $request->user();
        if (! $user || empty($user->two_factor_secret)) {
            return back()->with('error', 'Silakan aktifkan 2FA terlebih dahulu.');
        }

        $google2fa = new Google2FA;
        $valid = $google2fa->verifyKey($user->two_factor_secret, (string) $request->input('code'));

        if (! $valid) {
            return back()->withErrors(['code' => 'Kode OTP tidak valid atau telah kedaluwarsa.']);
        }

        // Hasilkan 8 kode pemulihan
        $recoveryCodes = collect(range(1, 8))->map(function () {
            return Str::random(10).'-'.Str::random(10);
        })->all();

        $user->forceFill([
            'two_factor_confirmed_at' => now(),
            'two_factor_recovery_codes' => $recoveryCodes,
        ])->save();

        session()->flash('recovery_codes', $recoveryCodes);

        return back()->with('success', 'Autentikasi dua faktor berhasil dikonfirmasi dan aktif.');
    }

    /**
     * Nonaktifkan 2FA dengan verifikasi password.
     */
    public function disable(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        $user = $request->user();
        if (! $user) {
            abort(401);
        }

        if (! Hash::check($request->input('password'), $user->password)) {
            return back()->withErrors(['password' => 'Kata sandi saat ini tidak cocok.']);
        }

        $user->forceFill([
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return back()->with('success', 'Autentikasi dua faktor berhasil dinonaktifkan.');
    }

    /**
     * Menghasilkan ulang kode pemulihan (recovery codes).
     */
    public function regenerateRecoveryCodes(Request $request): RedirectResponse
    {
        $user = $request->user();
        if (! $user || ! $user->hasTwoFactorEnabled()) {
            return back()->with('error', '2FA belum aktif pada akun ini.');
        }

        $recoveryCodes = collect(range(1, 8))->map(function () {
            return Str::random(10).'-'.Str::random(10);
        })->all();

        $user->forceFill([
            'two_factor_recovery_codes' => $recoveryCodes,
        ])->save();

        session()->flash('recovery_codes', $recoveryCodes);

        return back()->with('success', 'Kode pemulihan baru berhasil dibuat.');
    }

    /**
     * Helper statis untuk membuat QR SVG string
     */
    public static function generateQrSvg(string $company, string $email, string $secret): string
    {
        $google2fa = new Google2FA;
        $qrCodeUrl = $google2fa->getQRCodeUrl($company, $email, $secret);

        $renderer = new ImageRenderer(
            new RendererStyle(192, 0),
            new SvgImageBackEnd
        );
        $writer = new Writer($renderer);

        return $writer->writeString($qrCodeUrl);
    }
}
