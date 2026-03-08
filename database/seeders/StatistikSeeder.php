<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatistikSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statistik = [
            [
                'key' => 'total_siswa',
                'nilai' => 800,
                'label' => 'Siswa Aktif',
                'label_en' => 'Active Students',
                'suffix' => '+',
                'icon_name' => 'users',
                'sort_order' => 1,
            ],
            [
                'key' => 'total_alumni',
                'nilai' => 5000,
                'label' => 'Alumni Berprestasi',
                'label_en' => 'Accomplished Alumni',
                'suffix' => '+',
                'icon_name' => 'graduation-cap',
                'sort_order' => 2,
            ],
            [
                'key' => 'pengajar',
                'nilai' => 60,
                'label' => 'Tenaga Pengajar',
                'label_en' => 'Teaching Staff',
                'suffix' => '+',
                'icon_name' => 'book-open',
                'sort_order' => 3,
            ],
            [
                'key' => 'tahun_berdiri',
                'nilai' => 1985,
                'label' => 'Tahun Berdiri',
                'label_en' => 'Year Established',
                'suffix' => null,
                'icon_name' => 'calendar',
                'sort_order' => 4,
            ],
        ];

        foreach ($statistik as $data) {
            \App\Models\Statistik::updateOrCreate(
                ['key' => $data['key']],
                $data
            );
        }
    }
}
