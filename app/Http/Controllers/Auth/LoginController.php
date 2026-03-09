<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\EmailConfigService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    /**
     * Show the login page.
     */
    public function show(Request $request): Response|RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Update last_login_at timestamp
        $request->user()->update([
            'last_login_at' => now(),
        ]);

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('beranda');
    }

    // =========================================================================
    // PASSWORD RESET
    // =========================================================================

    /**
     * Show the forgot password form.
     */
    public function showForgotForm(Request $request): Response|RedirectResponse
    {
        if ($request->user()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Auth/LupaPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Send a password reset link to the given user.
     */
    public function sendResetLink(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Apply dynamic SMTP config before sending
        EmailConfigService::configure();

        $status = Password::sendResetLink(
            $request->only('email'),
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        return back()->withInput($request->only('email'))
            ->withErrors(['email' => __($status)]);
    }

    /**
     * Show the reset password form.
     */
    public function showResetForm(Request $request, string $token): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email', ''),
        ]);
    }

    /**
     * Handle an incoming new password request.
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $request->validate([
            'token'                 => ['required'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password'       => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            },
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')
                ->with('status', __($status));
        }

        return back()->withInput($request->only('email'))
            ->withErrors(['email' => __($status)]);
    }
}
