<?php

namespace Database\Seeders;

use App\Models\Ekstrakurikuler;
use App\Models\Guru;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EkstrakurikulerContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guruId = Guru::value('id');

        $items = [
            [
                'pembina_guru_id' => $guruId,
                'urutan' => 1,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Hizbul Wathan (HW)',
                        'deskripsi' => '<p>Gerakan Kepanduan Hizbul Wathan melatih kedisiplinan, kemandirian, dan kepemimpinan berlandaskan nilai Islam.</p>',
                        'jadwal' => 'Jumat, 14.00 - 16.30 WIB',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Hizbul Wathan Scouting',
                        'deskripsi' => '<p>Hizbul Wathan scouting movement fostering discipline, self-reliance, and Islamic leadership.</p>',
                        'jadwal' => 'Friday, 14.00 - 16.30 WIB',
                    ],
                ],
            ],
            [
                'pembina_guru_id' => $guruId,
                'urutan' => 2,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Tapak Suci Putera Muhammadiyah',
                        'deskripsi' => '<p>Seni bela diri pencak silat khas Muhammadiyah yang menjunjung tinggi sportivitas dan akhlak mulia.</p>',
                        'jadwal' => 'Sabtu, 15.00 - 17.30 WIB',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Tapak Suci Martial Arts',
                        'deskripsi' => '<p>Muhammadiyah martial art cultivating sportsmanship and noble character.</p>',
                        'jadwal' => 'Saturday, 15.00 - 17.30 WIB',
                    ],
                ],
            ],
            [
                'pembina_guru_id' => null,
                'urutan' => 3,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Palang Merah Remaja (PMR)',
                        'deskripsi' => '<p>Wadah pembinaan kepedulian sosial, pertolongan pertama pada kecelakaan (P3K), dan aksi kemanusiaan.</p>',
                        'jadwal' => 'Rabu, 15.30 - 17.00 WIB',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Youth Red Cross (PMR)',
                        'deskripsi' => '<p>Fostering social concern, first aid skills, and humanitarian actions.</p>',
                        'jadwal' => 'Wednesday, 15.30 - 17.00 WIB',
                    ],
                ],
            ],
            [
                'pembina_guru_id' => null,
                'urutan' => 4,
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'nama' => 'Contoh – Klub Robotika & IoT',
                        'deskripsi' => '<p>Eksplorasi mikrokontroler, otomasi, perakitan robotik, dan proyek berbasis Internet of Things.</p>',
                        'jadwal' => 'Kamis, 15.30 - 17.30 WIB',
                    ],
                    'en' => [
                        'nama' => 'Contoh – Robotics & IoT Club',
                        'deskripsi' => '<p>Exploring microcontrollers, automation, robot prototyping, and IoT projects.</p>',
                        'jadwal' => 'Thursday, 15.30 - 17.30 WIB',
                    ],
                ],
            ],
        ];

        foreach ($items as $data) {
            $slug = Str::slug($data['translations']['id']['nama']);

            /** @var Ekstrakurikuler $ekskul */
            $ekskul = Ekstrakurikuler::create([
                'slug' => $slug,
                'pembina_guru_id' => $data['pembina_guru_id'],
                'urutan' => $data['urutan'],
                'is_active' => $data['is_active'],
            ]);

            foreach ($data['translations'] as $locale => $t) {
                $ekskul->translations()->create([
                    'locale' => $locale,
                    'nama' => $t['nama'],
                    'deskripsi' => $t['deskripsi'],
                    'jadwal' => $t['jadwal'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        }
    }
}
