<?php

namespace App\Services;

use App\Jobs\CatatKunjungan;
use Illuminate\Http\Request;

class AnalitikService
{
    /**
     * Daftar potongan user-agent bot umum yang diabaikan dari analitik
     */
    protected static array $botKeywords = [
        'bot',
        'crawl',
        'spider',
        'slurp',
        'mediapartners-google',
        'googlebot',
        'bingbot',
        'yandex',
        'duckduckbot',
        'baiduspider',
        'facebookexternalhit',
        'twitterbot',
        'semrush',
        'ahrefs',
        'curl',
        'wget',
        'python',
        'postman',
    ];

    /**
     * Mencatat kunjungan konten jika bukan CMS user dan bukan bot
     */
    public static function catat(Request $request, string $kontenType, int $kontenId): void
    {
        // Abaikan jika pengguna sedang login sebagai staf CMS
        if ($request->user() && $request->user()->isStaff()) {
            return;
        }

        // Abaikan jika user-agent bot
        $userAgent = strtolower((string) $request->userAgent());
        if (empty($userAgent)) {
            return;
        }

        foreach (self::$botKeywords as $keyword) {
            if (str_contains($userAgent, $keyword)) {
                return;
            }
        }

        CatatKunjungan::dispatch(
            $kontenType,
            $kontenId,
            now()->toDateString()
        );
    }
}
