<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HalamanKontenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $konten = [
            // Beranda - Hero
            [
                'halaman' => 'beranda',
                'section' => 'hero',
                'key' => 'eyebrow',
                'type' => 'text',
                'label' => 'Teks Kecil Atas Hero',
                'value_id' => 'SMK MUHAMMADIYAH BLIGO',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'hero',
                'key' => 'headline',
                'type' => 'textarea',
                'label' => 'Headline Utama',
                'value_id' => 'Mencetak Generasi Unggul dan Berakhlak Mulia',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'hero',
                'key' => 'subheadline',
                'type' => 'textarea',
                'label' => 'Kalimat Pendukung',
                'value_id' => 'Sekolah Menengah Kejuruan berbasis nilai Islam, menyiapkan lulusan siap kerja, berkarakter, dan berdaya saing global.',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'hero',
                'key' => 'cta_primer_label',
                'type' => 'text',
                'label' => 'Tombol CTA Utama',
                'value_id' => 'Daftar Sekarang',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'hero',
                'key' => 'cta_sekunder_label',
                'type' => 'text',
                'label' => 'Tombol CTA Kedua',
                'value_id' => 'Lihat Jurusan',
            ],

            // Beranda - Statistik
            [
                'halaman' => 'beranda',
                'section' => 'statistik',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Section Statistik',
                'value_id' => 'Dalam Angka',
            ],

            // Beranda - Jurusan
            [
                'halaman' => 'beranda',
                'section' => 'jurusan',
                'key' => 'label',
                'type' => 'text',
                'label' => 'Eyebrow',
                'value_id' => 'PROGRAM KEAHLIAN',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'jurusan',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Section',
                'value_id' => 'Lima Jurusan, Satu Visi',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'jurusan',
                'key' => 'subheadline',
                'type' => 'textarea',
                'label' => 'Deskripsi',
                'value_id' => '',
            ],

            // Beranda - Berita
            [
                'halaman' => 'beranda',
                'section' => 'berita',
                'key' => 'label',
                'type' => 'text',
                'label' => 'Eyebrow',
                'value_id' => 'BERITA & INFORMASI',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'berita',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Section',
                'value_id' => 'Kabar Terkini dari SMK Muhammadiyah Bligo',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'berita',
                'key' => 'cta_label',
                'type' => 'text',
                'label' => 'Teks Tombol',
                'value_id' => 'Lihat Semua Berita',
            ],

            // Beranda - CTA Akhir
            [
                'halaman' => 'beranda',
                'section' => 'cta_akhir',
                'key' => 'headline',
                'type' => 'textarea',
                'label' => 'Judul CTA',
                'value_id' => 'Siap Bergabung Bersama Kami?',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'cta_akhir',
                'key' => 'subheadline',
                'type' => 'textarea',
                'label' => 'Kalimat CTA',
                'value_id' => 'Daftarkan putra-putri Anda sekarang dan jadilah bagian dari keluarga besar SMK Muhammadiyah Bligo.',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'cta_akhir',
                'key' => 'cta_label',
                'type' => 'text',
                'label' => 'Teks Tombol Utama',
                'value_id' => 'Mulai Pendaftaran',
            ],
            [
                'halaman' => 'beranda',
                'section' => 'cta_akhir',
                'key' => 'cta_sekunder_label',
                'type' => 'text',
                'label' => 'Teks Tombol Kedua',
                'value_id' => 'Pelajari Lebih Lanjut',
            ],

            // Tentang - Hero
            [
                'halaman' => 'tentang',
                'section' => 'hero',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Hero',
                'value_id' => 'Sejarah, Visi, dan Misi Kami',
            ],

            // Tentang - Profil
            [
                'halaman' => 'tentang',
                'section' => 'profil',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Section',
                'value_id' => 'Tentang SMK Muhammadiyah Bligo',
            ],
            [
                'halaman' => 'tentang',
                'section' => 'profil',
                'key' => 'konten',
                'type' => 'richtext',
                'label' => 'Konten Profil',
                'value_id' => '<p>SMK Muhammadiyah Bligo adalah sekolah menengah kejuruan yang berdiri di bawah naungan Persyarikatan Muhammadiyah...</p>',
            ],

            // Tentang - Visi Misi
            [
                'halaman' => 'tentang',
                'section' => 'visi_misi',
                'key' => 'visi',
                'type' => 'richtext',
                'label' => 'Teks Visi',
                'value_id' => 'Menjadi SMK unggulan yang menghasilkan lulusan berakhlak mulia, kompeten, dan berdaya saing.',
            ],
            [
                'halaman' => 'tentang',
                'section' => 'visi_misi',
                'key' => 'misi',
                'type' => 'richtext',
                'label' => 'Teks Misi',
                'value_id' => '<ul><li>Menyelenggarakan pendidikan berbasis nilai-nilai Islam</li><li>Mengembangkan kompetensi kejuruan sesuai kebutuhan industri</li><li>Membentuk karakter Islami yang tangguh dan berintegritas</li><li>Menjalin kemitraan dengan dunia usaha dan industri</li><li>Menciptakan lingkungan belajar yang kondusif dan inovatif</li></ul>',
            ],

            // Tentang - Nilai
            [
                'halaman' => 'tentang',
                'section' => 'nilai',
                'key' => 'headline',
                'type' => 'text',
                'label' => 'Judul Section Nilai',
                'value_id' => 'Nilai-Nilai Muhammadiyah',
            ],

            // Kontak - Info
            [
                'halaman' => 'kontak',
                'section' => 'info',
                'key' => 'jam_operasional',
                'type' => 'textarea',
                'label' => 'Jam Operasional',
                'value_id' => "Senin–Jumat: 07.00–15.00 WIB\nSabtu: 07.00–12.00 WIB",
            ],
            [
                'halaman' => 'kontak',
                'section' => 'info',
                'key' => 'maps_embed_url',
                'type' => 'url',
                'label' => 'URL Google Maps Embed',
                'value_id' => '',
            ],
        ];

        foreach ($konten as $item) {
            $value_id = $item['value_id'];
            unset($item['value_id']);

            $halamanKonten = \App\Models\HalamanKonten::updateOrCreate(
                [
                    'halaman' => $item['halaman'],
                    'section' => $item['section'],
                    'key' => $item['key'],
                ],
                $item
            );

            $halamanKonten->translations()->updateOrCreate(
                ['locale' => 'id'],
                ['value' => $value_id]
            );
        }
    }
}
