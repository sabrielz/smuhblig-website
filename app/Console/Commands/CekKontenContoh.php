<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CekKontenContoh extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'smk:cek-konten-contoh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memindai database untuk mendeteksi konten dummy/contoh atau URL placeholder';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Memulai pemindaian data konten contoh & placeholder...');

        $targets = [
            // Model Utama & Translasinya
            ['table' => 'articles', 'columns' => ['meta_title', 'meta_description']],
            ['table' => 'article_translations', 'columns' => ['title', 'excerpt', 'content']],
            ['table' => 'categories', 'columns' => ['slug']],
            ['table' => 'category_translations', 'columns' => ['name']],
            ['table' => 'pengumumans', 'columns' => ['slug']],
            ['table' => 'pengumuman_translations', 'columns' => ['judul', 'isi']],
            ['table' => 'agendas', 'columns' => ['lokasi', 'slug']],
            ['table' => 'agenda_translations', 'columns' => ['judul', 'deskripsi']],
            ['table' => 'galeris', 'columns' => ['slug']],
            ['table' => 'galeri_translations', 'columns' => ['judul', 'deskripsi']],
            ['table' => 'jurusans', 'columns' => ['slug']],
            ['table' => 'jurusan_translations', 'columns' => ['nama', 'tagline', 'deskripsi_singkat']],
            ['table' => 'gurus', 'columns' => ['nip']],
            ['table' => 'guru_translations', 'columns' => ['nama', 'jabatan']],
            ['table' => 'fasilitas', 'columns' => ['slug']],
            ['table' => 'fasilitas_translations', 'columns' => ['nama', 'deskripsi']],
            ['table' => 'ekstrakurikulers', 'columns' => ['pembina', 'slug']],
            ['table' => 'ekstrakurikuler_translations', 'columns' => ['nama', 'deskripsi']],
            ['table' => 'prestasis', 'columns' => ['tingkat', 'tahun', 'slug']],
            ['table' => 'prestasi_translations', 'columns' => ['judul', 'deskripsi']],
            ['table' => 'unduhans', 'columns' => ['slug']],
            ['table' => 'unduhan_translations', 'columns' => ['judul', 'deskripsi']],
            ['table' => 'faqs', 'columns' => ['kategori']],
            ['table' => 'faq_translations', 'columns' => ['pertanyaan', 'jawaban']],
            ['table' => 'testimonis', 'columns' => ['nama', 'peran']],
            ['table' => 'testimoni_translations', 'columns' => ['kutipan']],
            ['table' => 'mitras', 'columns' => ['nama', 'bidang', 'url']],
            ['table' => 'videos', 'columns' => ['youtube_id']],
            ['table' => 'video_translations', 'columns' => ['judul', 'deskripsi']],
            ['table' => 'halaman_kontens', 'columns' => ['key', 'halaman', 'section']],
            ['table' => 'halaman_konten_translations', 'columns' => ['value']],
            ['table' => 'tautans', 'columns' => ['judul', 'url']],
            ['table' => 'statistiks', 'columns' => ['label', 'nilai']],
            ['table' => 'struktur_organisasis', 'columns' => ['nama', 'jabatan']],
        ];

        $suspiciousPatterns = [
            'Contoh – %',
            'Contoh - %',
            '%lorem ipsum%',
            '%picsum.photos%',
            '%via.placeholder.com%',
            '%example.com%',
            '%placeholder%',
        ];

        $findings = [];

        foreach ($targets as $target) {
            $table = $target['table'];
            if (! Schema::hasTable($table)) {
                continue;
            }

            foreach ($target['columns'] as $column) {
                if (! Schema::hasColumn($table, $column)) {
                    continue;
                }

                $query = DB::table($table);

                $query->where(function ($q) use ($column, $suspiciousPatterns) {
                    foreach ($suspiciousPatterns as $pattern) {
                        $q->orWhere($column, 'LIKE', $pattern);
                    }
                });

                $rows = $query->select('id', $column)->get();

                foreach ($rows as $row) {
                    $val = (string) $row->{$column};
                    $findings[] = [
                        'Tabel' => $table,
                        'ID' => (string) $row->id,
                        'Kolom' => $column,
                        'Nilai' => mb_strimwidth($val, 0, 50, '...'),
                    ];
                }
            }
        }

        if (empty($findings)) {
            $this->info('✅ Bersih: Tidak ditemukan konten contoh atau placeholder.');

            return self::SUCCESS;
        }

        $this->warn('⚠️ Ditemukan '.count($findings).' konten contoh / placeholder:');
        $this->table(['Tabel', 'ID', 'Kolom', 'Nilai'], $findings);

        return self::FAILURE;
    }
}
