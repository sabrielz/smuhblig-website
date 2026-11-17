<?php

namespace Database\Seeders;

use App\Models\Unduhan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UnduhanContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            [
                'kategori' => 'brosur',
                'tanggal_terbit' => '2026-01-10',
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Brosur Informasi SPMB 2026/2027',
                        'deskripsi' => 'Panduan lengkap persyaratan, alur pendaftaran, dan rincian program keahlian SMK Muhammadiyah Bligo.',
                    ],
                    'en' => [
                        'judul' => 'Contoh – School Admission Brochure 2026/2027',
                        'deskripsi' => 'Comprehensive guide for admission requirements, registration flow, and vocational majors.',
                    ],
                ],
            ],
            [
                'kategori' => 'kalender',
                'tanggal_terbit' => '2026-01-05',
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Kalender Akademik Semester Genap 2025/2026',
                        'deskripsi' => 'Jadwal kegiatan pembelajaran, penilaian tengah semester, asesmen akhir, dan agenda libur sekolah.',
                    ],
                    'en' => [
                        'judul' => 'Contoh – Academic Calendar Even Semester 2025/2026',
                        'deskripsi' => 'Schedule for school activities, mid-term evaluations, final exams, and school holidays.',
                    ],
                ],
            ],
            [
                'kategori' => 'formulir',
                'tanggal_terbit' => '2025-11-20',
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – Formulir Surat Izin Praktik Kerja Lapangan (PKL)',
                        'deskripsi' => 'Blangko permohonan dispensasi dan izin pelaksanaan PKL siswa di industri mitra.',
                    ],
                    'en' => [
                        'judul' => 'Contoh – Internship Permission Form',
                        'deskripsi' => 'Standard application form for student industrial internship placement.',
                    ],
                ],
            ],
            [
                'kategori' => 'sk',
                'tanggal_terbit' => '2025-08-15',
                'is_active' => true,
                'translations' => [
                    'id' => [
                        'judul' => 'Contoh – SK Tata Tertib dan Kode Etik Siswa',
                        'deskripsi' => 'Dokumen resmi peraturan disiplin, hak dan kewajiban peserta didik di lingkungan sekolah.',
                    ],
                    'en' => [
                        'judul' => 'Contoh – Student Code of Conduct Decree',
                        'deskripsi' => 'Official decree regarding student disciplinary rules, rights, and obligations.',
                    ],
                ],
            ],
        ];

        foreach ($items as $data) {
            $slug = Str::slug($data['translations']['id']['judul']);

            /** @var Unduhan $unduhan */
            $unduhan = Unduhan::create([
                'slug' => $slug,
                'kategori' => $data['kategori'],
                'tanggal_terbit' => $data['tanggal_terbit'],
                'jumlah_unduh' => 0,
                'is_active' => $data['is_active'],
            ]);

            foreach ($data['translations'] as $locale => $t) {
                $unduhan->translations()->create([
                    'locale' => $locale,
                    'judul' => $t['judul'],
                    'deskripsi' => $t['deskripsi'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        }
    }
}
