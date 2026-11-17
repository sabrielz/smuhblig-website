<?php

namespace App\Console\Commands;

use App\Mail\JobGagalMail;
use App\Models\Pengaturan;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class LaporJobGagal extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'smk:lapor-job-gagal';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim email ringkasan jika ada failed_jobs baru sejak laporan terakhir';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        if (! Schema::hasTable('failed_jobs')) {
            $this->warn('Tabel failed_jobs belum tersedia.');

            return self::SUCCESS;
        }

        $lastReportedId = (int) Cache::get('smk:last_reported_failed_job_id', 0);

        $newFailedJobs = DB::table('failed_jobs')
            ->where('id', '>', $lastReportedId)
            ->orderBy('id', 'asc')
            ->get();

        if ($newFailedJobs->isEmpty()) {
            $this->info('Tidak ada failed_jobs baru.');

            return self::SUCCESS;
        }

        $adminEmail = Pengaturan::get('email_admin_address')
            ?? config('mail.from.address');

        if (! empty($adminEmail)) {
            try {
                Mail::to($adminEmail)->send(new JobGagalMail($newFailedJobs));
                $this->info("Email peringatan berhasil dikirim ke {$adminEmail} ({$newFailedJobs->count()} jobs).");
            } catch (\Throwable $e) {
                $this->error('Gagal mengirim email peringatan: '.$e->getMessage());
            }
        }

        $latestId = $newFailedJobs->max('id');
        if ($latestId) {
            Cache::forever('smk:last_reported_failed_job_id', $latestId);
        }

        return self::SUCCESS;
    }
}
