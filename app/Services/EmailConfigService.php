<?php

namespace App\Services;

use App\Models\Pengaturan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class EmailConfigService
{
    /**
     * Configure SMTP dynamically from the database 'email' settings group.
     * Skipped if email_host is empty (fallback to .env).
     */
    public static function configure(): void
    {
        try {
            $settings = Cache::remember('email_config', 3600, function () {
                return Pengaturan::getGroup('email');
            });

            $host = $settings['email_host'] ?? null;

            // Guard: jika host kosong / tidak ada, jangan override .env
            if (empty($host)) {
                return;
            }

            Config::set('mail.mailers.smtp.host', $host);
            Config::set('mail.mailers.smtp.port', $settings['email_port'] ?? 587);
            Config::set('mail.mailers.smtp.username', $settings['email_username'] ?? null);
            Config::set('mail.mailers.smtp.password', $settings['email_password'] ?? null);
            Config::set('mail.mailers.smtp.encryption', static::guessEncryption($settings['email_port'] ?? 587));
            Config::set('mail.from.name', $settings['email_from_name'] ?? config('mail.from.name'));
            Config::set('mail.from.address', $settings['email_from_address'] ?? config('mail.from.address'));

            // Set default mailer ke smtp jika driver = smtp
            if (($settings['email_driver'] ?? 'smtp') === 'smtp') {
                Config::set('mail.default', 'smtp');
            }
        } catch (\Throwable) {
            // Database mungkin belum ada saat migrate — skip
        }
    }

    /**
     * Guess encryption type based on port number.
     */
    private static function guessEncryption(int|string $port): string
    {
        return match ((int) $port) {
            465 => 'ssl',
            587 => 'tls',
            default => 'tls',
        };
    }

    /**
     * Flush the cached email config so next request re-reads from DB.
     */
    public static function flushCache(): void
    {
        Cache::forget('email_config');
    }
}
