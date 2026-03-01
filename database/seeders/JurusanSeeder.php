<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class JurusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusans = [
            [
                'kode' => 'AKL',
                'slug' => 'akl',
                'color_start' => '#1e3a5f',
                'color_end' => '#003f87',
                'icon_name' => 'calculator',
                'sort_order' => 1,
                'is_active' => true,
                'translation' => [
                    'locale' => 'id',
                    'nama' => 'Akuntansi dan Keuangan Lembaga',
                    'tagline' => 'Mencetak Ahli Keuangan yang Profesional dan Berintegritas',
                    'deskripsi_singkat' => 'Jurusan yang mempersiapkan lulusan kompeten di bidang akuntansi, perpajakan, dan keuangan lembaga untuk siap kerja di era digital.',
                    'kompetensi' => ["Akuntansi Dasar", "Perpajakan", "Komputer Akuntansi", "Perbankan", "Administrasi Keuangan"],
                    'prospek_karir' => ["Staf Akuntansi", "Teller Bank", "Administrasi Keuangan", "Wirausaha", "Lanjut ke Perguruan Tinggi"],
                ]
            ],
            [
                'kode' => 'FKK',
                'slug' => 'fkk',
                'color_start' => '#1a5c3a',
                'color_end' => '#0d4a2d',
                'icon_name' => 'pill',
                'sort_order' => 2,
                'is_active' => true,
                'translation' => [
                    'locale' => 'id',
                    'nama' => 'Farmasi Klinis dan Komunitas',
                    'tagline' => 'Generasi Apoteker Muda yang Peduli Kesehatan Umat',
                    'deskripsi_singkat' => 'Jurusan yang menyiapkan tenaga farmasi terampil untuk pelayanan kesehatan di klinik, apotek, dan komunitas masyarakat.',
                    'kompetensi' => ["Ilmu Farmasi Dasar", "Pelayanan Kefarmasian", "Peracikan Obat", "K3 Farmasi", "Farmakologi"],
                    'prospek_karir' => ["Asisten Apoteker", "Staf Apotek", "Industri Farmasi", "Klinik & Puskesmas", "Wirausaha Apotek"],
                ]
            ],
            [
                'kode' => 'TKJ',
                'slug' => 'tkj',
                'color_start' => '#1e3a5f',
                'color_end' => '#0d2d4a',
                'icon_name' => 'network',
                'sort_order' => 3,
                'is_active' => true,
                'translation' => [
                    'locale' => 'id',
                    'nama' => 'Teknik Komputer dan Jaringan',
                    'tagline' => 'Membangun Infrastruktur Digital Indonesia',
                    'deskripsi_singkat' => 'Jurusan yang menghasilkan teknisi handal dalam instalasi, konfigurasi, dan pemeliharaan jaringan komputer serta sistem teknologi informasi.',
                    'kompetensi' => ["Jaringan Komputer", "Sistem Operasi Linux", "Keamanan Jaringan", "Cloud Computing", "Troubleshooting Hardware"],
                    'prospek_karir' => ["Network Engineer", "IT Support", "Teknisi Jaringan", "System Administrator", "Wirausaha IT"],
                ]
            ],
            [
                'kode' => 'TKR',
                'slug' => 'tkr',
                'color_start' => '#5c1a1a',
                'color_end' => '#3d0000',
                'icon_name' => 'car',
                'sort_order' => 4,
                'is_active' => true,
                'translation' => [
                    'locale' => 'id',
                    'nama' => 'Teknik Kendaraan Ringan Otomotif',
                    'tagline' => 'Mekanik Handal, Berkarakter, Siap Industri',
                    'deskripsi_singkat' => 'Jurusan yang membekali siswa dengan keahlian perbaikan dan perawatan kendaraan ringan sesuai standar industri otomotif modern.',
                    'kompetensi' => ["Mesin Otomotif", "Sistem Kelistrikan", "Transmisi & Kopling", "Sistem Rem & Suspensi", "Tune Up & Servis"],
                    'prospek_karir' => ["Mekanik Bengkel Resmi", "Teknisi Otomotif", "Supervisor Bengkel", "Wirausaha Bengkel", "Industri Manufaktur"],
                ]
            ],
            [
                'kode' => 'TSM',
                'slug' => 'tsm',
                'color_start' => '#5c3d1a',
                'color_end' => '#3d2200',
                'icon_name' => 'bike',
                'sort_order' => 5,
                'is_active' => true,
                'translation' => [
                    'locale' => 'id',
                    'nama' => 'Teknik dan Bisnis Sepeda Motor',
                    'tagline' => 'Ahli Sepeda Motor, Jiwa Wirausaha',
                    'deskripsi_singkat' => 'Jurusan yang mengkombinasikan keahlian teknik sepeda motor dengan jiwa kewirausahaan untuk mencetak mekanik profesional sekaligus pengusaha muda.',
                    'kompetensi' => ["Sistem Mesin Sepeda Motor", "Kelistrikan Sepeda Motor", "Servis Berkala", "Balancing & Spooring", "Manajemen Bengkel"],
                    'prospek_karir' => ["Mekanik Honda/Yamaha/Suzuki", "Kepala Mekanik", "Wirausaha Bengkel", "Instruktur Otomotif", "Industri Sepeda Motor"],
                ]
            ],
        ];

        foreach ($jurusans as $data) {
            $translationData = $data['translation'];
            unset($data['translation']);

            $jurusan = Jurusan::firstOrCreate(
                ['kode' => $data['kode']],
                $data
            );

            // Update translation
            $jurusan->translations()->updateOrCreate(
                ['locale' => $translationData['locale']],
                array_merge($translationData, [
                    'ai_translated' => false,
                    'reviewed' => true,
                ])
            );
        }
    }
}
