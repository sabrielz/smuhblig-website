# Changelog

Semua perubahan penting pada proyek Website Resmi dan CMS **SMK Muhammadiyah Bligo** didokumentasikan dalam berkas ini.
Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-11-18

Versi rilis stabil perdana **v1.0 Landing Page & CMS Lengkap** untuk SMK Muhammadiyah Bligo, Pekalongan, Jawa Tengah.

### Added
#### Phase 0: Fondasi & Kesiapan Proyek
- Konfigurasi runtime PHP 8.2+ / Laravel 12 dengan Inertia.js v2 dan React 19.
- Integrasi Tailwind CSS v4 dengan sistem token desain resmi (Primary Navy, Gold Prestige, Neutral).
- Pengaturan font Google Plus Jakarta Sans dan Playfair Display via fontswap lokal.
- Skrip verifikasi terpusat `npm run verify` (`scripts/verify.mjs`) menggabungkan Pint, PHPStan, ESLint, TypeScript check, dan Vitest.

#### Phase 1: Otentikasi, Hak Akses & Tata Kelola Admin
- Otentikasi CMS aman berbasis session guard dengan proteksi brute force rate limiting.
- Manajemen peran berbasis Spatie Permission: `admin`, `editor`, dan `author`.
- Autentikasi Dua Faktor (2FA TOTP) menggunakan Google Authenticator dengan generator recovery code.
- Layout Admin modern responsif: sidebar lipat, navigasi topbar, dan breadcrumb dinamis.
- Manajemen Profil Pengguna mandiri (sunting profil, ganti password, status 2FA).

#### Phase 2: Asisten AI Kepenulisan & Editor Kaya
- Editor konten visual berbasis TipTap dengan ekstensi Typography, Image, Link, Placeholder, dan Character Count.
- Asisten kepenulisan AI backend-driven (antrean antrean Laravel queue terisolasi):
  - Generate draf artikel dari topik dan poin penting.
  - Koreksi tata bahasa dan ejaan otomatis.
  - Revisi selektif teks melalui gelembung melayang (AiBubble).
  - Terjemahan dwibahasa otomatis Indonesia ↔ Inggris.
  - Panel analisis SEO dan saran keterbacaan instan.

#### Phase 3: Berita, Kategori, Tag & Galeri
- Manajemen artikel berita sekolah lengkap dengan kategori berwarna, tagging dinamis, dan riwayat revisi (maksimal 30 revisi per artikel).
- Fitur pratinjau (preview) draft sebelum publikasi.
- Alur persetujuan konten (Review Workflow): pengajuan `pending_review`, penerbitan `published`, atau pengembalian dengan catatan revisi editor.
- Pengumuman sekolah berjenjang (`info`, `penting`, `urgent`) dengan banner darurat di beranda.
- Agenda sekolah interaktif dengan generator unduhan kalender iCalendar (`.ics`).
- Galeri foto kegiatan per album dengan penampil Lightbox responsif dan gestur swipe.

#### Phase 4: Profil Sekolah & Jurusan
- Direktori Guru dan Tenaga Kependidikan dengan pengelompokan divisi dan filter program keahlian.
- Profil Sarana dan Prasarana (Fasilitas) sekolah dengan galeri foto multi-sudut.
- Profil Kegiatan Ekstrakurikuler (Hizbul Wathan, Tapak Suci, dll.).
- Halaman Dokumentasi Prestasi Siswa tingkat regional hingga nasional.
- Halaman 5 Program Keahlian (Jurusan Kejuruan) lengkap dengan kompetensi, prospek kerja, dan fasilitas bengkel.
- Antarmuka drag-and-drop sortable untuk penataan urutan profil.

#### Phase 5: Modul Informasi Publik
- Berkas Unduhan Resmi sekolah yang disimpan pada disk privat aman dengan pencatatan counter unduhan.
- Modul Tanya-Jawab Umum (FAQ) terstruktur per kategori.
- Carousel Testimoni alumni, orang tua siswa, dan mitra kerja.
- Manajemen Mitra Industri kerja sama SMK dengan logo strip di beranda dan halaman jurusan.
- Galeri Video resmi terintegrasi dengan pemutar video YouTube.
- Formulir Kontak publik dengan validasi ketat, notifikasi email otomatis ke admin, dan reCAPTCHA/rate limit.
- Fitur Pencarian Global lintas konten publik dengan penanda sorotan teks (highlight).

#### Phase 6: Analitik, Audit Log & Media
- Dashboard analitik terpersonalisasi per peran: grafik kunjungan harian per konten, metrik artikel, dan ringkasan pesan masuk.
- Pencatatan Kunjungan Harian agregat yang ramah privasi tanpa menyimpan data pribadi pengunjung.
- Pustaka Media mandiri dengan pemilih media (Media Picker) TipTap dan validasi wajib Alt Text maks 150 karakter (BR-031).
- Proteksi media terpakai agar tidak dapat terhapus jika masih dirujuk konten (BR-030).
- Audit Log Aktivitas seluruh mutasi model dan histori login pengguna dengan retensi otomatis 180 hari.

#### Phase 7: Dwibahasa, SEO, Performa & Aksesibilitas
- Fondasi dwibahasa publik penuh menggunakan `react-i18next` dengan sinkronisasi locale Inertia (302 pasangan kunci terverifikasi identik).
- Server-Side Rendering (SSR) via Inertia SSR (`resources/js/ssr.tsx`) untuk perayapan mesin pencari optimal.
- Skema JSON-LD terstruktur (`EducationalOrganization`, `NewsArticle`, `Event`, `FAQPage`, `BreadcrumbList`) pada seluruh halaman publik.
- Konversi otomatis seluruh gambar konten ke format WebP responsif (`thumb` 400w, `large` 1200w) serta atribut dimensi pencegah CLS.
- Tagged Cache publik dengan invalidasi otomatis saat data konten dimutasi (`PublicCacheObserver`).
- Refaktor modularisasi seluruh halaman besar menjadi komponen section rapi (< 300 baris per file halaman).
- Kepatuhan Aksesibilitas WCAG 2.1 AA: Skip link "Lewati ke konten", focus trap pada dialog/modal, label formulir aksesibel, dan `MotionConfig reducedMotion="user"`.
- Konfigurasi Lighthouse CI (`lighthouserc.json`) untuk pengujian berkelanjutan.

#### Phase 8: Rilis Produksi & Serah Terima
- Konfigurasi rilis siap pakai untuk stack Apache2, PHP-FPM 8.3, dan MySQL 8 (`utf8mb4_unicode_ci`).
- Skrip backup otomatis `deploy/backup/backup_db.sh` dan `deploy/backup/backup_storage.sh` tanpa kredensial literal.
- Perintah CLI `smk:lapor-job-gagal` untuk pemantauan antrean gagal berkala ke email admin.
- Perintah CLI `smk:cek-konten-contoh` untuk audit data dummy sebelum live produksi.
- Panduan Operasional Lengkap untuk operator sekolah (`PANDUAN_OPERATOR.md`).
