<?php

namespace Database\Seeders;

use App\Models\Pengaturan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PengaturanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Group 'umum'
            ['key' => 'site_name', 'value' => 'SMK Muhammadiyah Bligo', 'type' => 'string', 'label' => 'Nama Situs', 'group' => 'umum'],
            ['key' => 'site_tagline', 'value' => 'Mencetak Generasi Unggul Berakhlak Mulia', 'type' => 'string', 'label' => 'Tagline Situs', 'group' => 'umum'],
            ['key' => 'site_email', 'value' => 'info@smkmuhbligo.sch.id', 'type' => 'string', 'label' => 'Email Resmi', 'group' => 'umum'],
            ['key' => 'site_phone', 'value' => '', 'type' => 'string', 'label' => 'Nomor Telepon', 'group' => 'umum'],
            ['key' => 'site_address', 'value' => '', 'type' => 'string', 'label' => 'Alamat Sekolah', 'group' => 'umum'],
            ['key' => 'site_logo', 'value' => null, 'type' => 'image', 'label' => 'Logo Situs', 'group' => 'umum'],
            ['key' => 'site_favicon', 'value' => null, 'type' => 'image', 'label' => 'Favicon Situs', 'group' => 'umum'],
            ['key' => 'spmb_url', 'value' => 'https://spmb.smkmuhbligo.sch.id', 'type' => 'string', 'label' => 'URL SPMB', 'group' => 'umum'],

            // Group 'fitur'
            ['key' => 'artikel_approval', 'value' => 'false', 'type' => 'boolean', 'label' => 'Persetujuan Artikel', 'group' => 'fitur'],
            ['key' => 'artikel_ai_enabled', 'value' => 'true', 'type' => 'boolean', 'label' => 'Aktifkan AI Artikel', 'group' => 'fitur'],
            ['key' => 'multibahasa_enabled', 'value' => 'true', 'type' => 'boolean', 'label' => 'Aktifkan Multibahasa', 'group' => 'fitur'],

            // Group 'sosial'
            ['key' => 'sosial_instagram', 'value' => '', 'type' => 'string', 'label' => 'URL Instagram', 'group' => 'sosial'],
            ['key' => 'sosial_youtube', 'value' => '', 'type' => 'string', 'label' => 'URL YouTube', 'group' => 'sosial'],
            ['key' => 'sosial_facebook', 'value' => '', 'type' => 'string', 'label' => 'URL Facebook', 'group' => 'sosial'],
            ['key' => 'sosial_tiktok', 'value' => '', 'type' => 'string', 'label' => 'URL TikTok', 'group' => 'sosial'],
            ['key' => 'sosial_twitter', 'value' => '', 'type' => 'string', 'label' => 'URL Twitter/X', 'group' => 'sosial'],

            // Group 'seo'
            ['key' => 'seo_meta_description', 'value' => 'SMK Muhammadiyah Bligo - Sekolah Menengah Kejuruan terbaik dengan jurusan AKL, FKK, TKJ, TKR, dan TSM.', 'type' => 'string', 'label' => 'SEO Meta Description', 'group' => 'seo'],
            ['key' => 'seo_google_analytics', 'value' => '', 'type' => 'string', 'label' => 'Kode Google Analytics', 'group' => 'seo'],

            // Group 'ai'
            ['key' => 'ai_provider', 'value' => 'anthropic', 'type' => 'string', 'label' => 'Provider AI', 'group' => 'ai'],
            ['key' => 'ai_translate_auto', 'value' => 'false', 'type' => 'boolean', 'label' => 'Auto Translate via AI', 'group' => 'ai'],
            ['key' => 'ai_monthly_budget', 'value' => '500000', 'type' => 'string', 'label' => 'Budget AI Bulanan (Rp)', 'group' => 'ai'],
        ];

        foreach ($settings as $setting) {
            Pengaturan::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
