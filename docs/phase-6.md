# Phase 6 — CMS Lanjutan untuk Operator

> Rangkaian `docs/phase-0.md` … `docs/phase-8.md`. Kerjakan sesi berurutan.

---

## Global Directives (wajib)

1. **AGENTS.md §0 menang.** Dilarang menulis/menjalankan test PHP. Boleh: Pint, PHPStan, ESLint, `tsc`, `npx vitest run`.
2. **Continuous Coding First** — tulis semua perubahan dulu; jangan lint per file.
3. **Single-Pass End Verification** — `npm run verify` sekali di akhir sesi.
4. **One-Liner Execution** — `npm run verify && git add -A && git commit -m "..."`.
5. **Zero Scope Creep** — tanpa riset web bila pola lokal ada, tanpa worktree, tanpa push/PR. Temuan lain → laporan.
6. **Anti-halusinasi** — baca file/migrasi/rute/tipe terkait sebelum mengubah. Untuk paket baru, baca kode sumbernya di `vendor/` (versi dari `composer.lock`) sebelum memakai API-nya. Bila kode berbeda dari instruksi → berhenti & laporkan.
7. **Integritas** — migrasi baru saja; FormRequest, Resource, Policy; `HtmlSanitizer`; tanpa `any`/`@ts-ignore`/hex JSX/inline style/TODO.
8. **Dependensi baru** hanya yang disetujui di ADR-007 & ADR-008 (Sesi 6-00).
9. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** CMS nyaman & aman untuk banyak operator: pustaka media, log aktivitas, riwayat revisi, 2FA, analitik, dashboard per peran, notifikasi alur review.
- **Syarat awal:** DoD Phase 5 lulus; ADR-007 (log aktivitas) & ADR-008 (2FA) disetujui; BR-030 (aturan media terpakai) tertulis.
- **Kondisi awal:** gambar tersebar per modul; tanpa jejak aktivitas & revisi; login admin hanya password; dashboard sama untuk semua peran; `view_count` dikumpulkan tetapi tidak divisualisasikan; tidak ada catatan alasan saat artikel dikembalikan.
- **Kondisi akhir:** pustaka media + alt text wajib; log aktivitas (filter + retensi 180 hari); revisi artikel bisa dipulihkan; 2FA TOTP (wajib Admin); analitik harian; dashboard per peran; notifikasi pengajuan/publish/kembalikan.
- **Di luar cakupan phase:** analitik pihak ketiga baru; alur persetujuan selain artikel.

### DoD Phase 6
- [ ] Media terpakai (BR-030) tidak bisa dihapus (dicek di controller).
- [ ] Setiap model konten memakai log aktivitas; perintah pembersihan terjadwal di `routes/console.php`.
- [ ] Revisi artikel tersimpan di setiap `update` dan bisa dipulihkan.
- [ ] Admin tanpa 2FA dialihkan ke halaman aktivasi sebelum memakai CMS.
- [ ] Dashboard berbeda per peran; vitest `lib/diff.ts` & `MiniBarChart` lulus.
- [ ] `npm run verify` lulus; `npm run build` sukses.

---

## [Sesi 6-00] - ADR Dependensi & Aturan Media [MANUAL PEMILIK]
- **Scope:** AGENTS.md §17 & §18.
- **Implementation:**
  1. Agent menulis sebagai *menunggu persetujuan*, lalu berhenti:
     - `ADR-007 Log aktivitas`: usulan `spatie/laravel-activitylog` (alternatif: tabel `activity_logs` buatan sendiri).
     - `ADR-008 2FA`: usulan `pragmarx/google2fa` + `bacon/bacon-qr-code` (alternatif: `laravel/fortify` — lebih besar).
     - `BR-030 Media terpakai`: media dianggap terpakai bila (a) melekat pada model yang masih ada di collection selain unggahan inline editor, atau (b) URL-nya muncul di konten HTML artikel/pengumuman/agenda/konten halaman/FAQ. Hanya media tidak terpakai yang boleh dihapus.
     - `BR-031 Alt text`: wajib untuk setiap gambar konten baru, maks 150 karakter.
  2. Setelah pemilik menjawab, ubah status menjadi *disetujui*.
- **Finish & Commit (Run at End):**
  `git add AGENTS.md && git commit -m "docs(agents): ADR log aktivitas, 2FA, aturan media"`
- **DoD:** ADR-007, ADR-008, BR-030, BR-031 disetujui.

## [Sesi 6-01] - Pustaka Media: Backend
- **Scope:** `app/Http/Controllers/Admin/MediaController.php` (baru), `app/Support/MediaUsage.php` (baru), Requests (`UpdateMediaRequest`), `Resources/Admin/MediaResource.php`, rute `admin.media.*`, `MediaUploadController.php` (baca untuk tahu model penampung unggahan inline).
- **Implementation:**
  1. `index`: paginate model `Spatie\MediaLibrary\MediaCollections\Models\Media`, filter `mime_type` (gambar/dokumen), `model_type`, cari nama; 24 per halaman.
  2. `update`: simpan `alt` di `custom_properties`.
  3. `MediaUsage::isUsed(Media $m): bool` sesuai BR-030 (query `LIKE` URL pada kolom konten translasi terkait).
  4. `destroy`: tolak bila `isUsed`. Akses: Editor & Admin.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(media): backend pustaka media"`
- **DoD:** destroy memanggil `MediaUsage::isUsed`.

## [Sesi 6-02] - Pustaka Media: Halaman & Picker TipTap
- **Scope:** `Pages/Admin/Media/Index.tsx` (baru), `Components/Editor/MediaPicker.tsx` (baru), `Components/Editor/TipTapEditor.tsx`, `AdminSidebar.tsx`, tipe.
- **Implementation:**
  1. Index: grid thumbnail, filter, panel detail (alt, URL, ukuran, model pemilik), hapus (nonaktif + keterangan bila terpakai).
  2. MediaPicker: Modal berisi grid gambar dengan pencarian; dipakai tombol "Dari pustaka" di toolbar TipTap untuk menyisipkan gambar beserta `alt`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(media): halaman pustaka media dan picker editor"`
- **DoD:** gambar yang disisipkan dari pustaka membawa `alt`.

## [Sesi 6-03] - Alt Text Wajib (BR-031)
- **Scope:** `UploadMediaRequest.php`, `Components/UI/ImageUpload.tsx`, form yang memakai ImageUpload untuk konten publik (artikel, galeri, fasilitas, prestasi, guru, mitra, testimoni), controller penyimpan media terkait.
- **Implementation:** field `alt` di samping setiap unggahan gambar konten; validasi `required|string|max:150`; disimpan via `withCustomProperties(['alt' => ...])`; halaman publik memakai `alt` dari media dengan fallback judul konten.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(a11y): alt text wajib untuk gambar konten"`
- **DoD:** setiap unggahan gambar konten memvalidasi `alt`.

## [Sesi 6-04] - Log Aktivitas: Pasang & Catat
- **Scope:** `composer.json`/`composer.lock`, `config/activitylog.php`, migrasi paket, model konten (Article, Galeri, Pengumuman, Agenda, Jurusan, HalamanKonten, Category, Tautan, Statistik, StrukturOrganisasi, User, Guru, Fasilitas, Ekstrakurikuler, Prestasi, Unduhan, Faq, Testimoni, Mitra, Video, Pengaturan), `app/Listeners/CatatLogin.php`.
- **Implementation:**
  1. Pasang paket sesuai ADR-007; publish config & migrasi sesuai dokumentasi di `vendor/spatie/laravel-activitylog` (baca README/stub di vendor).
  2. Tambah trait `LogsActivity` + `getActivitylogOptions()` (`logFillable()->logOnlyDirty()->dontSubmitEmptyLogs()`); jangan mencatat kolom rahasia (`password`, `email_password`, `two_factor_*`).
  3. Listener event `Illuminate\Auth\Events\Login` & `Failed` mencatat login berhasil/gagal (tanpa password).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(log): pasang log aktivitas pada model konten dan login"`
- **DoD:** tidak ada kolom rahasia yang dicatat.

## [Sesi 6-05] - Log Aktivitas: Halaman & Retensi
- **Scope:** `Admin/AktivitasController.php`, rute `admin.aktivitas.index` (admin only), `Pages/Admin/Aktivitas/Index.tsx`, `AdminSidebar.tsx`, `routes/console.php`, `config/activitylog.php`.
- **Implementation:** tabel (waktu, pengguna, aksi, modul, ringkasan perubahan) + filter pengguna/modul/rentang tanggal; retensi `delete_records_older_than_days = 180` dan `Schedule::command('activitylog:clean')->dailyAt('02:30')` (cek nama perintah di vendor).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(log): halaman log aktivitas dan retensi 180 hari"`
- **DoD:** jadwal pembersihan terdaftar.

## [Sesi 6-06] - Revisi Artikel: Backend
- **Scope:** migrasi `create_article_revisions_table`, `Models/ArticleRevision.php`, `ArtikelController.php` (`update`, `restoreRevision`), rute `admin.artikel.revisi.restore`, `ArtikelResource.php`.
- **Implementation:**
  1. Tabel: `article_id` (cascade), `user_id` (nullOnDelete), `snapshot` (json: status, category_id, meta_title, meta_description, translations[locale → title, excerpt, content], tags), `created_at`/`updated_at`.
  2. Sebelum `update` mengubah data, simpan snapshot kondisi lama (dalam transaksi yang sama). Simpan maks 30 revisi per artikel (hapus tertua).
  3. `restoreRevision`: Policy `update`; terapkan snapshot (konten tetap lewat `HtmlSanitizer`), lalu catat revisi baru dari kondisi sebelum restore.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(revisi): simpan dan pulihkan revisi artikel"`
- **DoD:** batas 30 revisi diterapkan.

## [Sesi 6-07] - Revisi Artikel: UI & Diff
- **Scope:** `resources/js/lib/diff.ts` (baru) + `diff.test.ts`, `Components/Admin/RevisionPanel.tsx` (baru), `Pages/Admin/Artikel/Form.tsx`.
- **Implementation:**
  1. `diff.ts`: diff per baris berbasis LCS untuk teks polos (strip tag HTML dulu); hasil `{ type: 'same'|'add'|'del', text }[]`. Vitest: identik, tambah, hapus, ubah.
  2. RevisionPanel: daftar revisi (waktu, pengguna), lihat perbedaan terhadap versi sekarang, tombol "Pulihkan" dengan `ConfirmDialog`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(revisi): panel revisi dan tampilan perbedaan"`
- **DoD:** vitest diff lulus.

## [Sesi 6-08] - 2FA: Backend
- **Scope:** `composer.json`/`composer.lock`, migrasi `add_two_factor_columns_to_users_table`, `Models/User.php`, `Admin/TwoFactorController.php`, `Auth/TwoFactorChallengeController.php`, `LoginController.php`, `Middleware/EnsureTwoFactorEnabled.php`, `routes/web.php`, `bootstrap/app.php`.
- **Implementation:**
  1. Kolom: `two_factor_secret` (text, nullable), `two_factor_recovery_codes` (text, nullable), `two_factor_confirmed_at` (timestamp, nullable). Cast `encrypted` / `encrypted:array`; tambahkan ke `$hidden`.
  2. TwoFactorController: `enable` (buat secret, QR SVG), `confirm` (kode OTP valid → set `confirmed_at`, buat 8 kode pemulihan), `disable` (wajib password), `regenerateRecoveryCodes`.
  3. Login: bila user punya 2FA terkonfirmasi → simpan id di session, logout sementara, arahkan ke `two-factor.challenge`; challenge menerima OTP atau kode pemulihan (sekali pakai), throttle `5,1`.
  4. `EnsureTwoFactorEnabled` di grup admin: Admin tanpa 2FA dialihkan ke `admin.profil.edit#2fa` (kecuali rute 2FA & logout).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(2fa): backend totp, kode pemulihan, wajib untuk admin"`
- **DoD:** secret & kode pemulihan terenkripsi dan tersembunyi dari serialisasi.

## [Sesi 6-09] - 2FA: Halaman
- **Scope:** `Pages/Admin/Profil/Edit.tsx`, `Pages/Auth/TwoFactorChallenge.tsx` (baru), tipe.
- **Implementation:** kartu 2FA di Profil (status, QR, input kode konfirmasi, kode pemulihan sekali tampil + tombol salin, nonaktifkan dengan password); halaman challenge (input OTP 6 digit, tautan "pakai kode pemulihan"). Gaya mengikuti `Auth/Login.tsx`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(2fa): halaman aktivasi dan challenge"`
- **DoD:** tsc lulus.

## [Sesi 6-10] - Analitik Harian
- **Scope:** migrasi `create_kunjungan_harian_table`, `Models/KunjunganHarian.php`, `app/Jobs/IncrementArticleViewCount.php`, controller publik detail (Berita, Pengumuman, Agenda, Galeri), `app/Jobs/CatatKunjungan.php` (baru).
- **Implementation:**
  1. Tabel: `tanggal` (date), `konten_type` (string), `konten_id` (unsignedBigInteger), `jumlah` (unsignedInteger); unique `[tanggal, konten_type, konten_id]`.
  2. Job `CatatKunjungan` melakukan upsert `jumlah + 1`; dipanggil di detail konten publik. `IncrementArticleViewCount` tetap memperbarui `view_count`.
  3. Abaikan permintaan dari pengguna yang sedang login CMS dan user-agent bot umum (daftar sederhana di config).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(analitik): catat kunjungan harian per konten"`
- **DoD:** upsert memakai unique key (tanpa race duplikat).

## [Sesi 6-11] - Dashboard per Peran
- **Scope:** `DashboardController.php`, `Pages/Admin/Dashboard.tsx`, `Components/Admin/MiniBarChart.tsx` (baru) + `MiniBarChart.test.tsx`.
- **Implementation:**
  1. Author: artikel miliknya per status + 5 terbaru dengan status review. Editor: antrean `pending_review`, pengumuman aktif, pesan baru. Admin: semua di atas + kunjungan 30 hari, 5 konten terpopuler, AI job terbaru.
  2. MiniBarChart: SVG murni (tanpa library baru), sumbu nol, label nilai tertinggi, warna dari token; `role="img"` + `aria-label`. Vitest: jumlah batang = jumlah data, data kosong menampilkan teks kosong.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(dashboard): dashboard per peran dan grafik kunjungan"`
- **DoD:** vitest MiniBarChart lulus.

## [Sesi 6-12] - Notifikasi Alur Review
- **Scope:** migrasi `add_catatan_review_to_articles_table`, `ArtikelController.php` (`kembalikan`), `Requests/Admin/KembalikanArtikelRequest.php`, rute `admin.artikel.kembalikan`, `app/Observers/ArticleObserver.php`, `app/Services/NotifikasiService.php` (baca), `Pages/Admin/Artikel/Index.tsx` & `Form.tsx`.
- **Implementation:**
  1. Kolom `catatan_review` (text, nullable). Aksi `kembalikan` (Editor/Admin): status → `draft`, isi catatan wajib (maks 1000).
  2. Observer (baca perilaku yang sudah ada dulu, jangan menggandakan notifikasi): `→ pending_review` = notifikasi ke Editor & Admin; `pending_review → published` = ke penulis; `kembalikan` = ke penulis beserta catatan.
  3. Form artikel menampilkan catatan review terakhir untuk penulis.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(review): kembalikan artikel dengan catatan dan notifikasi alur"`
- **DoD:** tidak ada notifikasi ganda untuk satu perubahan status.

## [Sesi 6-13] - Penutup Phase 6
- **Scope:** `AGENTS.md` (§2 stack, §4, §5, §9), `README.md`, `public/build`.
- **Implementation:** dokumentasikan paket baru, rute, model, aturan 2FA; `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-6): perbarui dokumentasi dan build aset"`
- **DoD:** semua checklist DoD Phase 6 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 6-00 | ADR dependensi & aturan media (manual) |
| 6-01 – 6-03 | Pustaka media & alt text |
| 6-04 – 6-05 | Log aktivitas |
| 6-06 – 6-07 | Revisi artikel |
| 6-08 – 6-09 | 2FA |
| 6-10 | Analitik harian |
| 6-11 | Dashboard per peran |
| 6-12 | Notifikasi alur review |
| 6-13 | Penutup phase |
