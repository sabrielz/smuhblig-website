<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Berita Sekolah',
                'description' => 'Informasi terbaru seputar kegiatan dan kebijakan SMK Muhammadiyah Bligo.',
                'color' => '#003f87',
                'en_name' => 'School News',
                'en_description' => 'Latest information about activities and policies of SMK Muhammadiyah Bligo.',
            ],
            [
                'name' => 'Prestasi',
                'description' => 'Berita membanggakan tentang pencapaian siswa dan guru.',
                'color' => '#c9a84c',
                'en_name' => 'Achievements',
                'en_description' => 'Proud news about student and teacher achievements.',
            ],
            [
                'name' => 'Kegiatan Siswa',
                'description' => 'Dokumentasi berbagai aktivitas belajar dan ekstrakurikuler.',
                'color' => '#28a745',
                'en_name' => 'Student Activities',
                'en_description' => 'Documentation of various learning and extracurricular activities.',
            ],
            [
                'name' => 'Pengumuman',
                'description' => 'Pemberitahuan resmi dari pihak sekolah untuk orang tua dan siswa.',
                'color' => '#dc3545',
                'en_name' => 'Announcements',
                'en_description' => 'Official notifications from the school for parents and students.',
            ],
            [
                'name' => 'Artikel Pendidikan',
                'description' => 'Tulisan informatif dan edukatif seputar dunia pendidikan.',
                'color' => '#17a2b8',
                'en_name' => 'Educational Articles',
                'en_description' => 'Informative and educational writings about the world of education.',
            ],
        ];

        $order = 1;
        foreach ($categories as $cat) {
            $category = Category::create([
                'name' => $cat['name'],
                'description' => $cat['description'],
                'color' => $cat['color'],
                'sort_order' => $order++,
                'is_active' => true,
            ]);

            // Default translation (ID)
            $category->translations()->create([
                'locale' => 'id',
                'name' => $cat['name'],
                'description' => $cat['description'],
            ]);

            // English translation
            $category->translations()->create([
                'locale' => 'en',
                'name' => $cat['en_name'],
                'description' => $cat['en_description'],
            ]);
        }
    }
}
