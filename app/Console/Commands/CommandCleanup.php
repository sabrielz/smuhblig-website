<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class CommandCleanup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'smk:cleanup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menghapus data lawas (ai_jobs, notifikasi, pesan, temp file) untuk optimasi database dan storage.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Memulai optimasi dan cleanup data lawas...');

        // 1. Hapus ai_jobs dengan status='done' yang lebih dari 30 hari
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        $aiJobsDeleted = DB::table('ai_jobs')
            ->where('status', 'done')
            ->where('created_at', '<', $thirtyDaysAgo)
            ->delete();
        $this->info("Dihapus {$aiJobsDeleted} catatan ai_jobs.");

        // 2. Hapus notifikasi_admin yang sudah dibaca lebih dari 60 hari
        $sixtyDaysAgo = Carbon::now()->subDays(60);
        $notifikasiDeleted = DB::table('notifikasi_admin')
            ->whereNotNull('dibaca_at')
            ->where('created_at', '<', $sixtyDaysAgo)
            ->delete();
        $this->info("Dihapus {$notifikasiDeleted} notifikasi admin yang sudah dibaca.");

        // 3. Hapus pesan_kontak dengan status='diarsip' lebih dari 90 hari
        $ninetyDaysAgo = Carbon::now()->subDays(90);
        $pesanDeleted = DB::table('pesan_kontak')
            ->where('status', 'diarsip')
            ->where('created_at', '<', $ninetyDaysAgo)
            ->delete();
        $this->info("Dihapus {$pesanDeleted} pesan kontak arsip.");

        // 4. Hapus file temporary di storage/app/temp
        $tempFilesDeleted = 0;
        if (Storage::exists('temp')) {
            $files = Storage::files('temp');
            foreach ($files as $file) {
                // Delete file that is older than 24 hours just to be safe,
                // or safely follow prompt and delete all if allowed.
                // However, deleting all temp blindly is standard for "temp".
                // I will check modification time up to yesterday to avoid issues.
                if (Storage::lastModified($file) < Carbon::now()->subDay()->timestamp) {
                    Storage::delete($file);
                    $tempFilesDeleted++;
                }
            }
        }
        $this->info("Dihapus {$tempFilesDeleted} file temporary di storage/app/temp (>24 jam).");

        $this->info('Cleanup selesai!');
    }
}
