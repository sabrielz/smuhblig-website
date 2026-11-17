<?php

namespace Database\Seeders;

use App\Enums\KategoriPrestasi;
use App\Enums\TingkatPrestasi;
use App\Models\Jurusan;
use App\Models\Prestasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PrestasiContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusanId = Jurusan::value('id');

        $items = [
            [
                'tingkat' => TingkatPrestasi::NASIONAL,
                'kategori' => KategoriPrestasi::AKADEMIK,
                'tahun' => 2026,
                'tanggal' => '2026-04-12',
                'jurusan_id' => $jurusanId,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Juara 1 Lomba Kompetensi Siswa (LKS) Nasional',
                        'ringkasan' => '<p>Meraih medali emas pada ajang LKS Tingkat Nasional bidang Cyber Security dan Rekayasa Perangkat Lunak.</p>',
                    ],
                    'en' => [
                        'judul' => 'Contoh – 1st Place National Vocational Student Competition (LKS)',
                        'ringkasan' => '<p>Won gold medal at the National Level Vocational Skills Competition in Cyber Security and Software Engineering.</p>',
                    ],
                ],
            ],
            [
                'tingkat' => TingkatPrestasi::PROVINSI,
                'kategori' => KategoriPrestasi::NON_AKADEMIK,
                'tahun' => 2026,
                'tanggal' => '2026-03-20',
                'jurusan_id' => null,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Juara Umum Kejuaraan Pencak Silat Tapak Suci Provinsi',
                        'ringkasan' => '<p>Kontingen sekolah berhasil membawa pulang piala bergilir Kejurda Tapak Suci dengan perolehan 4 emas dan 2 perak.</p>',
                    ],
                    'en' => [
                        'judul' => 'Contoh – Overall Champion Provincial Tapak Suci Martial Arts',
                        'ringkasan' => '<p>The school team secured the championship trophy by securing 4 gold and 2 silver medals.</p>',
                    ],
                ],
            ],
            [
                'tingkat' => TingkatPrestasi::KABUPATEN,
                'kategori' => KategoriPrestasi::AKADEMIK,
                'tahun' => 2025,
                'tanggal' => '2025-11-15',
                'jurusan_id' => $jurusanId,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Juara 1 Festival Robotika Pelajar Kabupaten Pekalongan',
                        'ringkasan' => '<p>Karya robot otomasi pemilah sampah cerdas berbasis AI berhasil memukau dewan juri tingkat kabupaten.</p>',
                    ],
                    'en' => [
                        'judul' => 'Contoh – 1st Place Regency Student Robotics Festival',
                        'ringkasan' => '<p>Smart AI-based waste-sorting robot prototype achieved first place at the regency level.</p>',
                    ],
                ],
            ],
            [
                'tingkat' => TingkatPrestasi::KABUPATEN,
                'kategori' => KategoriPrestasi::NON_AKADEMIK,
                'tahun' => 2025,
                'tanggal' => '2025-08-17',
                'jurusan_id' => null,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Juara 2 Lomba Baris-Berbaris Hizbul Wathan',
                        'ringkasan' => '<p>Regu pandu Hizbul Wathan SMK Muhammadiyah Bligo meraih peringkat kedua dalam kompetisi ketangkasan baris-berbaris.</p>',
                    ],
                    'en' => [
                        'judul' => 'Contoh – 2nd Place Hizbul Wathan Marching Competition',
                        'ringkasan' => '<p>Hizbul Wathan scouting troupe placed second in the annual marching agility competition.</p>',
                    ],
                ],
            ],
        ];

        foreach ($items as $data) {
            $slug = Str::slug($data['translations']['id']['judul']);

            /** @var Prestasi $prestasi */
            $prestasi = Prestasi::create([
                'slug' => $slug,
                'tingkat' => $data['tingkat'],
                'kategori' => $data['kategori'],
                'tahun' => $data['tahun'],
                'tanggal' => $data['tanggal'],
                'jurusan_id' => $data['jurusan_id'],
                'is_active' => $data['is_active'],
            ]);

            foreach ($data['translations'] as $locale => $t) {
                $prestasi->translations()->create([
                    'locale' => $locale,
                    'judul' => $t['judul'],
                    'ringkasan' => $t['ringkasan'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        }
    }
}
