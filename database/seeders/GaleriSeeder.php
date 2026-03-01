<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Galeri;
use Illuminate\Support\Carbon;

class GaleriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galleries = [
            [
                'slug' => 'kegiatan-upacara-bendera-2026',
                'event_date' => Carbon::parse('2026-02-15'),
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 1,
                'translations' => [
                    [
                        'locale' => 'id',
                        'judul' => 'Kegiatan Upacara Bendera 2026',
                        'deskripsi' => 'Dokumentasi kegiatan upacara bendera yang dilaksanakan dengan khidmat.',
                        'ai_translated' => false,
                        'reviewed' => true,
                    ],
                    [
                        'locale' => 'en',
                        'judul' => '2026 Flag Ceremony Event',
                        'deskripsi' => 'Documentation of the solemnly conducted flag ceremony.',
                        'ai_translated' => true,
                        'reviewed' => true,
                    ]
                ]
            ],
            [
                'slug' => 'kunjungan-industri-tkj',
                'event_date' => Carbon::parse('2026-03-01'),
                'is_featured' => true,
                'is_active' => true,
                'sort_order' => 2,
                'translations' => [
                    [
                        'locale' => 'id',
                        'judul' => 'Kunjungan Industri Jurusan TKJ',
                        'deskripsi' => 'Album foto kunjungan industri siswa jurusan Teknik Komputer Jaringan ke perusahaan teknologi lokal.',
                        'ai_translated' => false,
                        'reviewed' => true,
                    ],
                    [
                        'locale' => 'en',
                        'judul' => 'TKJ Department Industrial Visit',
                        'deskripsi' => 'Photo album of the industrial visit by Computer Network Engineering students to local tech companies.',
                        'ai_translated' => true,
                        'reviewed' => true,
                    ]
                ]
            ],
            [
                'slug' => 'lomba-kompetensi-siswa-tingkat-provinsi',
                'event_date' => Carbon::parse('2026-04-10'),
                'is_featured' => false,
                'is_active' => true,
                'sort_order' => 3,
                'translations' => [
                    [
                        'locale' => 'id',
                        'judul' => 'Lomba Kompetensi Siswa Tingkat Provinsi',
                        'deskripsi' => 'Galeri partisipasi siswa-siswi SMK Muhammadiyah Bligo dalam LKS Tingkat Provinsi.',
                        'ai_translated' => false,
                        'reviewed' => true,
                    ],
                    [
                        'locale' => 'en',
                        'judul' => 'Provincial Level Student Competency Competition',
                        'deskripsi' => 'Gallery of student participation from SMK Muhammadiyah Bligo in the Provincial Student Competency Competition.',
                        'ai_translated' => true,
                        'reviewed' => true,
                    ]
                ]
            ]
        ];

        foreach ($galleries as $galleryData) {
            $translations = $galleryData['translations'];
            unset($galleryData['translations']);

            $galeri = Galeri::create($galleryData);

            foreach ($translations as $translation) {
                $galeri->translations()->create($translation);
            }
        }
    }
}
