<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use App\Http\Requests\Admin\UpdateProfilRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $twoFactorEnabled = $user->hasTwoFactorEnabled();
        $twoFactorQrSvg = null;
        $twoFactorSecret = null;

        if (! $twoFactorEnabled && ! empty($user->two_factor_secret)) {
            $twoFactorSecret = $user->two_factor_secret;
            $twoFactorQrSvg = TwoFactorController::generateQrSvg(
                config('app.name', 'SMK Muhammadiyah Bligo'),
                $user->email,
                $user->two_factor_secret
            );
        }

        return Inertia::render('Admin/Profil/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'roles' => $user->getRoleNames(),
                'created_at' => $user->created_at?->format('d M Y'),
                'two_factor_enabled' => $twoFactorEnabled,
                'two_factor_qr_svg' => $twoFactorQrSvg,
                'two_factor_secret' => $twoFactorSecret,
            ],
            'recoveryCodes' => session('recovery_codes'),
        ]);
    }

    public function update(UpdateProfilRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if ($request->hasFile('avatar')) {
            // Hapus avatar lama jika ada di storage
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
        }

        $user->save();

        return redirect()
            ->route('admin.profil.edit')
            ->with('success', 'Profil berhasil diperbarui.');
    }

    public function updatePassword(UpdatePasswordRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $user->password = Hash::make($validated['password']);
        $user->save();

        return redirect()
            ->route('admin.profil.edit')
            ->with('success', 'Password berhasil diperbarui.');
    }

    public function logoutOtherDevices(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'current_password'],
        ]);

        Auth::logoutOtherDevices($validated['password']);

        return redirect()
            ->route('admin.profil.edit')
            ->with('success', 'Berhasil keluar dari seluruh sesi perangkat lain.');
    }
}
