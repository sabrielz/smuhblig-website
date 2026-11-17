# Phase 4 — Modul Profil Sekolah

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
8. **Cakupan** — setiap modul wajib lolos Uji 3 Pertanyaan (AGENTS.md §16). Dilarang menambah field kepegawaian, nilai, presensi, jadwal pelajaran, atau pendaftaran.
9. **Konten contoh** — seeder hanya untuk dev, setiap record diberi awalan **"Contoh – "**. Dilarang mengarang nama orang/prestasi yang tampak nyata.
10. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** melengkapi informasi profil sekolah: Guru & Tendik, Fasilitas, Ekstrakurikuler, Prestasi.
- **Syarat awal:** DoD Phase 3 lulus; Sesi 4-00 (persetujuan field) selesai.
- **Kondisi awal:** profil sekolah hanya di `Tentang` + Struktur Organisasi; Navbar datar 7–8 item.
- **Kondisi akhir:** 4 modul dengan CRUD admin + halaman publik + masuk pencarian & sitemap; Navbar punya grup "Profil" (dropdown desktop, accordion mobile, bisa keyboard); Beranda menampilkan 3 prestasi terbaru.
- **Di luar cakupan phase:** modul informasi pendukung (Phase 5).

### DoD Phase 4
- [ ] 4 modul memenuhi seluruh langkah Resep Modul.
- [ ] Rute publik `/guru`, `/fasilitas`, `/ekstrakurikuler`, `/prestasi` (+ detail bila ada) terdaftar.
- [ ] Pencarian & sitemap memuat 4 modul.
- [ ] Menu Profil bisa dipakai dengan keyboard (Tab, Enter, Esc) dan di lebar 360 px.
- [ ] Tidak ada record seeder tanpa awalan "Contoh – ".
- [ ] `npm run verify` lulus; `npm run build` sukses.

---

## Resep Modul (acuan semua sesi phase ini)

**Pola wajib diikuti:** `app/Models/Pengumuman.php` + `PengumumanTranslation.php` + migrasinya (tabel utama + `<tabel>_translations` dengan `locale`, `ai_translated`, `reviewed`, unique `[fk, locale]`). Admin mengikuti `PengumumanController` + `Pages/Admin/Pengumuman/*`. Publik mengikuti `AgendaPublikController` + `Pages/Public/Agenda.tsx`. Reorder mengikuti `StrukturOrganisasiController@reorder` (dnd-kit).

- **Sesi A (data):** migrasi baru (tabel utama + translasi, index `slug`, `is_active`, `urutan`, `timestamps()` tidak nullable), model dengan `protected $table` eksplisit, `$fillable`, `casts`, relasi, method `translation($locale)` sesuai pola, `HasMedia` + `registerMediaConversions` WebP bila ada foto, seeder contoh (didaftarkan di `DatabaseSeeder` paling akhir, hanya `app()->environment('local')`).
- **Sesi B (admin):** `Store/Update<X>Request`, `<X>Resource`, `<X>Policy` (Editor & Admin), controller resource tanpa `show` (+ `reorder` bila ada `urutan`), rute di grup admin, `Pages/Admin/<X>/Index.tsx` & `Form.tsx`, item sidebar grup "Sekolah", tipe di `types/index.ts`, entri BR-001 di AGENTS.md §17.
- **Sesi C (publik):** controller publik + rute + SEOTools + `Cache::remember` (TTL 600, key per locale), halaman publik, entri sitemap & pencarian.

---

## [Sesi 4-00] - Persetujuan Field [MANUAL PEMILIK]
- **Scope:** AGENTS.md §17 (diisi agent setelah pemilik menyetujui).
- **Implementation:**
  1. Agent menulis usulan field di bawah ini ke AGENTS.md §17 sebagai `BR-010`–`BR-013` berstatus *menunggu persetujuan*, lalu berhenti.
     - `BR-010 Guru & Tendik` — tabel `guru`: `nama`, `gelar_depan` (nullable), `gelar_belakang` (nullable), `kelompok` (`guru`/`tendik`), `jurusan_id` (nullable FK `jurusans`), `urutan`, `is_active`; translasi: `jabatan`, `mapel` (nullable); media `foto` (single). **Tanpa** NIP/NUPTK/kontak pribadi.
     - `BR-011 Fasilitas` — tabel `fasilitas`: `slug`, `kategori` (`ruang_praktik`/`umum`/`olahraga`/`ibadah`), `urutan`, `is_active`; translasi: `nama`, `deskripsi`; media `foto` (multiple, maks 8). **Tanpa** data inventaris.
     - `BR-012 Ekstrakurikuler` — tabel `ekstrakurikuler`: `slug`, `pembina_guru_id` (nullable FK `guru`), `urutan`, `is_active`; translasi: `nama`, `deskripsi`, `jadwal` (teks bebas); media `foto` (single). **Tanpa** pendaftaran anggota.
     - `BR-013 Prestasi` — tabel `prestasi`: `slug`, `tingkat` (`sekolah`/`kabupaten`/`provinsi`/`nasional`/`internasional`), `kategori` (`akademik`/`non_akademik`), `tahun` (smallint), `tanggal` (nullable date), `jurusan_id` (nullable), `is_active`; translasi: `judul`, `ringkasan`; media `foto` (single).
  2. Pemilik menyetujui/mengubah; agent mengubah status menjadi *disetujui* sesuai jawaban.
- **Finish & Commit (Run at End):**
  `git add AGENTS.md && git commit -m "docs(agents): field modul profil sekolah BR-010 s.d. BR-013"`
- **DoD:** BR-010–BR-013 berstatus disetujui.

## [Sesi 4-01] - Guru & Tendik: Data
- **Scope:** migrasi `create_guru_table` & `create_guru_translations_table`, `app/Models/Guru.php`, `GuruTranslation.php`, `database/seeders/GuruContohSeeder.php`, `DatabaseSeeder.php`.
- **Implementation:** Resep Sesi A sesuai BR-010. Accessor `nama_lengkap` (gelar depan + nama + gelar belakang). Seeder 6 record "Contoh – Guru 1" dst.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(guru): migrasi, model, seeder contoh"`
- **DoD:** model lulus PHPStan.

## [Sesi 4-02] - Guru & Tendik: Admin
- **Scope:** `Admin/GuruController.php`, `Requests/Admin/{Store,Update,Reorder}GuruRequest.php`, `Resources/Admin/GuruResource.php`, `Policies/GuruPolicy.php`, `routes/web.php`, `Pages/Admin/Guru/{Index,Form}.tsx`, `AdminSidebar.tsx`, `types/index.ts`.
- **Implementation:** Resep Sesi B. Index: filter kelompok & jurusan, reorder drag. Form: foto `ImageUpload` (BR-004 2 MB).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(guru): CRUD admin guru dan tendik"`
- **DoD:** semua aksi memanggil `Gate::authorize`.

## [Sesi 4-03] - Guru & Tendik: Publik
- **Scope:** `Public/GuruController.php`, `routes/web.php` (`/guru`, `guru.index`), `Pages/Public/Guru.tsx`, `GenerateSitemap.php`, `PencarianController.php`.
- **Implementation:** Resep Sesi C. Grid kartu foto + nama lengkap + jabatan/mapel; tab Guru / Tendik; filter jurusan. Tanpa halaman detail per orang.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(guru): halaman publik guru dan tendik"`
- **DoD:** muncul di pencarian & sitemap.

## [Sesi 4-04] - Fasilitas: Data
- **Scope:** migrasi `create_fasilitas_table` & `create_fasilitas_translations_table`, `Models/Fasilitas.php`, `FasilitasTranslation.php`, `FasilitasContohSeeder.php`, `DatabaseSeeder.php`.
- **Implementation:** Resep Sesi A sesuai BR-011 (slug dari `nama` ID mengikuti cara slug di model Pengumuman).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(fasilitas): migrasi, model, seeder contoh"`
- **DoD:** model lulus PHPStan.

## [Sesi 4-05] - Fasilitas: Admin
- **Scope:** `Admin/FasilitasController.php`, Requests, Resource, Policy, rute, `Pages/Admin/Fasilitas/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi B. Form: unggah banyak foto (pola `Admin/Galeri/Show.tsx` untuk tambah/hapus foto), maks 8.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(fasilitas): CRUD admin fasilitas"`
- **DoD:** batas 8 foto divalidasi di server.

## [Sesi 4-06] - Fasilitas: Publik
- **Scope:** `Public/FasilitasController.php`, rute `/fasilitas` & `/fasilitas/{fasilitas:slug}`, `Pages/Public/Fasilitas/{Index,Show}.tsx`, sitemap, pencarian.
- **Implementation:** Resep Sesi C. Index: filter kategori. Show: deskripsi + galeri foto memakai `Components/UI/Lightbox.tsx` (Phase 3).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(fasilitas): halaman publik fasilitas"`
- **DoD:** muncul di pencarian & sitemap.

## [Sesi 4-07] - Ekstrakurikuler: Data
- **Scope:** migrasi `create_ekstrakurikuler_table` & translasi, `Models/Ekstrakurikuler.php`, `EkstrakurikulerTranslation.php`, seeder contoh.
- **Implementation:** Resep Sesi A sesuai BR-012; relasi `pembina()` → `Guru` (nullOnDelete).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(ekskul): migrasi, model, seeder contoh"`
- **DoD:** model lulus PHPStan.

## [Sesi 4-08] - Ekstrakurikuler: Admin
- **Scope:** `Admin/EkstrakurikulerController.php`, Requests, Resource, Policy, rute, `Pages/Admin/Ekstrakurikuler/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi B. Pilihan pembina dari Guru aktif (`Select`).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(ekskul): CRUD admin ekstrakurikuler"`
- **DoD:** tsc lulus.

## [Sesi 4-09] - Ekstrakurikuler: Publik
- **Scope:** `Public/EkstrakurikulerController.php`, rute `/ekstrakurikuler` & detail slug, `Pages/Public/Ekstrakurikuler/{Index,Show}.tsx`, sitemap, pencarian.
- **Implementation:** Resep Sesi C. Show menampilkan pembina (nama lengkap), jadwal, deskripsi.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(ekskul): halaman publik ekstrakurikuler"`
- **DoD:** muncul di pencarian & sitemap.

## [Sesi 4-10] - Prestasi: Data
- **Scope:** migrasi `create_prestasi_table` & translasi, `Models/Prestasi.php`, `PrestasiTranslation.php`, seeder contoh.
- **Implementation:** Resep Sesi A sesuai BR-013; index komposit `[is_active, tahun]`; enum PHP `TingkatPrestasi` dan `KategoriPrestasi` di `app/Enums` dengan `label()` ID/EN.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(prestasi): migrasi, model, enum, seeder contoh"`
- **DoD:** model lulus PHPStan.

## [Sesi 4-11] - Prestasi: Admin
- **Scope:** `Admin/PrestasiController.php`, Requests (`Rule::enum`), Resource, Policy, rute, `Pages/Admin/Prestasi/{Index,Form}.tsx`, sidebar, tipe.
- **Implementation:** Resep Sesi B. Index: filter tahun, tingkat, jurusan.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(prestasi): CRUD admin prestasi"`
- **DoD:** tsc lulus.

## [Sesi 4-12] - Prestasi: Publik & Beranda
- **Scope:** `Public/PrestasiController.php`, rute `/prestasi` & detail slug, `Pages/Public/Prestasi/{Index,Show}.tsx`, `BerandaController.php`, `Pages/Public/Beranda.tsx`, sitemap, pencarian.
- **Implementation:** Resep Sesi C. Index: filter tahun/tingkat/kategori, badge tingkat. Beranda: section "Prestasi Terbaru" (3 item `is_active` urut `tahun` desc, `tanggal` desc) dengan `staggerContainer` + `fadeInUp`; letakkan setelah section Jurusan.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(prestasi): halaman publik dan section beranda"`
- **DoD:** section tidak dirender bila data kosong.

## [Sesi 4-13] - Navigasi Grup "Profil"
- **Scope:** `resources/js/Components/Layout/Navbar.tsx`, `resources/js/Components/Layout/NavDropdown.tsx` (baru), `NavDropdown.test.tsx` (baru), `Footer.tsx`.
- **Implementation:**
  1. Tipe item navigasi mendukung `children`. Grup "Profil" (`Profile`): Tentang, Guru & Tendik, Fasilitas, Ekstrakurikuler, Prestasi.
  2. Desktop: dropdown dengan `aria-expanded`, `aria-haspopup`, buka via klik/Enter/Space, tutup via Esc & klik luar, fokus kembali ke pemicu. Mobile: accordion di drawer yang ada.
  3. Vitest NavDropdown: buka dengan Enter, tutup dengan Esc.
  4. Footer: tambah tautan modul baru di kolom tautan yang ada.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(navigasi): grup menu profil dengan dropdown aksesibel"`
- **DoD:** vitest NavDropdown lulus.

## [Sesi 4-14] - Penutup Phase 4
- **Scope:** `AGENTS.md` (§4, §5 jumlah model, §15), `README.md`, `public/build`.
- **Implementation:** perbarui tabel rute, data model, daftar fitur; `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-4): perbarui dokumentasi dan build aset"`
- **DoD:** semua checklist DoD Phase 4 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 4-00 | Persetujuan field (manual) |
| 4-01 – 4-03 | Guru & Tendik (data, admin, publik) |
| 4-04 – 4-06 | Fasilitas (data, admin, publik) |
| 4-07 – 4-09 | Ekstrakurikuler (data, admin, publik) |
| 4-10 – 4-12 | Prestasi (data, admin, publik + beranda) |
| 4-13 | Navigasi grup Profil |
| 4-14 | Penutup phase |
