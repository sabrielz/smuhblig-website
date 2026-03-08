<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StrukturOrganisasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kepsek = \App\Models\StrukturOrganisasi::updateOrCreate(
            ['jabatan' => 'Kepala Sekolah'],
            [
                'nama' => '[Nama Kepala Sekolah]',
                'jabatan_en' => 'Principal',
                'level' => 0,
                'urutan' => 1,
            ]
        );

        $wakasek = [
            ['nama' => '[Nama Wakasek Kurikulum]', 'jabatan' => 'Wakasek Kurikulum', 'urutan' => 1],
            ['nama' => '[Nama Wakasek Kesiswaan]', 'jabatan' => 'Wakasek Kesiswaan', 'urutan' => 2],
            ['nama' => '[Nama Wakasek Sarana]', 'jabatan' => 'Wakasek Sarana', 'urutan' => 3],
            ['nama' => '[Nama Wakasek Humas]', 'jabatan' => 'Wakasek Humas', 'urutan' => 4],
        ];

        $wakasekModels = [];
        foreach ($wakasek as $data) {
            $wakasekModels[$data['jabatan']] = \App\Models\StrukturOrganisasi::updateOrCreate(
                ['jabatan' => $data['jabatan']],
                array_merge($data, [
                    'parent_id' => $kepsek->id,
                    'level' => 1,
                ])
            );
        }

        $kajur = [
            ['nama' => '[Nama Ketua Jurusan AKL]', 'jabatan' => 'Ketua Jurusan AKL', 'urutan' => 1],
            ['nama' => '[Nama Ketua Jurusan FKK]', 'jabatan' => 'Ketua Jurusan FKK', 'urutan' => 2],
            ['nama' => '[Nama Ketua Jurusan TKJ]', 'jabatan' => 'Ketua Jurusan TKJ', 'urutan' => 3],
            ['nama' => '[Nama Ketua Jurusan TKR]', 'jabatan' => 'Ketua Jurusan TKR', 'urutan' => 4],
            ['nama' => '[Nama Ketua Jurusan TSM]', 'jabatan' => 'Ketua Jurusan TSM', 'urutan' => 5],
        ];

        $wakasekKurikulum = $wakasekModels['Wakasek Kurikulum'] ?? null;
        if ($wakasekKurikulum) {
            foreach ($kajur as $data) {
                \App\Models\StrukturOrganisasi::updateOrCreate(
                    ['jabatan' => $data['jabatan']],
                    array_merge($data, [
                        'parent_id' => $wakasekKurikulum->id,
                        'level' => 2,
                    ])
                );
            }
        }
    }
}
