<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tautan;

class TautanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tautans = [
            [
                'label' => 'SPMB Pendaftaran',
                'label_en' => 'SPMB Registration',
                'url' => 'https://spmb.smkmuhbligo.sch.id',
                'deskripsi' => 'Portal pendaftaran siswa baru SMK Muhammadiyah Bligo',
                'deskripsi_en' => 'New student registration portal',
                'icon_name' => 'user-plus',
                'kategori' => 'pendaftaran',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'label' => 'Instagram',
                'label_en' => 'Instagram',
                'url' => 'https://instagram.com/smkmuhbligo',
                'deskripsi' => 'Akun Instagram resmi SMK Muhammadiyah Bligo',
                'deskripsi_en' => 'Official Instagram account',
                'icon_name' => 'instagram',
                'kategori' => 'sosial',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'label' => 'YouTube',
                'label_en' => 'YouTube',
                'url' => 'https://youtube.com',
                'deskripsi' => 'Kanal YouTube SMK Muhammadiyah Bligo',
                'deskripsi_en' => 'YouTube channel',
                'icon_name' => 'youtube',
                'kategori' => 'sosial',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'label' => 'E-Learning',
                'label_en' => 'E-Learning',
                'url' => 'https://elearning.smkmuhbligo.sch.id',
                'deskripsi' => 'Portal pembelajaran daring',
                'deskripsi_en' => 'Online learning portal',
                'icon_name' => 'monitor',
                'kategori' => 'akademik',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'label' => 'WhatsApp Informasi',
                'label_en' => 'Information WhatsApp',
                'url' => 'https://wa.me/6280000000000',
                'deskripsi' => 'Kontak WhatsApp resmi untuk informasi',
                'deskripsi_en' => 'Official WhatsApp contact for information',
                'icon_name' => 'message-circle',
                'kategori' => 'lainnya',
                'is_active' => true,
                'sort_order' => 5,
            ]
        ];

        foreach ($tautans as $tautan) {
            Tautan::create($tautan);
        }
    }
}
