<?php

namespace App\Jobs;

use App\Models\PesanKontak;
use App\Models\Pengaturan;
use App\Mail\PesanKontakMasukMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class KirimNotifikasiPesanBaru implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Maximum number of attempts.
     */
    public int $tries = 3;

    /**
     * Backoff intervals in seconds between retries.
     *
     * @var int[]
     */
    public array $backoff = [10, 30, 60];

    public function __construct(
        protected PesanKontak $pesanKontak,
    ) {
        $this->queue = 'default';
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Check if email notification is enabled
        $notifEnabled = Pengaturan::get('email_notif_pesan_baru', 'true');
        if ($notifEnabled === 'false' || $notifEnabled === false) {
            Log::info('[KirimNotifikasiPesanBaru] Notifikasi email dinonaktifkan.', [
                'pesan_id' => $this->pesanKontak->id,
            ]);
            return;
        }

        // Check if admin email address is configured
        $emailAdmin = Pengaturan::get('email_admin_address', null);
        if (empty($emailAdmin)) {
            Log::warning('[KirimNotifikasiPesanBaru] email_admin_address tidak dikonfigurasi.', [
                'pesan_id' => $this->pesanKontak->id,
            ]);
            return;
        }

        // Send the email
        Mail::to($emailAdmin)->send(new PesanKontakMasukMail($this->pesanKontak));

        Log::info('[KirimNotifikasiPesanBaru] Email notifikasi terkirim.', [
            'pesan_id' => $this->pesanKontak->id,
            'to'       => $emailAdmin,
        ]);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('[KirimNotifikasiPesanBaru] Gagal mengirim email notifikasi.', [
            'pesan_id' => $this->pesanKontak->id,
            'error'    => $exception->getMessage(),
        ]);
    }
}
