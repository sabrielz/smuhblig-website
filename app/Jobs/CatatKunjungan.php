<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class CatatKunjungan implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $kontenType,
        public int $kontenId,
        public string $tanggal
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Upsert atomic untuk menghindari race conditions duplikat
        DB::table('kunjungan_harian')->upsert(
            [
                'tanggal' => $this->tanggal,
                'konten_type' => $this->kontenType,
                'konten_id' => $this->kontenId,
                'jumlah' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            ['tanggal', 'konten_type', 'konten_id'],
            [
                'jumlah' => DB::raw('kunjungan_harian.jumlah + 1'),
                'updated_at' => now(),
            ]
        );
    }
}
