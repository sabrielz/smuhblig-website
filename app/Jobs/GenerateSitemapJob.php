<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class GenerateSitemapJob implements ShouldQueue
{
    use Queueable;

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            Artisan::call('sitemap:generate');
        } catch (\Throwable $e) {
            Log::error('Gagal menjalankan generate sitemap job', ['exception' => $e]);
        }
    }
}
