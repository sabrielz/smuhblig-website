<?php

namespace Database\Seeders;

use App\Models\Guru;
use App\Models\Jurusan;
use Illuminate\Database\Seeder;

class GuruContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusanTkj = Jurusan::where('slug', 'teknik-komputer-dan-jaringan')->first();
        $jurusanTkr = Jurusan::where('slug', 'teknik-kendaraan-ringan')->first();

        $gurus = [
            [
                'nama' => 'Contoh – Guru 1',
                'gelar_depan' => 'Drs.',
                'gelar_belakang' => 'M.Pd.',
                'kelompok' => 'guru',
                'jurusan_id' => null,
                'urutan' => 1,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Kepala Sekolah', 'mapel' => 'Pendidikan Kewarganegaraan'],
                    'en' => ['jabatan' => 'Principal', 'mapel' => 'Civic Education'],
                ],
            ],
            [
                'nama' => 'Contoh – Guru 2',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Kom., M.T.',
                'kelompok' => 'guru',
                'jurusan_id' => $jurusanTkj?->id,
                'urutan' => 2,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Ketua Jurusan TKJ', 'mapel' => 'Administrasi Infrastruktur Jaringan'],
                    'en' => ['jabatan' => 'Head of Computer Network Engineering', 'mapel' => 'Network Infrastructure Administration'],
                ],
            ],
            [
                'nama' => 'Contoh – Guru 3',
                'gelar_depan' => 'Ir.',
                'gelar_belakang' => 'S.T.',
                'kelompok' => 'guru',
                'jurusan_id' => $jurusanTkr?->id,
                'urutan' => 3,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Guru Produktif Otomotif', 'mapel' => 'Pemeliharaan Mesin Kendaraan Ringan'],
                    'en' => ['jabatan' => 'Automotive Vocational Teacher', 'mapel' => 'Light Vehicle Engine Maintenance'],
                ],
            ],
            [
                'nama' => 'Contoh – Guru 4',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.Pd.',
                'kelompok' => 'guru',
                'jurusan_id' => null,
                'urutan' => 4,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Guru Bahasa Inggris', 'mapel' => 'Bahasa Inggris'],
                    'en' => ['jabatan' => 'English Teacher', 'mapel' => 'English'],
                ],
            ],
            [
                'nama' => 'Contoh – Tendik 1',
                'gelar_depan' => null,
                'gelar_belakang' => 'A.Md.',
                'kelompok' => 'tendik',
                'jurusan_id' => null,
                'urutan' => 5,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Kepala Tata Usaha', 'mapel' => null],
                    'en' => ['jabatan' => 'Head of Administration', 'mapel' => null],
                ],
            ],
            [
                'nama' => 'Contoh – Tendik 2',
                'gelar_depan' => null,
                'gelar_belakang' => 'S.I.Pust.',
                'kelompok' => 'tendik',
                'jurusan_id' => null,
                'urutan' => 6,
                'is_active' => true,
                'translations' => [
                    'id' => ['jabatan' => 'Pustakawan', 'mapel' => null],
                    'en' => ['jabatan' => 'Librarian', 'mapel' => null],
                ],
            ],
        ];

        foreach ($gurus as $item) {
            $translations = $item['translations'];
            unset($item['translations']);

            /** @var Guru $guru */
            $guru = Guru::create($item);

            foreach ($translations as $locale => $trans) {
                $guru->translations()->create([
                    'locale' => $locale,
                    'jabatan' => $trans['jabatan'],
                    'mapel' => $trans['mapel'],
                    'ai_translated' => false,
                    'reviewed' => true,
                ]);
            }
        }
    }
}
