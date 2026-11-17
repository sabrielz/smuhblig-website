<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StorePengaturanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null && $user->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Group 'umum'
            'site_name' => ['nullable', 'string', 'max:255'],
            'site_tagline' => ['nullable', 'string', 'max:255'],
            'site_email' => ['nullable', 'email', 'max:255'],
            'site_phone' => ['nullable', 'string', 'max:50'],
            'site_address' => ['nullable', 'string'],
            'site_logo' => ['nullable', 'string'],
            'site_favicon' => ['nullable', 'string'],
            'spmb_url' => ['nullable', 'url', 'max:255'],

            // Group 'fitur'
            'artikel_approval' => ['nullable'],
            'artikel_ai_enabled' => ['nullable'],
            'multibahasa_enabled' => ['nullable'],

            // Group 'sosial'
            'sosial_instagram' => ['nullable', 'string', 'max:255'],
            'sosial_youtube' => ['nullable', 'string', 'max:255'],
            'sosial_facebook' => ['nullable', 'string', 'max:255'],
            'sosial_tiktok' => ['nullable', 'string', 'max:255'],
            'sosial_twitter' => ['nullable', 'string', 'max:255'],

            // Group 'seo'
            'seo_meta_description' => ['nullable', 'string'],
            'seo_google_analytics' => ['nullable', 'string', 'max:255'],

            // Group 'ai'
            'ai_provider' => ['nullable', 'string', 'max:50'],
            'ai_translate_auto' => ['nullable'],
            'ai_monthly_budget' => ['nullable', 'string', 'max:50'],

            // Group 'email'
            'email_driver' => ['nullable', 'string', 'max:50'],
            'email_host' => ['nullable', 'string', 'max:255'],
            'email_port' => ['nullable', 'numeric'],
            'email_username' => ['nullable', 'string', 'max:255'],
            'email_password' => ['nullable', 'string', 'max:255'],
            'email_from_name' => ['nullable', 'string', 'max:255'],
            'email_from_address' => ['nullable', 'email', 'max:255'],
            'email_notif_artikel_pending' => ['nullable'],
            'email_notif_pesan_baru' => ['nullable'],
            'email_admin_address' => ['nullable', 'string', 'max:255'],

            // File uploads
            'site_logo_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp,ico', 'max:2048'],
            'site_favicon_file' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp,ico', 'max:2048'],
        ];
    }
}
