<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\Mitra;
use Illuminate\Database\Seeder;

class MitraContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jurusans = Jurusan::all()->keyBy('kode');

        $mitras = [
            [
                'nama' => 'Contoh – PT Telkom Indonesia',
                'bidang' => 'Teknologi Informasi & Telekomunikasi',
                'url' => 'https://telkom.co.id',
                'urutan' => 1,
                'is_active' => true,
                'jurusan_kodes' => ['TKJ'],
            ],
            [
                'nama' => 'Contoh – PT Astra Honda Motor',
                'bidang' => 'Manufaktur & Otomotif Roda Dua',
                'url' => 'https://astra-honda.com',
                'urutan' => 2,
                'is_active' => true,
                'jurusan_kodes' => ['TBSM', 'TKR'],
            ],
            [
                'nama' => 'Contoh – PT Nasmoco Bahari Motor Pekalongan',
                'bidang' => 'Dealer & Servis Kendaraan Roda Empat',
                'url' => 'https://nasmoco.co.id',
                'urutan' => 3,
                'is_active' => true,
                'jurusan_kodes' => ['TKR'],
            ],
            [
                'nama' => 'Contoh – PT Dan Liris Garmen',
                'bidang' => 'Industri Tekstil & Fashion Busana',
                'url' => 'https://danliris.com',
                'urutan' => 4,
                'is_active' => true,
                'jurusan_kodes' => ['TB'],
            ],
            [
                'nama' => 'Contoh – Bank Syariah Indonesia (BSI)',
                'bidang' => 'Perbankan & Keuangan Syariah',
                'url' => 'https://bankbsi.co.id',
                'urutan' => 5,
                'is_active' => true,
                'jurusan_kodes' => ['AKL'],
            ],
        ];

        foreach ($mitras as $item) {
            /** @var Mitra $m */
            $m = Mitra::create([
                'nama' => $item['nama'],
                'bidang' => $item['bidang'],
                'url' => $item['url'],
                'urutan' => $item['urutan'],
                'is_active' => $item['is_active'],
            ]);

            $jurusanIds = [];
            foreach ($item['jurusan_kodes'] as $kode) {
                if (isset($jurusans[$kode])) {
                    $jurusanIds[] = $jurusans[$kode]->id;
                }
            }

            if (! empty($jurusanIds)) {
                $m->jurusans()->sync($jurusanIds);
            }
        }
    }
}
