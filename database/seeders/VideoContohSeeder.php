<?php

namespace Database\Seeders;

use App\Models\Galeri;
use App\Models\Video;
use Illuminate\Database\Seeder;

class VideoContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $galeri = Galeri::first();

        $videos = [
            [
                'youtube_id' => 'dQw4w9WgXcQ',
                'galeri_id' => $galeri?->id,
                'urutan' => 1,
                'is_active' => true,
                'id' => [
                    'judul' => 'Contoh – Profil Resmi SMK Muhammadiyah Bligo 2026',
                ],
                'en' => [
                    'judul' => 'Official School Profile SMK Muhammadiyah Bligo 2026',
                ],
            ],
            [
                'youtube_id' => '9bZkp7q19f0',
                'galeri_id' => $galeri?->id,
                'urutan' => 2,
                'is_active' => true,
                'id' => [
                    'judul' => 'Contoh – Suasana Pembelajaran Praktik Laboratorium & Bengkel Industri',
                ],
                'en' => [
                    'judul' => 'Hands-on Learning Environment in Industrial Workshops',
                ],
            ],
        ];

        foreach ($videos as $item) {
            /** @var Video $v */
            $v = Video::create([
                'youtube_id' => $item['youtube_id'],
                'galeri_id' => $item['galeri_id'],
                'urutan' => $item['urutan'],
                'is_active' => $item['is_active'],
            ]);

            $v->translations()->create([
                'locale' => 'id',
                'judul' => $item['id']['judul'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            $v->translations()->create([
                'locale' => 'en',
                'judul' => $item['en']['judul'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);
        }
    }
}
