# Panduan Operator CMS — SMK Muhammadiyah Bligo

Selamat datang di Buku Panduan Resmi Pengelolaan Situs Web dan Content Management System (CMS) SMK Muhammadiyah Bligo. Panduan ini dirancang untuk memudahkan staf sekolah, guru pembina, dan admin dalam mempublikasikan informasi secara akurat, modern, dan aman.

---

## 1. Akses Masuk & Keamanan Dua Faktor (2FA)

### 1.1 Login ke CMS
1. Buka tautan peramban: `https://smkmuhbligo.sch.id/admin/login`
2. Masukkan alamat email sekolah dan kata sandi Anda.
3. Klik tombol **Masuk**.

> [Screenshot: Form Login CMS Admin]

---

### 1.2 Autentikasi Dua Faktor (2FA TOTP)
Seluruh akun dengan peran **Admin** wajib mengaktifkan autentikasi dua faktor, dan sangat disarankan untuk peran **Editor** serta **Author**.

1. Masuk ke menu **Profil Saya** > **Keamanan Akun (2FA)**.
2. Buka aplikasi authenticator di ponsel Anda (Google Authenticator, Microsoft Authenticator, atau 2FAS).
3. Pindai kode QR yang tampil di layar atau salin kode rahasia manual.
4. Masukkan 6 digit angka kode verifikasi dari aplikasi authenticator.
5. Simpan 8 **Kode Pemulihan (Recovery Codes)** di tempat yang aman (misalnya buku catatan fisik atau password manager). Kode ini adalah satu-satunya cara masuk bila ponsel Anda hilang.

> [Screenshot: Halaman Pengaturan dan Aktivasi 2FA TOTP]

---

### 1.3 Prosedur Reset 2FA oleh Admin
Bila staf atau editor kehilangan ponsel dan kehabisan kode pemulihan:
1. Hubungi pengguna dengan peran **Admin**.
2. Admin membuka menu **Manajemen Pengguna** (`/admin/pengguna`).
3. Temukan nama pengguna yang bersangkutan, klik opsi **Reset 2FA**.
4. Sistem akan menonaktifkan 2FA pada akun tersebut sehingga pengguna dapat login kembali dan melakukan konfigurasi ulang 2FA.

---

## 2. Pengelolaan Artikel & Berita Sekolah

### 2.1 Alur Publikasi & Peran Pengguna
Sistem menerapkan alur persetujuan konten (Review Workflow) untuk menjaga kualitas informasi:
- **Author (Penulis):** Menulis artikel dalam status `draft`, lalu mengajukan review menjadi `pending_review`.
- **Editor:** Memeriksa artikel pending review. Editor dapat mempublikasikan (`published`), menyunting perbaikan, atau mengembalikan ke Author dengan menyertakan catatan koreksi.
- **Admin:** Memiliki kewenangan penuh menyunting, menyetujui, dan mengarsipkan artikel.

> [Screenshot: Alur Review Artikel dan Banner Catatan Review]

---

### 2.2 Menulis Artikel Baru
1. Buka menu **Artikel** > **Tulis Artikel Baru**.
2. **Tab Indonesia (ID):**
   - Masukkan **Judul Artikel**.
   - Masukkan **Ringkasan (Excerpt)** singkat (1–2 kalimat yang tampil di kartu berita).
   - Tulis isi artikel menggunakan **Editor TipTap**. Gunakan heading, bold, list, dan kutipan sesuai kebutuhan.
3. **Tab English (EN):**
   - Bila fitur dwibahasa aktif, klik tombol **✦ Terjemahkan dengan AI** untuk menerjemahkan otomatis judul, ringkasan, dan konten ke Bahasa Inggris, atau isi manual.
4. **Kolom Samping (Sidebar):**
   - Pilih **Status** (Draft / Pending Review / Published).
   - Tentukan **Kategori** dan ketik **Tag Artikel** (tekan Enter untuk menambah tag).
   - Unggah **Thumbnail Berita** (rasio 16:9 disarankan, maks 2MB).
   - Isi metadata **SEO** (Meta Title & Meta Description) dan gunakan tombol **Analisis SEO** untuk rekomendasi perbaikan instan.

> [Screenshot: Form Editor Artikel Dua Bahasa dan Sidebar SEO]

---

### 2.3 Pratinjau (Preview) Draft
Sebelum artikel berstatus `published` dilihat publik, klik tombol **Pratinjau** di pojok kanan atas. Sistem akan membuka tab baru menampilkan tampilan persis seperti halaman berita publik bagi pengunjung.

---

### 2.4 Riwayat Revisi Artikel
Setiap kali artikel disimpan, sistem mencatat snapshot riwayat revisi (maksimal 30 revisi terakhir).
1. Buka menu edit artikel.
2. Pada panel **Riwayat Revisi** di kolom kanan bawah, pilih riwayat berdasarkan tanggal dan penulis.
3. Anda dapat membandingkan perbedaan teks kata demi kata dan menekan tombol **Pulihkan Versi Ini** jika diperlukan.

> [Screenshot: Panel Perbandingan Riwayat Revisi Artikel]

---

## 3. Pustaka Media & Aturan Gambar (Alt Text)

1. Buka menu **Pustaka Media** (`/admin/media`).
2. Setiap kali mengunggah gambar baru, Anda **wajib** mengisi **Alt Text** (Deskripsi Gambar untuk aksesibilitas tunanetra dan SEO) maksimal 150 karakter.
3. **Perlindungan Media:** Gambar yang sedang digunakan sebagai cover artikel, album galeri, atau profil fasilitas **tidak dapat dihapus** dari pustaka media sebelum tautan penggunaannya diganti.

> [Screenshot: Modal Unggah Media dengan Input Alt Text Wajib]

---

## 4. Pengelolaan Modul Informasi

### 4.1 Pengumuman Sekolah
- Masuk ke menu **Pengumuman**.
- Tentukan tipe pengumuman:
  - `info`: Informasi umum.
  - `penting`: Informasi penting berkala.
  - `urgent`: Pengumuman darurat — **otomatis memunculkan banner peringatan merah di puncak Beranda publik**.
- Tentukan tanggal berakhir agar pengumuman kadaluwarsa tidak terus tayang.

### 4.2 Agenda Kegiatan
- Masuk ke menu **Agenda**.
- Masukkan nama agenda, rentang waktu mulai dan selesai, serta lokasi.
- Pengunjung publik dapat mengunduh berkas kalender `.ics` untuk langsung disimpan ke Google Calendar atau smartphone.

### 4.3 Galeri Foto
- Masuk ke menu **Galeri**.
- Buat album foto, lalu unggah foto-foto kegiatan (mendukung multi-upload).
- Foto dapat diatur ulang urutannya dan pengunjung dapat melihatnya via Lightbox interaktif.

### 4.4 Berkas Unduhan
- Masuk ke menu **Unduhan**.
- Unggah berkas dokumen resmi sekolah (misal: Brosur, Kalender Akademik, Formulir PDF).
- Berkas disimpan di disk privat yang aman dan dihitung jumlah unduhannya setiap kali diakses publik.

### 4.5 FAQ & Testimoni
- **FAQ:** Masukkan tanya-jawab umum yang dikelompokkan per kategori.
- **Testimoni:** Catat testimoni dari alumni, orang tua, atau mitra industri. Pastikan mencentang "Persetujuan Tampil" agar tayang di Beranda.

### 4.6 Mitra Industri & Galeri Video
- **Mitra:** Kelola logo kerja sama industri dan hubungkan dengan program keahlian/jurusan terkait.
- **Video:** Masukkan ID video YouTube resmi sekolah untuk ditampilkan di galeri video publik.

---

## 5. Pengelolaan Profil Sekolah

- **Guru & Tenaga Kependidikan:** Pengelolaan direktori pendidik, NIP, mata pelajaran/jabatan, divisi (Pimpinan, Guru Normatif/Adaptif, Guru Produktif, Tenaga Kependidikan). Mendukung drag-and-drop urutan tampilan.
- **Fasilitas:** Pengelolaan bengkel praktik, laboratorium, sarana ibadah, dan gedung belajar lengkap dengan galeri foto sarpras.
- **Ekstrakurikuler:** Pengelolaan daftar kegiatan bakat minat siswa (Hizbul Wathan, Tapak Suci, Olahraga, Kesenian, Sains).
- **Prestasi Siswa:** Dokumentasi kejuaraan akademik dan non-akademik tingkat Kabupaten, Provinsi, hingga Nasional.

> [Screenshot: Antarmuka Urutan Drag and Drop Guru dan Tenaga Kependidikan]

---

## 6. Pengaturan Situs Web (Admin Only)

Halaman **Pengaturan** (`/admin/pengaturan`) mengatur parameter global:
- **Identitas Sekolah:** Nama, alamat, nomor telepon, email resmi, dan media sosial.
- **Tautan SPMB / PPDB:** Mengatur URL tujuan pendaftaran peserta didik baru (mengarah ke sistem SPMB eksternal).
- **Toggle Fitur:**
  - `artikel_ai_enabled`: Mengaktifkan/menonaktifkan asisten kepenulisan AI.
  - `multibahasa_enabled`: Mengaktifkan/menonaktifkan bahasa Inggris di situs publik.
  - `ai_translate_auto`: Auto-translate saat artikel dipublikasi.
  - `artikel_approval`: Mengaktifkan/menonaktifkan alur approval pending review.

---

## 7. Batas Cakupan: Apa yang TIDAK Ada di Situs Ini?

Situs web ini berfokus sebagai **Media Informasi Resmi dan Pemasaran Sekolah**. Demi keamanan dan fokus sistem, fitur-fitur berikut **tidak disediakan di web ini dan dialihkan ke Portal Sekolah**:
1. **Sistem PPDB Mandiri:** Form pendaftaran siswa baru berada di sistem SPMB terpisah (klik tombol Daftar SPMB).
2. **Akademik & E-Rapor:** Nilai siswa, rapor, dan presensi harian dikelola pada sistem LMS / Dapodik internal.
3. **Sistem Keuangan / Pembayaran SPP:** Pembayaran sekolah tidak dilayani melalui web ini.
4. **Bursa Kerja Khusus (BKK) / Lowongan Kerja:** Dikelola pada portal BKK mandiri.
5. **Akun Siswa/Wali Murid:** Situs ini tidak menyediakan registrasi atau login untuk umum.

Jika ada pengunjung yang menanyakan hal-hal di atas, arahkan mereka ke menu **Portal Tautan Cepat** (`/portal`) atau hubungi Tata Usaha sekolah.
