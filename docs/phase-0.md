# Phase 0 — Fondasi & Pagar Pengaman

> Bagian dari rangkaian `docs/phase-0.md` … `docs/phase-8.md` (titik akhir: v1.0 Landing Page & CMS Lengkap).
> Kerjakan sesi **berurutan**. Jangan mulai phase berikutnya sebelum DoD phase ini tercentang.

---

## Global Directives (wajib, berlaku di setiap sesi)

1. **AGENTS.md §0 menang di atas segalanya.** Dilarang menulis/menjalankan test PHP (Pest, PHPUnit, `composer test*`). Yang boleh dijalankan: Pint, PHPStan, ESLint, Prettier, `tsc`, dan `npx vitest run` (frontend).
2. **Continuous Coding First:** selesaikan semua perubahan file dalam sesi dulu. Dilarang menjalankan formatter/linter per file.
3. **Single-Pass End Verification:** format, lint/analisis statis, dan type-check hanya dijalankan **sekali** di akhir sesi.
4. **One-Liner Execution:** verifikasi akhir + commit dalam satu perintah berantai `&&` (lihat baris *Finish & Commit* tiap sesi). Sejak Sesi 0-08 selesai, perintah standarnya `npm run verify && git add -A && git commit -m "..."`.
5. **Zero Scope Creep:** kerjakan persis cakupan sesi. Temuan di luar sesi ditulis di laporan akhir, tidak dikerjakan. Dilarang riset web bila pola lokal sudah ada. Dilarang git worktree. Dilarang push / membuka PR.
6. **Anti-halusinasi:** buka dan baca file, migrasi, model, rute, dan tipe TS terkait **sebelum** mengubah. Jangan menebak nama kolom, rute, props, atau method. Bila kode berbeda dari instruksi ini → berhenti dan laporkan apa adanya.
7. **Integritas:** migrasi selalu file baru (jangan edit migrasi lama); validasi lewat FormRequest; serialisasi lewat Resource; otorisasi lewat Policy; HTML editor lewat `HtmlSanitizer`; tanpa `any`, `@ts-ignore`, hex di className JSX, inline style, atau komentar TODO.
8. **Batas cakupan:** situs ini hanya landing page + CMS. Sistem pengelolaan sekolah (PPDB/SPMB, BKK, alumni, keuangan, sarpras, akademik, LMS, akun publik) **di luar cakupan** — cukup tautan keluar. Rujukan lengkap: AGENTS.md §16 (dibuat di Sesi 0-01).
9. **Laporan akhir sesi:** daftar file yang diubah, output perintah verifikasi (apa adanya), centang DoD sesi, dan hal yang tidak bisa diverifikasi.

---

## Konteks Phase

- **Tujuan:** menetapkan satu sumber kebenaran (AGENTS.md), membersihkan repo, membuat `tsc` bersih, memasang alat lint/verifikasi + CI, sebelum ada perilaku aplikasi yang diubah.
- **Syarat awal:** branch `master` bersih; laporan audit & peta pengerjaan disetujui pemilik.
- **Kondisi awal:** AGENTS.md / README.md / `.cursorrules` saling bertentangan (DB, seeder, klaim fitur); ±22 error `tsc`; tidak ada ESLint/Vitest/PHPStan; file sampah di root; token GitHub tertanam di URL remote; password admin tertulis di `AdminUserSeeder`.
- **Kondisi akhir:** AGENTS.md akurat + memuat cakupan, aturan bisnis, dan keputusan; `npx tsc --noEmit` 0 error; `npm run verify` tersedia; CI GitHub Actions hijau; rahasia sudah dirotasi.
- **Di luar cakupan phase:** mengubah perilaku fitur, menambah fitur, refactor besar.

### DoD Phase 0
- [ ] AGENTS.md memuat §16 Batas Cakupan, §17 Aturan Bisnis, §18 Keputusan, dan tidak lagi memuat klaim yang dibantah audit.
- [ ] `.cursorrules` dan README tidak bertentangan dengan AGENTS.md.
- [ ] `npx tsc --noEmit` → 0 error.
- [ ] `npm run verify` berjalan dan lulus.
- [ ] Workflow CI hijau pada commit terakhir phase.
- [ ] Pemilik mengonfirmasi Sesi 0-00 selesai.

---

## [Sesi 0-00] - Rotasi Rahasia [MANUAL PEMILIK]
- **Scope:** `.git/config` (lokal), akun GitHub, akun admin di setiap lingkungan. Bukan pekerjaan agent.
- **Implementation:**
  1. Cabut Personal Access Token yang tertanam di URL remote `origin` (GitHub → Settings → Developer settings → Tokens).
  2. Set ulang remote tanpa token: `git remote set-url origin https://github.com/<owner>/<repo>.git`, lalu login lewat Git Credential Manager atau SSH.
  3. Ganti password akun admin di semua lingkungan yang pernah menjalankan `AdminUserSeeder` (password lama sudah ada di riwayat git).
- **Finish & Commit (Run at End):** tidak ada commit.
- **DoD:** `git remote -v` tanpa token; password admin lama tidak berlaku lagi.

## [Sesi 0-01] - AGENTS.md: Cakupan, Aturan Bisnis, Keputusan
- **Scope:** `AGENTS.md` saja. Jangan mengubah §0.
- **Implementation:**
  1. Tambah **§16 Batas Cakupan**: daftar *masuk cakupan* (halaman informasi publik dikelola CMS; fitur CMS operator; form kontak sebagai satu-satunya input publik; tautan keluar ke Portal & `spmb_url`; SEO, dwibahasa, performa, aksesibilitas, keamanan, backup; asisten AI via antrean) dan *di luar cakupan* (PPDB/SPMB, BKK/lowongan/tracer alumni, keuangan/SPP, sarpras/inventaris, akademik/LMS/presensi, akun siswa/ortu/publik, prakerin, jurnal ekskul, e-voting, perpustakaan). Tambah **Uji 3 Pertanyaan**: (1) menyampaikan informasi sekolah ke publik? (2) dikelola operator lewat CMS? (3) berjalan tanpa akun/transaksi/unggahan publik selain form kontak? → 3× ya = boleh diusulkan; 1× tidak = milik Portal.
  2. Tambah **§17 Aturan Bisnis** bernomor:
     - `BR-001` Matriks peran (status: *menunggu persetujuan pemilik*): Author = buat artikel, ubah artikel milik sendiri berstatus `draft`/`pending_review`, ajukan review; tidak boleh publish/arsip/hapus milik orang lain. Editor = semua aksi artikel, galeri, pengumuman, agenda, edit jurusan, publish. Admin = semua aksi Editor + pengguna, pengaturan, tautan, statistik, struktur organisasi, konten halaman, hapus pesan.
     - `BR-002` Transisi status artikel: Author → `draft`, `pending_review` (dan `published` hanya untuk artikel miliknya bila `artikel_approval` = false). Editor/Admin → semua status.
     - `BR-003` Pengumuman aktif = `is_active` true **dan** (`tanggal_mulai` null atau ≤ hari ini) **dan** (`tanggal_selesai` null atau ≥ hari ini).
     - `BR-004` Unggahan gambar: jpg/jpeg/png/webp, maks 2 MB (thumbnail, avatar, logo, struktur organisasi) dan 20 MB (foto galeri). Nama file UUID.
     - `BR-005` Bahasa: ID wajib, EN opsional, tampilan EN fallback ke ID.
  3. Tambah **§18 Keputusan (ADR)**: `ADR-001` MySQL 8 untuk dev & produksi; `ADR-002` tidak membangun PPDB, tombol daftar memakai pengaturan `spmb_url` (tautan keluar); `ADR-003` situs hanya landing page + CMS, sistem sekolah di Portal; `ADR-004` notifikasi admin memakai polling; `ADR-005` dilarang test PHP selama AGENTS.md §0 aktif, verifikasi via `npm run verify`.
  4. Koreksi klaim yang tidak sesuai kode: §12 tulis bahwa `DatabaseSeeder` saat ini memanggil 8 seeder (target 11 dikerjakan di Phase 2); §14 tulis CSP sedang nonaktif (diaktifkan Phase 1); catat bahwa Tags & i18next terpasang tapi belum dipakai; pencarian saat ini hanya Jurusan + Artikel.
  5. Tambah §19 **Roadmap**: daftar `docs/phase-0.md` … `docs/phase-8.md` + aturan gerbang (satu phase aktif, DoD phase wajib tercentang sebelum lanjut).
- **Finish & Commit (Run at End):**
  `git add AGENTS.md && git commit -m "docs(agents): tambah batas cakupan, aturan bisnis, keputusan, roadmap"`
- **DoD:** §16–§19 ada; tidak ada perubahan di §0.

## [Sesi 0-02] - Selaraskan README.md & .cursorrules
- **Scope:** `README.md`, `.cursorrules`.
- **Implementation:**
  1. `README.md`: DB → MySQL (hapus "PostgreSQL (prod)"); pencarian hanya Jurusan + Artikel; hapus klaim "tagging" & "real-time notifications" (ganti "polling"); urutan seeding disamakan dengan isi `DatabaseSeeder.php` saat ini; tambahkan rujukan ke `docs/phase-*.md`; nilai default `ANTHROPIC_MODEL` disamakan dengan `config/ai.php` (baca file itu, jangan menebak).
  2. `.cursorrules`: ganti seluruh isi dengan 5–8 baris yang menyatakan AGENTS.md adalah satu-satunya acuan (termasuk §0), dan aturan lama tidak berlaku lagi.
- **Finish & Commit (Run at End):**
  `git add README.md .cursorrules && git commit -m "docs: selaraskan README dan cursorrules dengan AGENTS.md"`
- **DoD:** README tidak menyebut PostgreSQL untuk produksi; `.cursorrules` hanya merujuk AGENTS.md.

## [Sesi 0-03] - Bersihkan Repo
- **Scope:** `response.html`, `test_purifier.php`, `ts_errors.txt`, `app/Services/HtmlSanitizerService.php`.
- **Implementation:**
  1. Hapus `response.html`, `test_purifier.php`, `ts_errors.txt`.
  2. Jalankan `grep -rn "HtmlSanitizerService" app routes config resources database`. Bila kosong, hapus `app/Services/HtmlSanitizerService.php`. Bila ada pemakaian → jangan hapus, laporkan.
- **Finish & Commit (Run at End):**
  `php vendor/bin/pint --dirty && git add -A && git commit -m "chore: hapus file sampah dan sanitizer duplikat"`
- **DoD:** keempat file tidak ada (atau alasan tertulis bila sanitizer masih dipakai).

## [Sesi 0-04] - Perbaiki Error tsc (1): Tipe Timer & PageProps
- **Scope:** `resources/js/Components/Layout/Navbar.tsx`, `resources/js/Pages/Admin/KontenHalaman/Edit.tsx`, `resources/js/Pages/Auth/LupaPassword.tsx`, `resources/js/Pages/Auth/ResetPassword.tsx`, bila perlu `resources/js/types/index.ts`.
- **Implementation:**
  1. `Navbar.tsx` (±baris 274): ganti `NodeJS.Timeout` dengan `ReturnType<typeof setTimeout>`.
  2. Tiga file lain: error TS2344 `PageProps` tidak memenuhi constraint Inertia. Baca definisi `PageProps` lokal di masing-masing file dan `SharedProps` di `types/index.ts`; buat interface lokal meng-`extend` `SharedProps` (atau tambahkan index signature `[key: string]: unknown` di `SharedProps`) — pilih satu cara dan pakai konsisten.
- **Finish & Commit (Run at End):**
  `npx tsc --noEmit 2>&1 | grep -E "Navbar|KontenHalaman/Edit|LupaPassword|ResetPassword" ; git add -A && git commit -m "fix(types): perbaiki tipe timer dan PageProps"`
- **DoD:** tidak ada error tsc tersisa di empat file tersebut (grep kosong).

## [Sesi 0-05] - Perbaiki Error tsc (2): Statistik & Struktur Organisasi
- **Scope:** `resources/js/Pages/Admin/Statistik/Index.tsx`, `resources/js/Pages/Admin/StrukturOrganisasi/Index.tsx`, `resources/js/Layouts/AdminLayout.tsx` (baca saja bila tidak perlu diubah).
- **Implementation:**
  1. Error TS2345 `number` → `Record<string, unknown>`: panggilan `route('...', id)` diganti `route('...', { <nama_parameter_rute>: id })`. Nama parameter diambil dari `routes/web.php` (mis. `statistik`, `struktur_organisasi`) — cek dengan membaca rute, bukan menebak.
  2. Error TS2741 `title` wajib di `AdminLayout`: tambahkan prop `title` yang sesuai judul halaman ("Statistik Beranda", "Struktur Organisasi").
- **Finish & Commit (Run at End):**
  `npx tsc --noEmit 2>&1 | grep -E "Statistik|StrukturOrganisasi" ; git add -A && git commit -m "fix(types): perbaiki parameter route dan judul layout admin"`
- **DoD:** tidak ada error tsc di dua file tersebut.

## [Sesi 0-06] - Perbaiki Error tsc (3): Agenda & Pencarian
- **Scope:** `resources/js/Pages/Public/Agenda.tsx`, `resources/js/Pages/Public/AgendaDetail.tsx`, `resources/js/Pages/Public/Pencarian.tsx`.
- **Implementation:**
  1. Agenda/AgendaDetail: variabel `t` (objek teks per locale) "possibly undefined". Pastikan lookup berbasis locale punya fallback ke `id` (mis. `const t = TEXT[locale] ?? TEXT.id`) sehingga tipe tidak lagi `undefined`. Jangan mengubah teks.
  2. `Pencarian.tsx` (±baris 278): ganti dengan `(hasil.artikel.data?.length ?? 0)`.
- **Finish & Commit (Run at End):**
  `npx tsc --noEmit && git add -A && git commit -m "fix(types): fallback locale agenda dan guard hasil pencarian"`
- **DoD:** `npx tsc --noEmit` → 0 error di seluruh proyek.

## [Sesi 0-07] - Pasang Alat Lint & Vitest
- **Scope:** `package.json`, `package-lock.json`, `composer.json`, `composer.lock`, `eslint.config.js`, `vitest.config.ts`, `phpstan.neon`, `phpstan-baseline.neon`, `resources/js/lib/utils.test.ts`.
- **Implementation:**
  1. `npm i -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks vitest jsdom @testing-library/react @testing-library/jest-dom`.
  2. `eslint.config.js` (flat config) minimal: `@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` recommended untuk `resources/js/**/*.{ts,tsx}`; abaikan `public/build`, `vendor`, `node_modules`, `resources/js/ziggy.js`.
  3. `vitest.config.ts`: environment `jsdom`, alias `@` → `resources/js` (samakan dengan `vite.config.ts`/`tsconfig.json`), `include: ['resources/js/**/*.test.{ts,tsx}']`.
  4. `resources/js/lib/utils.test.ts`: tes untuk `cn()` dan `truncate()` sesuai implementasi aktual di `lib/utils.ts`.
  5. `composer require --dev larastan/larastan`; `phpstan.neon`: include extension larastan, `level: 5`, `paths: [app]`, include `phpstan-baseline.neon`. Jalankan `php vendor/bin/phpstan analyse --generate-baseline --memory-limit=1G` sekali untuk membuat baseline.
- **Finish & Commit (Run at End):**
  `npx vitest run && npx tsc --noEmit && git add -A && git commit -m "build(dev): pasang eslint, vitest, dan larastan dengan baseline"`
- **DoD:** `npx vitest run` lulus; `phpstan analyse` lulus dengan baseline.

## [Sesi 0-08] - Skrip `npm run verify`
- **Scope:** `scripts/verify.mjs`, `package.json` (scripts), `AGENTS.md` §11 (tambah satu sub-bagian, jangan ubah §0).
- **Implementation:**
  1. `scripts/verify.mjs` (Node, `child_process.execSync` dengan `stdio: 'inherit'`, gagal = `process.exit(1)`):
     - Kumpulkan file berubah: `git diff --name-only HEAD` + `git ls-files --others --exclude-standard`, filter yang masih ada di disk.
     - PHP berubah → `php vendor/bin/pint <files>` lalu `php vendor/bin/phpstan analyse --no-progress --memory-limit=1G <files di app/>`.
     - TS/TSX berubah di `resources/js` → `npx eslint --quiet <files>`.
     - Selalu: `npx tsc --noEmit` lalu `npx vitest run --passWithNoTests`.
     - Kutip path dengan aman (spasi) dan lewati langkah bila daftar file kosong.
  2. `package.json`: `"verify": "node scripts/verify.mjs"`.
  3. AGENTS.md §11: tambah "Verifikasi akhir sesi: `npm run verify`".
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "build(dev): tambah skrip verify akhir sesi"`
- **DoD:** `npm run verify` jalan tanpa error pada working tree sesi ini.

## [Sesi 0-09] - Format Massal PHP (sekali)
- **Scope:** semua file PHP yang dilaporkan Pint. Perubahan murni format.
- **Implementation:**
  1. Jalankan `php vendor/bin/pint` untuk seluruh proyek. Jangan mengubah apa pun selain hasil Pint.
- **Finish & Commit (Run at End):**
  `php vendor/bin/pint && php vendor/bin/pint --test && git add -A && git commit -m "style: format seluruh PHP dengan pint"`
- **DoD:** `php vendor/bin/pint --test` lulus.

## [Sesi 0-10] - CI GitHub Actions
- **Scope:** `.github/workflows/ci.yml`.
- **Implementation:**
  1. Trigger: push & pull_request ke `master`.
  2. Job `verify` (ubuntu-latest): setup PHP 8.3 (ekstensi mbstring, pdo_mysql, intl, gd), `composer install --no-interaction --prefer-dist`, setup Node 20, `npm ci`, lalu: `php vendor/bin/pint --test`, `php vendor/bin/phpstan analyse --no-progress --memory-limit=1G`, `npx tsc --noEmit`, `npx vitest run`, `npm run build`.
  3. **Tidak ada** langkah test PHP (sesuai AGENTS.md §0).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "ci: tambah workflow verifikasi lint, tipe, vitest, build"`
- **DoD:** file workflow valid YAML; pemilik mengonfirmasi run pertama hijau setelah push manual.

---

## Ringkasan Sesi

| Sesi | Nama | Jenis |
|------|------|-------|
| 0-00 | Rotasi rahasia | Manual pemilik |
| 0-01 | AGENTS.md: cakupan, BR, ADR | Docs |
| 0-02 | README & .cursorrules | Docs |
| 0-03 | Bersihkan repo | Chore |
| 0-04 | tsc (1) timer & PageProps | Frontend |
| 0-05 | tsc (2) Statistik & Struktur | Frontend |
| 0-06 | tsc (3) Agenda & Pencarian | Frontend |
| 0-07 | Pasang ESLint, Vitest, Larastan | Tooling |
| 0-08 | Skrip `npm run verify` | Tooling |
| 0-09 | Format massal PHP | Style |
| 0-10 | CI GitHub Actions | CI |
