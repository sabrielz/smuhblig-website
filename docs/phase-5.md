# Phase 5 — Modul Informasi & Kepercayaan

> Rangkaian `docs/phase-0.md` … `docs/phase-8.md`. Kerjakan sesi berurutan.

---

## Global Directives (wajib)

1. **AGENTS.md §0 menang.** Dilarang menulis/menjalankan test PHP. Boleh: Pint, PHPStan, ESLint, `tsc`, `npx vitest run`.
2. **Continuous Coding First** — tulis semua perubahan dulu; jangan lint per file.
3. **Single-Pass End Verification** — `npm run verify` sekali di akhir sesi.
4. **One-Liner Execution** — `npm run verify && git add -A && git commit -m "..."`.
5. **Zero Scope Creep** — tanpa riset web bila pola lokal ada, tanpa worktree, tanpa push/PR. Temuan lain → laporan.
6. **Anti-halusinasi** — baca file/migrasi/rute/tipe terkait sebelum mengubah; bila kode berbeda dari instruksi → berhenti & laporkan.
7. **Integritas** — migrasi baru saja; FormRequest, Resource, Policy; `HtmlSanitizer`; tanpa `any`/`@ts-ignore`/hex JSX/inline style/TODO.
8. **Cakupan** — Uji 3 Pertanyaan (AGENTS.md §16). Dilarang: lowongan kerja, lamaran, tracer alumni, unggahan testimoni oleh publik.
9. **Resep Modul** — sama dengan `docs/phase-4.md` (Sesi A data, B admin, C publik). **Konten contoh** berawalan "Contoh – ".
10. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** melengkapi informasi pendukung & bukti sosial: Unduhan Dokumen, FAQ, Testimoni, Mitra Industri, Galeri Video.
- **Syarat awal:** DoD Phase 4 lulus; Sesi 5-00 selesai (field + ADR video disetujui).
- **Kondisi awal:** dokumen sekolah tanpa tempat resmi; pertanyaan berulang lewat Pesan Kontak; belum ada testimoni, mitra, video.
- **Kondisi akhir:** 5 modul dengan CRUD admin & tampilan publik; grup Navbar "Informasi"; urutan section Beranda final tertulis di AGENTS.md §17.
- **Di luar cakupan phase:** fitur CMS lanjutan (Phase 6).

### DoD Phase 5
- [ ] 5 modul memenuhi Resep Modul.
- [ ] Berkas unduhan nonaktif → 404 (dibaca di kode `download()`).
- [ ] Testimoni tanpa `persetujuan_tampil` tidak pernah dikirim ke halaman publik (scope di model).
- [ ] JSON-LD `FAQPage` ada di `/faq`; CSP diperbarui untuk thumbnail/embed video sesuai ADR-006.
- [ ] `npm run verify` lulus; `npm run build` sukses.

---

## [Sesi 5-00] - Persetujuan Field & ADR Video [MANUAL PEMILIK]
- **Scope:** AGENTS.md §17 & §18.
- **Implementation:**
  1. Agent menulis usulan berikut sebagai *menunggu persetujuan*, lalu berhenti:
     - `BR-020 Unduhan` — tabel `unduhan`: `slug`, `kategori` (`brosur`/`kalender`/`formulir`/`sk`/`lainnya`), `tanggal_terbit`, `jumlah_unduh` (default 0), `is_active`; translasi `judul`, `deskripsi`; media `berkas` (single; pdf/docx/xlsx; maks 10 MB).
     - `BR-021 FAQ` — tabel `faq`: `kategori` (`umum`/`pendaftaran`/`akademik`/`fasilitas`), `urutan`, `is_active`; translasi `pertanyaan`, `jawaban`.
     - `BR-022 Testimoni` — tabel `testimoni`: `nama`, `peran` (`alumni`/`orang_tua`/`mitra`), `keterangan` (mis. "Alumni TKJ 2022"), `persetujuan_tampil` (bool, wajib true agar bisa aktif), `is_active`, `urutan`; translasi `kutipan`; media `foto`.
     - `BR-023 Mitra Industri` — tabel `mitra`: `nama`, `bidang`, `url` (nullable), `urutan`, `is_active`; pivot `jurusan_mitra`; media `logo`.
     - `BR-024 Video` — tabel `video`: `youtube_id` (11 karakter), `urutan`, `is_active`, `galeri_id` (nullable); translasi `judul`.
  2. `ADR-006 Video`: pilihan (a) thumbnail `i.ytimg.com` + tautan keluar ke YouTube, atau (b) embed `youtube-nocookie.com` setelah klik. Usulan: (a).
  3. Setelah pemilik menjawab, ubah status menjadi *disetujui*.
- **Finish & Commit (Run at End):**
  `git add AGENTS.md && git commit -m "docs(agents): field modul informasi BR-020 s.d. BR-024 dan ADR video"`
- **DoD:** BR-020–BR-024 & ADR-006 disetujui.

## [Sesi 5-01] - Unduhan: Data & Admin
- **Scope:** migrasi `create_unduhan_table` & translasi, `Models/Unduhan.php`, `UnduhanTranslation.php`, seeder contoh, `Admin/UnduhanController.php`, Requests, Resource, Policy, rute, `Pages/Admin/Unduhan/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi A + B sesuai BR-020. Berkas disimpan di disk **non-publik** (`local`) lewat MediaLibrary (`toMediaCollection('berkas', 'local')`); validasi `mimes:pdf,docx,xlsx` + `mimetypes` + `max:10240`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(unduhan): data dan CRUD admin unduhan"`
- **DoD:** berkas tidak bisa diakses lewat `/storage/...`.

## [Sesi 5-02] - Unduhan: Publik
- **Scope:** `Public/UnduhanController.php`, rute `/unduhan` (`unduhan.index`) & `/unduhan/{unduhan:slug}/berkas` (`unduhan.download`), `Pages/Public/Unduhan.tsx`, sitemap (hanya indeks), pencarian.
- **Implementation:**
  1. `download()`: `abort_unless($unduhan->is_active, 404)`; `increment('jumlah_unduh')`; respons `$media->toResponse($request)` atau `response()->download($media->getPath(), $media->file_name)`. Throttle `60,1`.
  2. Halaman: daftar per kategori, ukuran & jenis berkas, tanggal terbit, tombol unduh (`<a>` biasa).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(unduhan): halaman publik dan unduh berkas"`
- **DoD:** cek `is_active` ada sebelum mengirim berkas.

## [Sesi 5-03] - FAQ: Data & Admin
- **Scope:** migrasi `create_faq_table` & translasi, `Models/Faq.php`, `FaqTranslation.php`, seeder contoh, `Admin/FaqController.php`, Requests (+ Reorder), Resource, Policy, rute, `Pages/Admin/Faq/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi A + B sesuai BR-021; reorder drag per kategori (pola `StatistikController@reorder`); `jawaban` lewat TipTap + `HtmlSanitizer`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(faq): data dan CRUD admin faq"`
- **DoD:** tsc lulus.

## [Sesi 5-04] - FAQ: Publik
- **Scope:** `Public/FaqController.php`, rute `/faq` (`faq`), `Pages/Public/Faq.tsx`, `Components/UI/Accordion.tsx` (baru) + `Accordion.test.tsx`, `KontakController.php`, `Pages/Public/Kontak.tsx`, `Layouts/PublicLayout.tsx`, sitemap.
- **Implementation:**
  1. Accordion aksesibel (`button` + `aria-expanded` + `aria-controls`); vitest buka/tutup.
  2. `/faq`: dikelompokkan per kategori. Kontak: 5 FAQ teratas kategori `umum` di atas form.
  3. `PublicLayout` menerima prop opsional `jsonLd` (array objek) yang dirender dengan nonce; `/faq` mengirim objek `FAQPage` (jawaban di-strip tag).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(faq): halaman faq, blok faq di kontak, json-ld"`
- **DoD:** vitest Accordion lulus.

## [Sesi 5-05] - Testimoni: Data & Admin
- **Scope:** migrasi `create_testimoni_table` & translasi, `Models/Testimoni.php`, `TestimoniTranslation.php`, seeder contoh, `Admin/TestimoniController.php`, Requests, Resource, Policy, rute, `Pages/Admin/Testimoni/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi A + B sesuai BR-022. Scope `tampil()` = `is_active` **dan** `persetujuan_tampil`. Request: `is_active` hanya boleh true bila `persetujuan_tampil` true (`accepted_if`/closure rule). Form menampilkan catatan "Pastikan orang yang bersangkutan sudah memberi izin".
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(testimoni): data dan CRUD admin testimoni"`
- **DoD:** scope `tampil()` dipakai di semua query publik.

## [Sesi 5-06] - Testimoni: Carousel Beranda
- **Scope:** `BerandaController.php`, `Components/UI/TestimoniCarousel.tsx` (baru), `Pages/Public/Beranda.tsx`.
- **Implementation:** maks 8 testimoni `tampil()`; carousel `embla-carousel-react` (sudah terpasang) dengan tombol prev/next ber-`aria-label`, tanpa autoplay bila `prefers-reduced-motion`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(beranda): carousel testimoni"`
- **DoD:** section tidak dirender bila data kosong.

## [Sesi 5-07] - Mitra Industri: Data & Admin
- **Scope:** migrasi `create_mitra_table`, `create_jurusan_mitra_table`, `Models/Mitra.php`, relasi di `Models/Jurusan.php`, seeder contoh, `Admin/MitraController.php`, Requests (+ Reorder), Resource, Policy, rute, `Pages/Admin/Mitra/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi A + B sesuai BR-023 (tanpa tabel translasi). Form: logo (`ImageUpload`, 2 MB), pilih jurusan (multi-checkbox).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(mitra): data dan CRUD admin mitra industri"`
- **DoD:** pivot tersinkron lewat `sync()`.

## [Sesi 5-08] - Mitra Industri: Publik
- **Scope:** `BerandaController.php`, `Public/JurusanController.php` (`show`), `Components/UI/MitraStrip.tsx` (baru), `Pages/Public/Beranda.tsx`, `Pages/Public/Jurusan/Show.tsx`.
- **Implementation:** deretan logo (grayscale → warna saat hover, `alt` = nama mitra, tautan `rel="noopener noreferrer"` bila `url`). Beranda: semua mitra aktif; Jurusan: mitra terkait.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(mitra): deretan logo mitra di beranda dan jurusan"`
- **DoD:** setiap logo punya `alt`.

## [Sesi 5-09] - Galeri Video
- **Scope:** migrasi `create_video_table` & translasi, `Models/Video.php`, `VideoTranslation.php`, `Admin/VideoController.php`, Requests, Resource, Policy, rute, `Pages/Admin/Video/{Index,Form}.tsx`, `Public/GaleriController.php`, `Pages/Public/Galeri.tsx`, `lib/youtube.ts` (baru) + `youtube.test.ts`, `ContentSecurityPolicy.php`.
- **Implementation:**
  1. `lib/youtube.ts`: `extractYoutubeId(url)` untuk format `watch?v=`, `youtu.be/`, `shorts/`, `embed/`; vitest untuk keempat format + URL invalid. Logika yang sama di FormRequest (regex ID 11 karakter `[A-Za-z0-9_-]`).
  2. Galeri publik: tab "Foto" / "Video". Video tampil sebagai thumbnail `https://i.ytimg.com/vi/<id>/hqdefault.jpg` dengan tautan ke YouTube (ADR-006 opsi a) atau embed setelah klik (opsi b).
  3. CSP: tambah `https://i.ytimg.com` di `img-src` (dan `https://www.youtube-nocookie.com` di `frame-src` hanya bila opsi b).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(video): galeri video youtube"`
- **DoD:** vitest youtube lulus; CSP sesuai ADR-006.

## [Sesi 5-10] - Navigasi "Informasi" & Urutan Beranda
- **Scope:** `Navbar.tsx`, `Footer.tsx`, `Pages/Public/Beranda.tsx`, AGENTS.md §17.
- **Implementation:**
  1. Grup "Informasi" (`Information`) memakai `NavDropdown` (Phase 4): Berita, Pengumuman, Agenda, Unduhan, FAQ.
  2. Tulis usulan urutan section Beranda di AGENTS.md §17 (`BR-025`): Hero → Pengumuman urgent → Statistik → Jurusan → Prestasi → Berita → Testimoni → Mitra → CTA. Terapkan urutan itu; bila pemilik belum menyetujui, tulis di laporan.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(navigasi): grup informasi dan urutan section beranda"`
- **DoD:** urutan di kode = BR-025.

## [Sesi 5-11] - Penutup Phase 5
- **Scope:** `AGENTS.md` (§4, §5, §16), `README.md`, `public/build`.
- **Implementation:** perbarui rute, model, fitur; `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-5): perbarui dokumentasi dan build aset"`
- **DoD:** semua checklist DoD Phase 5 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 5-00 | Persetujuan field & ADR video (manual) |
| 5-01 – 5-02 | Unduhan (data+admin, publik) |
| 5-03 – 5-04 | FAQ (data+admin, publik) |
| 5-05 – 5-06 | Testimoni (data+admin, carousel) |
| 5-07 – 5-08 | Mitra industri (data+admin, publik) |
| 5-09 | Galeri video |
| 5-10 | Navigasi Informasi & urutan Beranda |
| 5-11 | Penutup phase |
