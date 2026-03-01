<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'locale' => fn () => app()->getLocale(),
            'availableLocales' => fn () => config('app.available_locales', ['id', 'en']),

            'auth' => fn () => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $request->user()->avatar ?? null,
                    'role' => $request->user()->roles?->first()?->name ?? null,
                ] : null,
            ],

            'pengaturan' => fn () => Cache::remember('pengaturan.shared', 3600, function () {
                if (!\Illuminate\Support\Facades\Schema::hasTable('pengaturan')) {
                    return $this->defaultPengaturan();
                }

                try {
                    $settings = \App\Models\Pengaturan::pluck('value', 'key')->toArray();
                    return array_merge($this->defaultPengaturan(), $settings);
                } catch (\Exception $e) {
                    return $this->defaultPengaturan();
                }
            }),

            'flash' => fn () => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ]);
    }

    /**
     * Default pengaturan values when database is not yet seeded.
     *
     * @return array<string, string|bool|null>
     */
    private function defaultPengaturan(): array
    {
        return [
            'site_name' => 'SMK Muhammadiyah Bligo',
            'site_tagline' => 'Mencetak Generasi Unggul dan Berakhlak',
            'site_email' => 'info@smkmuhbligo.sch.id',
            'site_phone' => '',
            'site_address' => '',
            'site_logo' => null,
            'artikel_approval' => 'false',
            'artikel_ai_enabled' => 'true',
            'multibahasa_enabled' => 'true',
            'sosial_instagram' => '',
            'sosial_youtube' => '',
            'sosial_facebook' => '',
            'sosial_tiktok' => '',
            'seo_meta_description' => '',
            'seo_google_analytics' => '',
            'ai_provider' => 'anthropic',
            'ai_translate_auto' => 'false',
        ];
    }
}
