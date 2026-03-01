<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        $user = User::first() ?? User::factory()->create();

        if ($categories->isEmpty()) {
            $this->call(CategorySeeder::class);
            $categories = Category::all();
        }

        $articlesData = [
            [
                'title' => 'Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka',
                'excerpt' => 'Informasi lengkap mengenai jadwal, persyaratan, dan alur pendaftaran PPDB SMK Muhammadiyah Bligo.',
                'content' => '<p>Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2026/2027 di SMK Muhammadiyah Bligo telah resmi dibuka mulai hari ini. Berbagai program keahlian unggulan siap menyambut calon peserta didik yang memiliki minat dan bakat di bidang teknologi, bisnis, dan kesehatan.</p><p>Pendaftaran dapat dilakukan secara online melalui portal resmi kami atau datang langsung ke sekretariat pendaftaran. Jangan lewatkan kesempatan untuk bergabung bersama sekolah dengan fasilitas lengkap dan tenaga pengajar profesional.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Tim Robotik SMK Muh Bligo Sabet Juara 1 Tingkat Nasional',
                'excerpt' => 'Inovasi robot pemilah sampah otomatis membawa tim kami meraih kemenangan membanggakan.',
                'content' => '<p>Prestasi luar biasa kembali ditorehkan oleh siswa-siswi SMK Muhammadiyah Bligo. Tim Ekstrakurikuler Robotik berhasil menyabet Juara 1 pada ajang Kompetisi Robotik Tingkat Nasional yang diselenggarakan di Jakarta.</p><p>Dengan membawa karya inovatif berupa "Robot Pemilah Sampah Cerdas Berbasis AI", mereka mampu menyingkirkan ratusan peserta lainnya. Kepala Sekolah menyampaikan apresiasi setinggi-tingginya kepada para siswa dan guru pembimbing atas pencapaian ini.</p>',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'title' => 'Panduan Menyiapkan Diri Jelang Ujian Sertifikasi Kompetensi',
                'excerpt' => 'Simak tips dan trik terbaik agar lulus Ujian Sertifikasi Kompetensi (USK) dengan nilai memuaskan.',
                'content' => '<p>Ujian Sertifikasi Kompetensi (USK) merupakan momen penting bagi siswa kelas XII. Untuk itu, persiapan yang matang sangatlah diperlukan. Mulailah dengan membuat jadwal belajar yang rutin, memahami kisi-kisi ujian, dan memperbanyak latihan praktik di laboratorium.</p><p>Selain itu, menjaga kesehatan fisik dan mental juga penting. Jangan begadang di malam sebelum ujian dan perbanyak berdoa.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Jadwal Pengambilan Raport Semester Ganjil',
                'excerpt' => 'Informasi pengambilan raport yang akan dilaksanakan pekan depan.',
                'content' => '<p>Diberitahukan kepada seluruh orang tua / wali siswa bahwa pembagian raport semester ganjil akan dilaksanakan pada hari Sabtu pekan depan. Pengambilan raport dapat dilakukan oleh orang tua / wali secara bertahap sesuai jadwal yang telah ditentukan bagi masing-masing kelas.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Workshop Technopreneurship: Membangun Jiwa Pengusaha Digital',
                'excerpt' => 'Workshop untuk membekali siswa dengan kemampuan digital marketing dan bisnis online.',
                'content' => '<p>Dalam era digital saat ini, kemampuan technopreneurship sangat dibutuhkan. SMK Muhammadiyah Bligo bekerja sama dengan perusahaan teknologi nasional menyelenggarakan workshop technopreneurship. Acara ini diikuti oleh lebih dari 200 siswa.</p><p>Siswa diajarkan cara membuat model bisnis digital, memasarkan produk melalui media sosial, dan membuat portofolio yang menarik.</p>',
                'status' => 'archived',
            ],
            [
                'title' => 'Revolusi Industri 4.0 dan Dampaknya pada Pendidikan Vokasi',
                'excerpt' => 'Opini ahli tentang bagaimana pendidikan vokasi harus beradaptasi dengan teknologi baru.',
                'content' => '<p>Revolusi Industri 4.0 membawa perubahan masif dalam berbagai aspek, termasuk pendidikan vokasi. Kesiapan kurikulum dan fasilitas pendukung menjadi kunci agar lulusan SMK tetap relevan dengan kebutuhan industri. Kolaborasi antara sekolah dan dunia industri harus semakin digencarkan.</p>',
                'status' => 'draft',
            ],
            [
                'title' => 'Kunjungan Industri ke Pabrik Otomotif Terkemuka di Jawa Barat',
                'excerpt' => 'Siswa jurusan Teknik Kendaraan Ringan belajar langsung dari proses produksi modern.',
                'content' => '<p>Sebanyak 50 siswa jurusan Teknik Kendaraan Ringan mengikuti kegiatan Kunjungan Industri (KI) ke salah satu pabrik otomotif terbesar di Jawa Barat. Kegiatan ini bertujuan untuk memberikan gambaran nyata mengenai dunia kerja dan proses perakitan kendaraan dengan standar internasional.</p>',
                'status' => 'pending_review',
            ],
            [
                'title' => 'Peringatan Hari Guru Nasional Diwarnai Lomba Kreativitas Guru',
                'excerpt' => 'Merayakan dedikasi pahlawan tanpa tanda jasa dengan berbagai kompetisi seru.',
                'content' => '<p>Peringatan Hari Guru Nasional tahun ini di SMK Muhammadiyah Bligo berlangsung meriah. Berbagai perlombaan digelar khusus untuk para guru, mulai dari lomba memasak hingga kompetisi e-sports antar pengajar. Kegiatan ini bertujuan mempererat tali silaturahmi.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Alumni SMK Muhammadiyah Bligo Sukses Berkarier di Luar Negeri',
                'excerpt' => 'Kisah inspiratif alumni yang berhasil bekerja di perusahaan teknologi Jepang.',
                'content' => '<p>Kesuksesan tak mengenal batas geografis. Salah satu alumni terbaik kami dari jurusan Rekayasa Perangkat Lunak berhasil menembus kerasnya dunia kerja di Jepang. Saat ini, ia bekerja sebagai Senior Developer di perusahaan IT terkemuka di Tokyo. Ini membuktikan bahwa lulusan SMK mampu bersaing secara global.</p>',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'title' => 'Proyek Tugas Akhir: Pembuatan Sistem Smart Farming',
                'excerpt' => 'Kolaborasi siswa dari berbagai jurusan untuk menciptakan alat pertanian cerdas.',
                'content' => '<p>Sebagai tugas akhir, sekelompok siswa berhasil merancang sistem "Smart Farming" berbasis Internet of Things (IoT). Alat ini dapat menyiram tanaman secara otomatis berdasarkan sensor kelembapan dan dapat dikontrol langsung melalui smartphone.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Pengumuman Hari Libur Nasional Peringatan Isra Mi\'raj',
                'excerpt' => 'Informasi terkait kegiatan belajar mengajar selama hari libur nasional.',
                'content' => '<p>Terkait peringatan Isra Mi\'raj Nabi Muhammad SAW, kegiatan belajar mengajar akan diliburkan selama satu hari. Siswa dihimbau untuk tetap menjaga kesehatan dan mengikuti kegiatan keagamaan di daerah masing-masing.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Ekstrakurikuler Jurnalistik Hadirkan Buletin Sekolah Edisi Terbaru',
                'excerpt' => 'Edisi terbaru membahas isu kesehatan mental di kalangan pelajar.',
                'content' => '<p>Tim Jurnalistik SMK Muh Bligo baru saja menerbitkan edisi terbaru dari buletin sekolah. Tema utama kali ini berfokus pada pentingnya menjaga kesehatan mental bagi pelajar di tengah tuntutan akademik yang tinggi.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Rencana Pembangunan Gedung Laboratorium Komputer Terpadu',
                'excerpt' => 'Sekolah berencana menambah fasilitas laboratorium guna mendukung pembelajaran IT.',
                'content' => '<p>Untuk menjawab kebutuhan akan keterampilan digital, sekolah berencana membangun gedung laboratorium komputer terpadu yang baru. Fasilitas ini akan dilengkapi dengan perangkat berspesifikasi tinggi yang siap digunakan untuk kelas animasi, desain grafis, dan rekayasa perangkat lunak.</p>',
                'status' => 'pending_review',
            ],
            [
                'title' => 'Pentingnya Etika Digital Bermedia Sosial bagi Remaja',
                'excerpt' => 'Sosialisasi etika dalam bermain media sosial untuk mencegah cyberbullying.',
                'content' => '<p>Maraknya kasus cyberbullying di kalangan remaja menjadi perhatian khusus bagi guru Bimbingan Konseling. Oleh karena itu, diadakan sosialisasi mengenai etika digital agar siswa dapat menggunakan media sosial secara bijak dan positif.</p>',
                'status' => 'published',
            ],
            [
                'title' => 'Lomba Kompetensi Siswa (LKS) Tingkat Provinsi Segera Digelar',
                'excerpt' => 'Persiapan kontingen SMK Muh Bligo menghadapi LKS Provinsi.',
                'content' => '<p>Lomba Kompetensi Siswa (LKS) Tingkat Provinsi akan segera berlangsung bulan depan. Para delegasi sekolah dari berbagai kompetensi keahlian saat ini tengah menjalani pemusatan latihan intensif bersama guru pendamping.</p>',
                'status' => 'draft',
            ],
        ];

        foreach ($articlesData as $index => $data) {
            $cat = $categories->random();

            // Set request title so sluggable can use it
            request()->merge(['title' => $data['title']]);

            $article = Article::create([
                'user_id' => $user->id,
                'category_id' => $cat->id,
                'status' => $data['status'],
                'is_featured' => $data['is_featured'] ?? false,
                'view_count' => rand(10, 500),
                'published_at' => in_array($data['status'], ['published', 'archived']) ? now()->subDays(rand(1, 30)) : null,
            ]);

            // Default translation (ID)
            $article->translations()->create([
                'locale' => 'id',
                'title' => $data['title'],
                'excerpt' => $data['excerpt'],
                'content' => $data['content'],
                'reviewed' => true,
            ]);

            // English translation
            $article->translations()->create([
                'locale' => 'en',
                'title' => $data['title'] . ' (EN)',
                'excerpt' => $data['excerpt'] . ' (EN translation coming soon)',
                'content' => '<p>English translation is not available yet.</p>',
                'reviewed' => false,
            ]);

            // If sluggable failed to fetch title from request due to closure scope or anything, force update.
            if ($article->slug === 'untitled' || empty($article->slug)) {
                $article->slug = Str::slug($data['title']);
                $article->save();
            }
        }
    }
}
