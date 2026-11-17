# Phase 2 — Perbaikan Fungsi & Konsistensi

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
8. **Cakupan** — AGENTS.md §16. **Aturan bisnis** — AGENTS.md §17.
9. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** semua yang sudah terlihat di aplikasi benar-benar bekerja: pengaturan berefek, tidak ada tautan mati, konvensi AGENTS.md dipatuhi.
- **Syarat awal:** DoD Phase 1 lulus; pemilik sudah mengisi nilai `spmb_url` (URL sistem pendaftaran di Portal) atau menyetujui tombol daftar disembunyikan bila kosong.
- **Kondisi awal (fakta kode):**
  - `HandleInertiaRequests` mengecek `Schema::hasTable('pengaturan')` padahal tabelnya `pengaturans` → shared `pengaturan` selalu nilai default.
  - `Public/JurusanController` membaca `spmb_url` dari tabel `settings` (tidak ada).
  - Logo disimpan sebagai `app_logo`/`app_favicon`, tetapi dibaca sebagai `site_logo`.
  - Form Pengaturan memakai key `fitur_artikel_approval` dll., seeder memakai `artikel_approval` dll.; toggle tidak dibaca kode.
  - Navbar (mobile) & Footer mengarah ke `/daftar` (404); Beranda memakai `spmb_url || "#"`.
  - Dashboard menghitung status `pending` (status sebenarnya `pending_review`).
  - `DatabaseSeeder` memanggil 8 dari 11 seeder.
  - Placeholder `picsum.photos` di `BerandaController`.
  - Pencarian hanya Jurusan + Artikel; sitemap tanpa Agenda & indeks Berita.
  - Validasi inline di ±12 controller; hanya 3 Resource.
  - ±700 warna hex di className JSX pada 44 file.
- **Kondisi akhir:** pengaturan tersimpan & terbaca konsisten; tombol daftar ke `spmb_url`; setiap toggle berefek; enum status; seeder lengkap; tanpa sumber gambar eksternal; pencarian & sitemap lengkap; seluruh validasi di FormRequest; Resource untuk semua modul admin; tanpa hex di JSX.
- **Di luar cakupan phase:** halaman/modul baru; desain ulang.

### DoD Phase 2
- [ ] `grep -rn "hasTable('pengaturan')" app` → kosong; `grep -rn "table('settings')" app` → kosong.
- [ ] `grep -rn '"/daftar"\|href="/daftar"' resources/js` → kosong.
- [ ] `grep -rn "fitur_artikel\|fitur_multibahasa" resources/js app` → kosong.
- [ ] `grep -rn "picsum" app resources` → kosong.
- [ ] `grep -rn "validate(\[" app/Http/Controllers` → kosong.
- [ ] `grep -rnE "\[#[0-9a-fA-F]{3,8}\]" resources/js` → kosong.
- [ ] `npm run verify` lulus; `npm run build` sukses.

---

## [Sesi 2-01] - Perbaiki Pembacaan Pengaturan
- **Scope:** `app/Http/Middleware/HandleInertiaRequests.php`, `app/Http/Controllers/Public/JurusanController.php`, `app/Http/Controllers/Admin/PengaturanController.php`, `app/Models/Pengaturan.php` (baca).
- **Implementation:**
  1. Ganti `Schema::hasTable('pengaturan')` dengan nama tabel dari model (`(new Pengaturan)->getTable()`).
  2. Normalisasi tipe di shared `pengaturan`: key boolean (`artikel_approval`, `artikel_ai_enabled`, `multibahasa_enabled`, `ai_translate_auto`, `email_notif_*`) di-cast ke `bool` agar cocok dengan `types/index.ts`.
  3. `JurusanController`: ganti query `DB::table('settings')` dengan `Pengaturan::get('spmb_url')`.
  4. `PengaturanController@store`: simpan logo/favicon ke key `site_logo` / `site_favicon` (bukan `app_logo` / `app_favicon`). Cari pembaca `app_logo` dengan grep; bila ada, samakan.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(pengaturan): baca tabel yang benar dan satukan key logo"`
- **DoD:** dua grep pertama DoD phase kosong.

## [Sesi 2-02] - Satukan Key Fitur Pengaturan
- **Scope:** `resources/js/Pages/Admin/Pengaturan/Index.tsx`, `resources/js/types/index.ts`, `database/migrations/<baru>_rename_fitur_pengaturan_keys.php`, `app/Http/Requests/Admin/StorePengaturanRequest.php`.
- **Implementation:**
  1. Form memakai key seeder: `artikel_approval`, `artikel_ai_enabled`, `multibahasa_enabled` (hapus prefiks `fitur_`).
  2. Migrasi data baru: untuk tiap `fitur_<x>` yang ada di tabel pengaturan, salin nilainya ke `<x>` bila `<x>` belum diisi manual, lalu hapus baris `fitur_<x>`. `down()` tidak perlu mengembalikan (dokumentasikan di komentar satu baris).
  3. Pastikan request whitelist memuat key final.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(pengaturan): satukan key toggle fitur"`
- **DoD:** grep `fitur_artikel` kosong.

## [Sesi 2-03] - Tombol Daftar ke `spmb_url`
- **Scope:** `resources/js/Components/Layout/Navbar.tsx`, `resources/js/Components/Layout/Footer.tsx`, `resources/js/Pages/Public/Beranda.tsx`, `resources/js/Pages/Public/Jurusan/Show.tsx` (cek pemakaian), `routes/web.php`.
- **Implementation:**
  1. Ganti `<Link href="/daftar">` dengan `<a href={pengaturan.spmb_url} target="_blank" rel="noopener noreferrer">`; render hanya bila `spmb_url` terisi.
  2. Beranda: hapus fallback `|| "#"`; sembunyikan CTA bila kosong.
  3. `routes/web.php`: `Route::get('/daftar', ...)` → redirect away ke `spmb_url` bila ada, selain itu redirect ke `beranda`. Nama rute `daftar`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(publik): tombol daftar mengarah ke spmb_url"`
- **DoD:** grep `/daftar` di `resources/js` kosong.

## [Sesi 2-04] - Enum Status Artikel
- **Scope:** `app/Enums/ArticleStatus.php` (baru), `app/Models/Article.php`, `app/Support/ArticleWorkflow.php`, `app/Http/Controllers/Admin/DashboardController.php`, `app/Http/Controllers/Public/*Controller.php` yang memfilter `'published'`, `app/Console/Commands/GenerateSitemap.php`.
- **Implementation:**
  1. Backed enum string: `Draft='draft'`, `PendingReview='pending_review'`, `Published='published'`, `Archived='archived'` + `label()` berbahasa Indonesia.
  2. Cast `status` di `Article` ke enum. Ganti literal status di semua query & `ArticleWorkflow` dengan enum (`->value` bila perlu string). Cari dengan `grep -rn "'published'\|'draft'\|'pending'\|'archived'" app`.
  3. Dashboard: hitungan `pending` memakai `ArticleStatus::PendingReview`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(artikel): enum status dan perbaiki hitungan dashboard"`
- **DoD:** tidak ada literal `'pending'` untuk status artikel.

## [Sesi 2-05] - Toggle `artikel_ai_enabled`
- **Scope:** `app/Http/Middleware/EnsureAiEnabled.php` (baru), `routes/web.php` (grup `ai`), `resources/js/Components/Editor/TipTapEditor.tsx`, `resources/js/Pages/Admin/Artikel/Form.tsx`, `Jurusan/Edit.tsx`, `KontenHalaman/Edit.tsx`.
- **Implementation:**
  1. Middleware: bila `!Pengaturan::bool('artikel_ai_enabled', true)` → JSON 403 "Fitur AI dinonaktifkan oleh admin." Pasang di grup rute `admin/ai`.
  2. Frontend: AiToolbar/AiBubble/AiPanel tidak dirender bila `pengaturan.artikel_ai_enabled` false (satu prop `aiEnabled` di TipTapEditor).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(pengaturan): toggle AI berefek di server dan editor"`
- **DoD:** toggle mati → rute AI 403 & toolbar hilang (cek manual pemilik).

## [Sesi 2-06] - Toggle `multibahasa_enabled`
- **Scope:** `app/Http/Middleware/SetLocale.php`, `resources/js/Components/Layout/Navbar.tsx`, `resources/js/Layouts/PublicLayout.tsx`, `resources/js/Pages/Admin/Artikel/Form.tsx`.
- **Implementation:**
  1. SetLocale: bila toggle mati → paksa locale `id`, abaikan `?lang=` dan session.
  2. Sembunyikan `LanguageToggle` dan tag `hreflang` EN; Form artikel menyembunyikan tab/isian EN.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(pengaturan): toggle multibahasa berefek"`
- **DoD:** toggle mati → hanya Bahasa Indonesia tampil.

## [Sesi 2-07] - Toggle `ai_translate_auto`
- **Scope:** `app/Jobs/TranslateArticle.php` (baru), `app/Http/Controllers/Admin/ArtikelController.php`, `app/Services/AiService.php` (baca), `app/Jobs/ProcessAiJob.php` (baca sebagai pola).
- **Implementation:**
  1. Job queue `ai`: ambil terjemahan `id`, panggil `AiService::translateContent([...], 'en')` (cek signature & bentuk return di file), simpan `locale=en` dengan `ai_translated=true`, `reviewed=false`, konten lewat `HtmlSanitizer::clean`. Catat ke `AiJob` mengikuti pola `ProcessAiJob`.
  2. Dispatch di `store`/`update`/`publish` ketika status jadi `published`, toggle aktif, `artikel_ai_enabled` aktif, dan terjemahan EN belum ada.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(artikel): terjemahan otomatis EN saat publish"`
- **DoD:** job lulus PHPStan; tidak ada pemanggilan API AI di luar antrean.

## [Sesi 2-08] - Google Analytics dari Pengaturan
- **Scope:** `resources/views/app.blade.php`, `app/Http/Middleware/ContentSecurityPolicy.php`.
- **Implementation:**
  1. Bila `seo_google_analytics` terisi (format `G-XXXX` divalidasi di StorePengaturanRequest): sisipkan skrip gtag dengan atribut `nonce`.
  2. CSP: tambahkan `https://www.googletagmanager.com` (script-src) dan `https://*.google-analytics.com` (connect-src, img-src) **hanya** bila ID terisi.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(seo): sisipkan google analytics dari pengaturan"`
- **DoD:** ID kosong → tidak ada skrip GA di HTML.

## [Sesi 2-09] - Lengkapi DatabaseSeeder & Hapus Placeholder Eksternal
- **Scope:** `database/seeders/DatabaseSeeder.php`, `app/Http/Controllers/Public/BerandaController.php`, file lain hasil `grep -rn picsum app resources`, `public/images/placeholder-artikel.svg` (baru).
- **Implementation:**
  1. Urutan seeder sesuai AGENTS.md §12 (11 seeder). Perbarui §12 bila sudah sama.
  2. Buat SVG placeholder sederhana (latar `primary-50`, ikon garis, tanpa teks). Ganti URL picsum dengan `asset('images/placeholder-artikel.svg')`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix: lengkapi DatabaseSeeder dan ganti placeholder eksternal"`
- **DoD:** grep picsum kosong.

## [Sesi 2-10] - Pencarian Lengkap
- **Scope:** `app/Models/Pengumuman.php`, `app/Http/Controllers/Public/PencarianController.php`, `resources/js/Pages/Public/Pencarian.tsx`, `resources/js/types/index.ts`.
- **Implementation:**
  1. Tambah scope `scopeAktif()` di `Pengumuman` sesuai BR-003 (cek scope yang sudah ada dulu).
  2. Pencarian: tambah grup `pengumuman` (aktif) dan `agenda` (`is_active`) dengan pola query & highlight yang sama seperti artikel; endpoint `cepat` ikut.
  3. Halaman hasil menampilkan grup baru; tipe diperbarui. URL detail pengumuman memakai `#` sementara (halaman detail dibuat Phase 3) — tulis di laporan.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(pencarian): sertakan pengumuman dan agenda"`
- **DoD:** dua grup baru muncul di props halaman pencarian.

## [Sesi 2-11] - Sitemap Lengkap
- **Scope:** `app/Console/Commands/GenerateSitemap.php`.
- **Implementation:**
  1. Tambah `/berita`, `/agenda`, setiap `/agenda/{slug}` aktif; pakai alternate hreflang `id`/`en` dengan pola URL yang dipakai `PublicLayout` (`?lang=`).
  2. Artikel hanya yang `published` dan `published_at <= now()`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(seo): sitemap memuat berita dan agenda"`
- **DoD:** kode lulus PHPStan.

## [Sesi 2-12] - FormRequest (1): Galeri & Pengumuman
- **Scope:** `app/Http/Requests/Admin/{Store,Update}GaleriRequest.php`, `{Store,Update}PengumumanRequest.php`, `UploadFotoGaleriRequest.php`; controller terkait.
- **Implementation:**
  1. Salin rules inline **persis** ke FormRequest; `authorize()` memakai Policy Phase 1.
  2. Controller memakai `$request->validated()`; hapus `$request->validate([...])`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(validasi): formrequest galeri dan pengumuman"`
- **DoD:** tidak ada `validate([` di dua controller.

## [Sesi 2-13] - FormRequest (2): Jurusan, Konten Halaman, Media Upload
- **Scope:** `UpdateJurusanRequest.php`, `UpdateKontenHalamanRequest.php`, `UploadMediaRequest.php`; `Admin/JurusanController.php`, `KontenHalamanController.php`, `MediaUploadController.php`.
- **Implementation:** sama dengan Sesi 2-12 (rules identik, `authorize()` sesuai akses di AGENTS.md §4).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(validasi): formrequest jurusan, konten halaman, media"`
- **DoD:** tidak ada `validate([` di tiga controller.

## [Sesi 2-14] - FormRequest (3): Pengguna, Pesan, Statistik
- **Scope:** `{Store,Update}PenggunaRequest.php`, `BulkArsipPesanRequest.php`, `{Update,Reorder}StatistikRequest.php`; controller terkait.
- **Implementation:** sama dengan Sesi 2-12.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(validasi): formrequest pengguna, pesan, statistik"`
- **DoD:** tidak ada `validate([` di tiga controller.

## [Sesi 2-15] - FormRequest (4): Struktur, Tautan, Pencarian, Auth
- **Scope:** `{Store,Update,Reorder}StrukturOrganisasiRequest.php`, `{Store,Update,Reorder}TautanRequest.php`, `app/Http/Requests/Public/PencarianRequest.php`, `app/Http/Requests/Auth/{ForgotPassword,ResetPassword}Request.php`; controller terkait.
- **Implementation:** sama dengan Sesi 2-12.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(validasi): formrequest struktur, tautan, pencarian, auth"`
- **DoD:** grep `validate([` di `app/Http/Controllers` kosong.

## [Sesi 2-16] - Resource (1): Galeri, Pengumuman, Pengguna, Tautan
- **Scope:** `app/Http/Resources/Admin/{Galeri,Pengumuman,Pengguna,Tautan}Resource.php`; controller admin terkait.
- **Implementation:**
  1. `toArray()` mengembalikan **bentuk array yang sama** dengan yang sekarang dikirim controller (salin dari `map()`/array manual). Props React tidak berubah.
  2. Controller memakai `XxxResource::collection(...)` / `new XxxResource(...)`. Bila pagination, pastikan struktur `data/links/meta` sama dengan yang dibaca halaman (cek komponen `Pagination`).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(resource): resource galeri, pengumuman, pengguna, tautan"`
- **DoD:** tsc lulus tanpa mengubah props halaman.

## [Sesi 2-17] - Resource (2): Struktur, Statistik, Pesan, Notifikasi
- **Scope:** `app/Http/Resources/Admin/{StrukturOrganisasi,Statistik,PesanKontak,NotifikasiAdmin}Resource.php`; controller terkait.
- **Implementation:** sama dengan Sesi 2-16.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(resource): resource struktur, statistik, pesan, notifikasi"`
- **DoD:** tsc lulus.

## Aturan Bersama Sesi 2-18 s.d. 2-25 (Hex → Token)
Peta hex → token Tailwind (dari `resources/css/app.css` `@theme`): `#001f4d`→`primary-900`, `#002d6b`→`primary-800`, `#003580`→`primary-700`, `#003f87`→`primary-600`, `#0050a8`→`primary-500`, `#1a6cc4`→`primary-400`, `#eef5fc`→`primary-50`, `#8a6a1c`→`gold-700`, `#a8821f`→`gold-600`, `#c9a84c`→`gold-500`, `#d9bc78`→`gold-400`, `#fdf7e8`→`gold-100`, `#111111`→`neutral-900`, `#1c1c1e`→`neutral-800`, `#636366`→`neutral-500`, `#8e8e93`→`neutral-400`, `#d1d1d6`→`neutral-200`, `#e5e5ea`→`neutral-100`, `#f2f2f7`→`neutral-50`, `#ffffff`/`#fff`→`white`. Contoh: `bg-[#c9a84c]` → `bg-gold-500`, `hover:text-[#003f87]` → `hover:text-primary-600`, modifier opacity dipertahankan (`bg-[#003f87]/10` → `bg-primary-600/10`).
Hex yang **tidak** ada di peta: tambahkan token bernama semantik di blok `@theme` `app.css` dengan **nilai yang sama** (tampilan tidak berubah), lalu pakai token itu; daftar token baru wajib ditulis di laporan. Nilai warna dinamis dari data (mis. `category.color`, `agenda.warna`) tidak termasuk.

## [Sesi 2-18] - Hex → Token (1): UI Primitif & Error
- **Scope:** `resources/js/Components/UI/*.tsx`, `resources/js/Pages/Errors/*.tsx`, `resources/css/app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(ui): ganti hex dengan token di komponen UI dan halaman error"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-19] - Hex → Token (2): Admin Topbar & Editor
- **Scope:** `resources/js/Components/Admin/AdminTopbar.tsx`, `resources/js/Components/Editor/*.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(admin): ganti hex dengan token di topbar dan editor"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-20] - Hex → Token (3): Navbar, Footer, Portal
- **Scope:** `resources/js/Components/Layout/Navbar.tsx`, `Footer.tsx`, `resources/js/Pages/Portal.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(layout): ganti hex dengan token di navbar, footer, portal"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-21] - Hex → Token (4): Halaman Admin
- **Scope:** `resources/js/Pages/Admin/**/*.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(admin): ganti hex dengan token di halaman admin"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-22] - Hex → Token (5): Halaman Auth
- **Scope:** `resources/js/Pages/Auth/*.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(auth): ganti hex dengan token di halaman auth"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-23] - Hex → Token (6): Beranda, Berita, Galeri, Agenda
- **Scope:** `resources/js/Pages/Public/{Beranda,Galeri,Agenda,AgendaDetail}.tsx`, `resources/js/Pages/Public/Berita/*.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(publik): ganti hex dengan token di beranda, berita, galeri, agenda"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-24] - Hex → Token (7): Jurusan, Pencarian, Tautan
- **Scope:** `resources/js/Pages/Public/Jurusan/*.tsx`, `Pencarian.tsx`, `Tautan.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(publik): ganti hex dengan token di jurusan, pencarian, tautan"`
- **DoD:** grep hex kosong di scope.

## [Sesi 2-25] - Hex → Token (8): Kontak & Tentang
- **Scope:** `resources/js/Pages/Public/Kontak.tsx`, `Tentang.tsx`, `app.css`.
- **Implementation:** terapkan Aturan Bersama (±145 kemunculan).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "style(publik): ganti hex dengan token di kontak dan tentang"`
- **DoD:** grep hex di seluruh `resources/js` kosong.

## [Sesi 2-26] - Penutup Phase 2
- **Scope:** `AGENTS.md` (§12, §14, §5 bila perlu), `README.md`, `public/build`.
- **Implementation:**
  1. Perbarui dokumentasi: seeder lengkap, pencarian mencakup Pengumuman & Agenda, toggle Pengaturan berefek, enum status.
  2. `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-2): perbarui dokumentasi dan build aset"`
- **DoD:** semua checklist DoD Phase 2 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 2-01 | Perbaiki pembacaan pengaturan |
| 2-02 | Satukan key fitur |
| 2-03 | Tombol daftar ke `spmb_url` |
| 2-04 | Enum status artikel |
| 2-05 | Toggle AI |
| 2-06 | Toggle multibahasa |
| 2-07 | Toggle terjemah otomatis |
| 2-08 | Google Analytics |
| 2-09 | Seeder lengkap & placeholder lokal |
| 2-10 | Pencarian lengkap |
| 2-11 | Sitemap lengkap |
| 2-12 – 2-15 | FormRequest (4 sesi) |
| 2-16 – 2-17 | Resource (2 sesi) |
| 2-18 – 2-25 | Hex → token (8 sesi) |
| 2-26 | Penutup phase |
