<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqContohSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faqs = [
            [
                'kategori' => 'umum',
                'urutan' => 1,
                'is_active' => true,
                'id' => [
                    'pertanyaan' => 'Contoh – Apa visi dan misi utama SMK Muhammadiyah Bligo?',
                    'jawaban' => '<p>SMK Muhammadiyah Bligo berkomitmen mencetak lulusan yang berakhlak mulia, kompeten, berjiwa wirausaha, dan siap bersaing di dunia industri global berlandaskan nilai-nilai Islam berkemajuan.</p>',
                ],
                'en' => [
                    'pertanyaan' => 'What is the primary vision and mission of SMK Muhammadiyah Bligo?',
                    'jawaban' => '<p>SMK Muhammadiyah Bligo is committed to graduating noble-minded, competent, and entrepreneurial individuals prepared to compete in the global industry based on progressive Islamic values.</p>',
                ],
            ],
            [
                'kategori' => 'pendaftaran',
                'urutan' => 2,
                'is_active' => true,
                'id' => [
                    'pertanyaan' => 'Contoh – Bagaimana alur pendaftaran siswa baru (SPMB)?',
                    'jawaban' => '<p>Pendaftaran dapat dilakukan secara online melalui portal resmi SPMB atau langsung datang ke posko penerimaan di kampus SMK Muhammadiyah Bligo dengan membawa dokumen kelulusan SMP/MTs.</p>',
                ],
                'en' => [
                    'pertanyaan' => 'How is the new student admission process (SPMB)?',
                    'jawaban' => '<p>Registration can be done online through the official SPMB portal or in-person at the campus registration desk with junior high school completion documents.</p>',
                ],
            ],
            [
                'kategori' => 'akademik',
                'urutan' => 3,
                'is_active' => true,
                'id' => [
                    'pertanyaan' => 'Contoh – Apa saja program keahlian yang tersedia?',
                    'jawaban' => '<p>Kami membuka 5 konsentrasi keahlian unggulan: Teknik Komputer dan Jaringan (TKJ), Teknik Kendaraan Ringan (TKR), Teknik dan Bisnis Sepeda Motor (TBSM), Busana Butik, dan Akuntansi Keuangan Lembaga (AKL).</p>',
                ],
                'en' => [
                    'pertanyaan' => 'What vocational programs are available?',
                    'jawaban' => '<p>We offer 5 distinguished vocational programs: Computer and Network Engineering, Light Vehicle Engineering, Motorcycle Engineering, Fashion Design, and Accounting.</p>',
                ],
            ],
            [
                'kategori' => 'fasilitas',
                'urutan' => 4,
                'is_active' => true,
                'id' => [
                    'pertanyaan' => 'Contoh – Apakah sekolah menyediakan laboratorium dan bengkel praktik berstandar industri?',
                    'jawaban' => '<p>Ya, seluruh laboratorium komputer, bengkel otomotif, dan teaching factory busana telah disesuaikan dengan standar industri mitra kerja sama kami.</p>',
                ],
                'en' => [
                    'pertanyaan' => 'Does the school provide industry-standard laboratories and workshops?',
                    'jawaban' => '<p>Yes, all computer laboratories, automotive workshops, and fashion teaching factory comply with our industry partners standards.</p>',
                ],
            ],
        ];

        foreach ($faqs as $item) {
            /** @var Faq $faq */
            $faq = Faq::create([
                'kategori' => $item['kategori'],
                'urutan' => $item['urutan'],
                'is_active' => $item['is_active'],
            ]);

            $faq->translations()->create([
                'locale' => 'id',
                'pertanyaan' => $item['id']['pertanyaan'],
                'jawaban' => $item['id']['jawaban'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);

            $faq->translations()->create([
                'locale' => 'en',
                'pertanyaan' => $item['en']['pertanyaan'],
                'jawaban' => $item['en']['jawaban'],
                'ai_translated' => false,
                'reviewed' => true,
            ]);
        }
    }
}
