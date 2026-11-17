# Phase 1 — Keamanan & Otorisasi

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
8. **Cakupan** — AGENTS.md §16. **Aturan bisnis** — AGENTS.md §17 (BR-xxx).
9. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** menegakkan hak akses per peran di server dan menutup celah keamanan dari audit sebelum fitur baru ditambahkan.
- **Syarat awal:** DoD Phase 0 lulus; `BR-001` dan `BR-002` di AGENTS.md §17 sudah berstatus **disetujui pemilik** (bila masih "menunggu", berhenti dan minta persetujuan).
- **Kondisi awal:** semua peran CMS setara di modul konten (`authorize()` FormRequest = `true`, tidak ada Policy); permission di `RoleSeeder` tidak pernah dicek; CSP dikomentari di `bootstrap/app.php`; rute `GET /logout` aktif; `/sitemap.xml` menjalankan Artisan setiap request; `$e->getMessage()` bocor ke flash di `ArtikelController` dan `PengaturanController`; `PengaturanController@store` menyimpan **semua** key request tanpa validasi; password admin tertulis di `AdminUserSeeder`.
- **Kondisi akhir:** Policy untuk Artikel, Galeri, Pengumuman, Agenda ditegakkan; status artikel dibatasi per peran; UI menyembunyikan aksi tanpa izin; CSP aktif; logout hanya POST; sitemap statis terjadwal; error umum ke pengguna; Pengaturan ber-whitelist; seeder tanpa rahasia; unggahan tervalidasi sesuai BR-004.
- **Di luar cakupan phase:** fitur baru, perubahan desain, refactor validasi modul lain (Phase 2).

### DoD Phase 1
- [ ] `grep -rn "return true;" app/Http/Requests/Admin/StoreArtikelRequest.php app/Http/Requests/Admin/UpdateArtikelRequest.php app/Http/Requests/Admin/StoreAgendaRequest.php` → kosong.
- [ ] `grep -rn "getMessage()" app/Http/Controllers` → hanya di dalam `Log::`.
- [ ] `grep -n "Route::get('/logout'" routes/web.php` → kosong; tidak ada rute dinamis `/sitemap.xml`.
- [ ] `ContentSecurityPolicy` terdaftar di `bootstrap/app.php`.
- [ ] Checklist uji manual matriks peran (Sesi 1-10) diisi pemilik.
- [ ] `npm run verify` lulus pada commit terakhir.

---

## [Sesi 1-01] - Helper Pengaturan & ArticleWorkflow
- **Scope:** `app/Models/Pengaturan.php`, `app/Support/ArticleWorkflow.php` (baru).
- **Implementation:**
  1. Baca `app/Models/Pengaturan.php`. Bila belum ada method pembaca tunggal, tambahkan `public static function get(string $key, mixed $default = null): mixed` yang memakai sumber/cache yang sama dengan `getAllSettings()`. Tambahkan `public static function bool(string $key, bool $default = false): bool` yang menerjemahkan `'true'/'1'/true` → `true`.
  2. `app/Support/ArticleWorkflow.php`: `public static function allowedStatuses(User $user, ?Article $article = null): array` sesuai BR-002 (Author: `draft`, `pending_review`, plus `published` bila `!Pengaturan::bool('artikel_approval')` dan artikel milik sendiri/baru; Editor & Admin: keempat status). Pakai method role di `User` (`isAdmin`, `isEditor`, `isAuthor`) yang sudah ada.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(auth): helper pengaturan dan aturan transisi status artikel"`
- **DoD:** kedua method ada dan lulus PHPStan.

## [Sesi 1-02] - ArticlePolicy
- **Scope:** `app/Policies/ArticlePolicy.php` (baru).
- **Implementation:**
  1. Method: `viewAny`, `create` (semua peran CMS), `update` (Editor/Admin: selalu; Author: hanya `user_id` miliknya dan status `draft`/`pending_review`), `delete` (Editor/Admin), `publish` (Editor/Admin; Author hanya bila `in_array('published', ArticleWorkflow::allowedStatuses($user, $article))`), `markTranslationReviewed` (Editor/Admin).
  2. Pastikan nama kelas & namespace mengikuti konvensi auto-discovery Laravel 12 (`App\Policies\ArticlePolicy` untuk `App\Models\Article`). Bila `AppServiceProvider` perlu `Gate::policy`, tambahkan di sana.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(auth): tambah ArticlePolicy sesuai BR-001"`
- **DoD:** Policy lulus PHPStan.

## [Sesi 1-03] - Tegakkan Policy di Artikel
- **Scope:** `app/Http/Controllers/Admin/ArtikelController.php`, `app/Http/Requests/Admin/StoreArtikelRequest.php`, `app/Http/Requests/Admin/UpdateArtikelRequest.php`.
- **Implementation:**
  1. Controller: `Gate::authorize(...)` di `index` (viewAny), `edit`/`update` (update), `destroy` (delete), `publish` (publish), `markTranslationReviewed`. Base `Controller` Laravel 12 tidak punya trait `AuthorizesRequests` — gunakan facade `Gate`.
  2. `index`: Author hanya melihat artikel miliknya (`where('user_id', auth()->id())`) — sesuai BR-001.
  3. Store/Update Request: `authorize()` → `$this->user()->can('create', Article::class)` / `can('update', $this->route('artikel'))`; rule `status` → `Rule::in(ArticleWorkflow::allowedStatuses($this->user(), $this->route('artikel')))`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(artikel): tegakkan policy dan batas status per peran"`
- **DoD:** tidak ada `return true;` di kedua request; semua aksi controller memanggil `Gate::authorize`.

## [Sesi 1-04] - Policy Galeri, Pengumuman, Agenda
- **Scope:** `app/Policies/GaleriPolicy.php`, `PengumumanPolicy.php`, `AgendaPolicy.php` (baru); `app/Http/Controllers/Admin/GaleriController.php`, `PengumumanController.php`, `AgendaController.php`; `app/Http/Requests/Admin/StoreAgendaRequest.php`.
- **Implementation:**
  1. Ketiga Policy: `viewAny`, `create`, `update`, `delete` → `true` untuk Editor/Admin, `false` untuk Author (BR-001).
  2. Tiap aksi controller memanggil `Gate::authorize` dengan model/kelas yang sesuai (termasuk `uploadFoto`, `deleteFoto` di Galeri → `update` pada galeri terkait; baca method dulu untuk tahu model yang tersedia).
  3. `StoreAgendaRequest::authorize()` → cek Policy (`create` atau `update` tergantung ada/tidaknya route param).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(auth): policy galeri, pengumuman, agenda"`
- **DoD:** setiap method publik di tiga controller memanggil `Gate::authorize`.

## [Sesi 1-05] - Izin di UI
- **Scope:** `app/Http/Middleware/HandleInertiaRequests.php`, `resources/js/types/index.ts`, `resources/js/Components/Admin/AdminSidebar.tsx`, `resources/js/Pages/Admin/Artikel/Index.tsx`, `resources/js/Pages/Admin/Artikel/Form.tsx`.
- **Implementation:**
  1. Shared prop `auth.user.can`: `{ kelola_galeri, kelola_pengumuman, kelola_agenda, publish_artikel, hapus_artikel }` dihitung via `Gate`/Policy; tambah `artikel_status_options` = `ArticleWorkflow::allowedStatuses($user)`. Tipe di `types/index.ts`.
  2. Sidebar: sembunyikan Galeri, Pengumuman, Agenda bila `can` false.
  3. Artikel Index: sembunyikan tombol publish/hapus bila tidak diizinkan. Artikel Form: opsi status hanya dari `artikel_status_options`.
  4. Server tetap sumber kebenaran — UI hanya mengikuti.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(admin): UI mengikuti izin peran"`
- **DoD:** tipe baru tanpa `any`; tsc lulus.

## [Sesi 1-06] - Seeder Tanpa Rahasia & Telescope
- **Scope:** `database/seeders/AdminUserSeeder.php`, `.env.example`, `.env.production.example`, `config/telescope.php` (baca), `bootstrap/providers.php` (baca).
- **Implementation:**
  1. AdminUserSeeder: password dari `env('ADMIN_INITIAL_PASSWORD')`; bila kosong → `Str::password(16)`. Cetak password ke konsol **hanya** bila `app()->environment('local')`. Hapus literal password lama.
  2. `.env.example` & `.env.production.example`: tambah `ADMIN_INITIAL_PASSWORD=` (kosong) dan pastikan `TELESCOPE_ENABLED=false` di produksi.
  3. Pastikan `TelescopeServiceProvider` tidak terdaftar di `bootstrap/providers.php` dan `config/telescope.php` membaca `TELESCOPE_ENABLED`. Bila ternyata terdaftar → laporkan, jangan hapus paket.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(security): password admin dari env dan telescope nonaktif di produksi"`
- **DoD:** `grep -n "password = '" database/seeders/AdminUserSeeder.php` kosong.

## [Sesi 1-07] - Logout POST, Sitemap Statis, Error Aman
- **Scope:** `routes/web.php`, `routes/console.php`, `app/Jobs/GenerateSitemapJob.php` (baru), `app/Observers/ArticleObserver.php`, `app/Http/Controllers/Admin/ArtikelController.php`, `app/Http/Controllers/Admin/PengaturanController.php`.
- **Implementation:**
  1. Hapus `Route::get('/logout', ...)` (tombol keluar di sidebar sudah memakai `method="post"`; cek `AdminTopbar.tsx` juga).
  2. Hapus rute closure `/sitemap.xml`. `routes/console.php`: `Schedule::command('sitemap:generate')->dailyAt('01:00');`. `GenerateSitemapJob` (queued) memanggil `Artisan::call('sitemap:generate')`; dispatch dari `ArticleObserver` ketika status berubah ke/dari `published`.
  3. Ganti setiap `'... ' . $e->getMessage()` pada flash/JSON respons dengan pesan umum ("Terjadi kesalahan, silakan coba lagi.") + `Log::error('<konteks>', ['exception' => $e])`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(security): logout hanya POST, sitemap terjadwal, sembunyikan detail error"`
- **DoD:** tiga grep DoD phase terkait logout/sitemap/getMessage lulus.

## [Sesi 1-08] - Whitelist Pengaturan
- **Scope:** `app/Http/Requests/Admin/StorePengaturanRequest.php` (baru), `app/Http/Controllers/Admin/PengaturanController.php`.
- **Implementation:**
  1. Request berisi rules untuk **setiap** key di `database/seeders/PengaturanSeeder.php` (string/url/email/boolean/integer sesuai arti key), plus `site_logo_file` & `site_favicon_file` (`image|mimes:jpg,jpeg,png,webp,ico|max:2048`). `authorize()` → user admin.
  2. `store()` hanya menyimpan `$request->validated()` (kecuali file). Key di luar whitelist diabaikan.
  3. Jangan memperbaiki ketidakcocokan `app_logo`/`site_logo` di sini (Phase 2) — cukup catat di laporan bila terlihat.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(security): pengaturan hanya menyimpan key yang divalidasi"`
- **DoD:** `$request->except(` tidak lagi dipakai di `store()`.

## [Sesi 1-09] - Validasi Unggahan (BR-004)
- **Scope:** `app/Http/Controllers/Admin/MediaUploadController.php`, `GaleriController.php` (uploadFoto), `StrukturOrganisasiController.php`, `app/Http/Requests/Admin/StoreArtikelRequest.php`, `UpdateArtikelRequest.php`, `PengaturanController.php` (penyimpanan logo/favicon).
- **Implementation:**
  1. Semua rule gambar: `file|mimes:jpg,jpeg,png,webp|mimetypes:image/jpeg,image/png,image/webp|max:<BR-004>`.
  2. Penyimpanan langsung ke disk (logo/favicon, upload editor bila tidak lewat MediaLibrary): nama file `Str::uuid() . '.' . $file->extension()` via `storeAs`.
  3. Jangan memindahkan validasi inline ke FormRequest di sini (Phase 2) kecuali file request sudah ada.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "fix(security): validasi mime dan ukuran unggahan sesuai BR-004"`
- **DoD:** setiap endpoint unggah memiliki `mimetypes` dan `max`.

## [Sesi 1-10] - Aktifkan CSP
- **Scope:** `bootstrap/app.php`, `app/Http/Middleware/ContentSecurityPolicy.php`, `resources/views/app.blade.php`, `resources/js/Layouts/PublicLayout.tsx`, `config/app.php` (atau config baru `config/csp.php`).
- **Implementation:**
  1. Daftarkan kembali `ContentSecurityPolicy::class` di `$middleware->web(append: [...])` (hapus komentar).
  2. Tambahkan env `CSP_REPORT_ONLY` (default `true` untuk sesi ini): bila true, kirim header `Content-Security-Policy-Report-Only`.
  3. Di `buildCspHeader`: izinkan `fonts.googleapis.com` (style) & `fonts.gstatic.com` (font); di environment `local` izinkan origin Vite dev server (`http://localhost:5173`, `ws://localhost:5173`, dan `127.0.0.1` padanannya).
  4. `app.blade.php`: pastikan directive Ziggy (`@routes`) mendapat nonce. Baca signature di `vendor/tightenco/ziggy/src/BladeRouteGenerator.php` sebelum menulis — jangan menebak argumen.
  5. `PublicLayout.tsx`: `<script type="application/ld+json">` memakai `nonce={csp_nonce}` dari shared props.
  6. Tulis di laporan: daftar sumber eksternal yang masih dipakai (mis. `picsum.photos`) — dihapus di Phase 2.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(security): aktifkan CSP dengan mode report-only"`
- **DoD:** middleware terdaftar; header CSP muncul (pemilik cek di DevTools); `CSP_REPORT_ONLY=false` diset pemilik setelah konsol bersih.

## [Sesi 1-11] - Checklist Uji Manual Peran & Penutup Phase
- **Scope:** `AGENTS.md` §17 (lampiran checklist), `public/build` (aset).
- **Implementation:**
  1. Tambahkan di §17 tabel "Checklist uji manual BR-001" (baris aksi × kolom Author/Editor/Admin, hasil diisi pemilik) — agent tidak menjalankan pengujian.
  2. `npm run build` untuk memperbarui aset.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-1): checklist uji peran dan build aset"`
- **DoD:** checklist ada; build sukses.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 1-01 | Helper Pengaturan & ArticleWorkflow |
| 1-02 | ArticlePolicy |
| 1-03 | Tegakkan Policy di Artikel |
| 1-04 | Policy Galeri, Pengumuman, Agenda |
| 1-05 | Izin di UI |
| 1-06 | Seeder tanpa rahasia & Telescope |
| 1-07 | Logout POST, sitemap statis, error aman |
| 1-08 | Whitelist Pengaturan |
| 1-09 | Validasi unggahan |
| 1-10 | Aktifkan CSP |
| 1-11 | Checklist uji manual & penutup |
