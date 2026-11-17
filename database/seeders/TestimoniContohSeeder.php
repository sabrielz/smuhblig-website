<?php

namespace Database\Seeders;

use App\Models\Testimoni;
use Illuminate\Database\Seeder;

class TestimoniContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimoni = [
            [
                'nama' => 'Contoh – Ahmad Fauzi, S.Kom.',
                'peran' => 'alumni',
                'keterangan' => 'Alumni TKJ 2021 • Network Engineer di PT Telkom Akses',
                'persetujuan_tampil' => true,
                'is_active' => true,
                'urutan' => 1,
                'id' => [
                    'kutipan' => 'SMK Muhammadiyah Bligo membekali saya dengan sertifikasi Mikrotik dan Cisco resmi serta kedisiplinan kerja islami yang membuat saya langsung diterima bekerja di perusahaan telekomunikasi terkemuka.',
                ],
                'en' => [
                    'kutipan' => 'SMK Muhammadiyah Bligo provided me with official network certifications and professional discipline that helped me get hired at a leading telecommunications company.',
                ],
            ],
            [
                'nama' => 'Contoh – Hj. Siti Masruroh, S.Pd.',
                'peran' => 'orang_tua',
                'keterangan' => 'Orang Tua dari Rizky (Siswa Kelas XII TKR)',
                'persetujuan_tampil' => true,
                'is_active' => true,
                'urutan' => 2,
                'id' => [
                    'kutipan' => 'Sebagai orang tua, saya sangat bangga menyekolahkan anak saya di SMK Muhammadiyah Bligo. Fasilitas bengkelnya lengkap dan pembinaan karakternya sangat intensif.',
                ],
                'en' => [
                    'kutipan' => 'As a parent, I am deeply proud to send my child to SMK Muhammadiyah Bligo. The workshop facilities are complete and character building is intensive.',
                ],
            ],
            [
                'nama' => 'Contoh – Budi Santoso, S.T.',
                'peran' => 'mitra',
                'keterangan' => 'HR & Training Manager PT Astra Honda Motor Pekalongan',
                'persetujuan_tampil' => true,
                'is_active' => true,
                'urutan' => 3,
                'id' => [
                    'kutipan' => 'Lulusan SMK Muhammadiyah Bligo selalu menjadi pilihan utama kami saat rekrutmen mekanik. Mereka kompeten, memiliki etos kerja tinggi, dan adaptif terhadap teknologi terbaru.',
                ],
                'en' => [
                    'kutipan' => 'Graduates of SMK Muhammadiyah Bligo are always our top pick during technician recruitments. They are competent and highly adaptive to the latest technology.',
                ],
            ],
        ];

        foreach ($testimoni as $item) {
            /** @var Testimoni $t */
            $t = Testimoni::create([
                'nama' => $item['nama'],
                'peran' => $item['peran'],
                'keterangan' => $item['keterangan'],
                'persetujuan_tampil' => $item['persetujuan_tampil'],
                'is_active' => $item['is_active'],
                'urutan' => $item['urutan'],
            ]);

            $t->translations()->create([
                'locale' => 'id',
                'kutipan' => $item['id']['kutipan'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            $t->translations()->create([
                'locale' => 'en',
                'kutipan' => $item['en']['kutipan'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);
        }
    }
}
