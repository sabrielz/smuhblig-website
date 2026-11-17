<?php

namespace Database\Seeders;

use App\Models\Fasilitas;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FasilitasContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kategori' => 'ruang_praktik',
                'urutan' => 1,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Bengkel Otomotif Modern',
                        'deskripsi' => '<p>Bengkel standar industri untuk praktik perbaikan dan pemeliharaan kendaraan roda empat.</p>',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Modern Automotive Workshop',
                        'deskripsi' => '<p>Industry-standard workshop for automotive repair and maintenance practice.</p>',
                    ],
                ],
            ],
            [
                'kategori' => 'ruang_praktik',
                'urutan' => 2,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Laboratorium Komputer Jaringan',
                        'deskripsi' => '<p>Laboratorium komputer berpendingin udara dilengkapi perangkat routing dan switching enterprise.</p>',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Computer Network Laboratory',
                        'deskripsi' => '<p>Air-conditioned computer lab equipped with enterprise routing and switching devices.</p>',
                    ],
                ],
            ],
            [
                'kategori' => 'ibadah',
                'urutan' => 3,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Masjid Sekolah Baitul Ilmi',
                        'deskripsi' => '<p>Pusat kegiatan ibadah, pembinaan karakter Islami, dan shalat berjamaah seluruh civitas sekolah.</p>',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Baitul Ilmi School Mosque',
                        'deskripsi' => '<p>Center for worship, Islamic character building, and congregational prayer.</p>',
                    ],
                ],
            ],
            [
                'kategori' => 'olahraga',
                'urutan' => 4,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Lapangan Olahraga Serbaguna',
                        'deskripsi' => '<p>Fasilitas lapangan outdoor untuk futsal, bola voli, bola basket, dan upacara bendera.</p>',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Multipurpose Sports Field',
                        'deskripsi' => '<p>Outdoor sports facility for futsal, volleyball, basketball, and flag ceremonies.</p>',
                    ],
                ],
            ],
            [
                'kategori' => 'umum',
                'urutan' => 5,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Perpustakaan Digital',
                        'deskripsi' => '<p>Koleksi ribuan buku fisik dan referensi e-book dengan ruang baca yang nyaman.</p>',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Digital Library',
                        'deskripsi' => '<p>Collection of physical books and e-book references with comfortable study spaces.</p>',
                    ],
                ],
            ],
        ];

        foreach ($items as $item) {
            $translations = $item['translations'];
            unset($item['translations']);

            /** @var Fasilitas $fasilitas */
            $fasilitas = Fasilitas::create([
                ...$item,
                'slug' => Str::slug($translations['id']['nama']),
            ]);

            foreach ($translations as $locale => $t) {
                $fasilitas->translations()->create([
                    'locale' => $locale,
                    'nama' => $t['nama'],
                    'deskripsi' => $t['deskripsi'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        }
    }
}
