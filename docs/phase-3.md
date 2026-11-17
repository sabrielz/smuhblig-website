# Phase 3 — Melengkapi CMS Inti

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
8. **Pola UI** — pakai `Components/UI`, preset `lib/motion.ts`, token `app.css`. Halaman publik baru mengikuti pola `Public/Agenda.tsx` & `Public/Berita/Index.tsx` (hero halaman, breadcrumb, grid kartu, `PublicLayout`). Teks publik dua bahasa (ID/EN).
9. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** semua fitur yang dijanjikan README/AGENTS.md benar-benar ada: pengumuman publik, kategori, tag, profil pengguna, detail album, pratinjau, jadwal publikasi.
- **Syarat awal:** DoD Phase 2 lulus. BR-003 (pengumuman aktif) tertulis di AGENTS.md §17.
- **Kondisi awal:** Pengumuman hanya di admin; Kategori hanya lewat `CategorySeeder`; `spatie/laravel-tags` terpasang tetapi tidak dipakai; tidak ada halaman profil pengguna; galeri publik satu halaman tanpa URL album; Pengumuman & Agenda memakai textarea; tidak ada pratinjau draft.
- **Kondisi akhir:** `/pengumuman` + detail + banner urgent di Beranda; CRUD Kategori; Tag di artikel + filter berita + kelola tag; Profil Saya; `/galeri/{slug}`; artikel terkait & tombol bagikan; unduh `.ics`; TipTap di Pengumuman & Agenda; pratinjau draft; artikel terjadwal tersembunyi dari publik.
- **Di luar cakupan phase:** modul konten baru (Phase 4–5); notifikasi alur review (Phase 6).

### DoD Phase 3
- [ ] Rute `pengumuman.index`, `pengumuman.show`, `galeri.show`, `agenda.ics`, `admin.kategori.*`, `admin.tag.*`, `admin.profil.*`, `admin.artikel.preview` terdaftar (pemilik cek `php artisan route:list`).
- [ ] Semua query publik artikel memakai scope `terbit()`.
- [ ] Navbar memuat Pengumuman; sidebar memuat Kategori, Tag, Profil Saya.
- [ ] README & AGENTS.md tidak memuat klaim fitur yang belum ada.
- [ ] `npm run verify` lulus; `npm run build` sukses.

---

## [Sesi 3-01] - Scope Terbit & Aktif
- **Scope:** `app/Models/Article.php`, `app/Models/Pengumuman.php`, `app/Http/Controllers/Public/{Beranda,Berita,Pencarian}Controller.php`, `app/Console/Commands/GenerateSitemap.php`.
- **Implementation:**
  1. `Article::scopeTerbit()` = status `published` **dan** `published_at` tidak null **dan** `<= now()`.
  2. Ganti semua filter publik artikel dengan `->terbit()` (grep `ArticleStatus::Published` di `app/Http/Controllers/Public` & sitemap).
  3. Pastikan `Pengumuman::scopeAktif()` (Phase 2) sesuai BR-003.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(publik): scope terbit artikel untuk jadwal publikasi"`
- **DoD:** tidak ada filter status published manual di controller publik.

## [Sesi 3-02] - Pengumuman Publik: Backend
- **Scope:** `app/Http/Controllers/Public/PengumumanController.php` (baru), `app/Http/Resources/Public/PengumumanResource.php` (baru), `routes/web.php`, `app/Console/Commands/GenerateSitemap.php`, `PencarianController.php`.
- **Implementation:**
  1. `index` (filter `tipe` opsional, paginate 9, urut `tanggal_mulai` desc lalu `created_at` desc) & `show` (404 bila tidak aktif). Terjemahan `judul`, `konten` per locale dengan fallback `id` mengikuti pola `AgendaPublikController`.
  2. SEOTools di kedua aksi (pola controller publik lain). `Cache::remember` untuk index per locale+filter, TTL 600 detik.
  3. Rute `GET /pengumuman` (`pengumuman.index`), `GET /pengumuman/{pengumuman:slug}` (`pengumuman.show`).
  4. Sitemap & pencarian: URL detail pengumuman memakai `route('pengumuman.show', ...)` (ganti `#` dari Phase 2).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(pengumuman): controller dan rute publik"`
- **DoD:** controller lulus PHPStan.

## [Sesi 3-03] - Pengumuman Publik: Halaman
- **Scope:** `resources/js/Pages/Public/Pengumuman/Index.tsx`, `Show.tsx` (baru), `resources/js/types/index.ts`, `resources/js/Components/Layout/Navbar.tsx`.
- **Implementation:**
  1. Index: hero halaman, chip filter tipe (info/penting/urgent → `Badge` varian yang ada), grid kartu, `Pagination`.
  2. Show: judul, badge tipe, rentang tanggal (`formatDate` dari `lib/utils`), konten HTML (render sama seperti `Berita/Show.tsx`).
  3. Navbar: item Pengumuman (`{ id: 'Pengumuman', en: 'Announcements' }`).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(pengumuman): halaman publik daftar dan detail"`
- **DoD:** tsc lulus; teks ID/EN.

## [Sesi 3-04] - Banner Pengumuman Urgent
- **Scope:** `app/Http/Controllers/Public/BerandaController.php`, `resources/js/Components/UI/AnnouncementBanner.tsx` (baru), `resources/js/Pages/Public/Beranda.tsx`.
- **Implementation:**
  1. Controller: prop `pengumumanUrgent` = satu pengumuman aktif bertipe `urgent` terbaru atau `null`.
  2. Banner di atas hero: judul + tautan detail + tombol tutup; status tutup disimpan di `sessionStorage` (`try/catch`) dengan key berisi id pengumuman.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(beranda): banner pengumuman urgent"`
- **DoD:** banner tidak dirender bila prop null.

## [Sesi 3-05] - Kategori: Backend
- **Scope:** `app/Http/Controllers/Admin/KategoriController.php`, `app/Http/Requests/Admin/{Store,Update}KategoriRequest.php`, `app/Http/Resources/Admin/KategoriResource.php`, `app/Policies/CategoryPolicy.php`, `app/Support/CategoryColors.php` (baru), `routes/web.php`.
- **Implementation:**
  1. Baca `Category`, `CategoryTranslation`, dan migrasinya (kolom `color`, `slug`, kolom translasi).
  2. `CategoryColors::all()` = daftar terbatas warna dari token palet (`primary-600`, `primary-400`, `gold-500`, `gold-700`, `neutral-700`, dst.) dalam bentuk hex sesuai `app.css` (disimpan di DB sebagai hex karena kolom `color` sudah ada).
  3. CRUD tanpa `show`; nama ID wajib, EN opsional; `destroy` ditolak dengan pesan bila `articles()->exists()`.
  4. Policy: Editor & Admin. Rute resource `admin.kategori` (`/admin/kategori`).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(kategori): CRUD backend kategori artikel"`
- **DoD:** destroy kategori terpakai ditolak di kode.

## [Sesi 3-06] - Kategori: Halaman Admin
- **Scope:** `resources/js/Pages/Admin/Kategori/Index.tsx`, `Form.tsx` (baru), `resources/js/Components/Admin/AdminSidebar.tsx`, `types/index.ts`.
- **Implementation:**
  1. Index pola `Admin/Tautan/Index.tsx` (Table, ConfirmDialog). Form: input nama ID/EN, pilihan warna dari `CategoryColors` (prop dari controller), slug otomatis (tampilkan saja).
  2. Sidebar grup Konten: "Kategori" (ikon Lucide `Tags` atau `FolderTree`), hanya untuk Editor/Admin.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(kategori): halaman admin kategori"`
- **DoD:** tsc lulus.

## [Sesi 3-07] - Tag: Backend Artikel
- **Scope:** `app/Models/Article.php`, `StoreArtikelRequest.php`, `UpdateArtikelRequest.php`, `ArtikelController.php`, `ArtikelResource.php`, `app/Http/Controllers/Public/BeritaController.php`.
- **Implementation:**
  1. Cek apakah `Article` sudah `use HasTags`; bila belum, tambahkan (`Spatie\Tags\HasTags`). Cek versi paket di `composer.lock` dan baca `vendor/spatie/laravel-tags` untuk API `syncTags`/`withAnyTags`.
  2. Request: `tags` `array|max:10`, `tags.*` `string|max:40`. Controller `syncTags` di store/update. Resource menyertakan `tags` (nama).
  3. Berita publik: filter `?tag=<slug/nama>` via `withAnyTags`; kirim daftar tag di detail.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(tag): tag artikel dan filter berita"`
- **DoD:** lulus PHPStan.

## [Sesi 3-08] - Tag: UI Artikel & Berita
- **Scope:** `resources/js/Components/UI/TagInput.tsx` (baru), `TagInput.test.tsx` (baru), `Pages/Admin/Artikel/Form.tsx`, `Pages/Public/Berita/Index.tsx`, `Pages/Public/Berita/Show.tsx`, `types/index.ts`.
- **Implementation:**
  1. `TagInput`: chip input (Enter/koma menambah, Backspace menghapus terakhir, tanpa duplikat, maks 10). Vitest: tambah, cegah duplikat, hapus.
  2. Form artikel memakai TagInput. Berita Index menampilkan filter tag aktif + tombol hapus filter. Show menampilkan tag sebagai `Link` ke `/berita?tag=`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(tag): input tag dan tampilan tag di berita"`
- **DoD:** vitest TagInput lulus.

## [Sesi 3-09] - Tag: Kelola Tag
- **Scope:** `app/Http/Controllers/Admin/TagController.php`, `app/Http/Requests/Admin/MergeTagRequest.php`, `routes/web.php`, `resources/js/Pages/Admin/Tag/Index.tsx`, `AdminSidebar.tsx`.
- **Implementation:**
  1. `index` (nama + jumlah artikel), `merge` (pindahkan artikel dari tag A ke B lalu hapus A, dalam transaksi), `destroy` (lepas dari artikel lalu hapus). Editor & Admin.
  2. Halaman: tabel tag, aksi Gabung (Modal pilih tag tujuan) dan Hapus (ConfirmDialog). Sidebar: "Tag".
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(tag): halaman kelola tag"`
- **DoD:** merge memakai `DB::transaction`.

## [Sesi 3-10] - Berita: Terkait & Bagikan
- **Scope:** `BeritaController.php` (`show`), `resources/js/Pages/Public/Berita/Show.tsx`, `resources/js/Components/UI/ShareButtons.tsx` (baru).
- **Implementation:**
  1. Prop `terkait`: maks 3 artikel `terbit()` berkategori sama atau berbagi tag, bukan artikel ini, terbaru dulu.
  2. ShareButtons: WhatsApp (`https://wa.me/?text=`), Facebook (`https://www.facebook.com/sharer/sharer.php?u=`), salin tautan (`navigator.clipboard` dengan fallback select). Tanpa skrip pihak ketiga.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(berita): artikel terkait dan tombol bagikan"`
- **DoD:** tanpa skrip eksternal baru.

## [Sesi 3-11] - Profil Saya: Backend
- **Scope:** `app/Http/Controllers/Admin/ProfilController.php`, `app/Http/Requests/Admin/{UpdateProfil,UpdatePassword}Request.php`, `routes/web.php`, `app/Models/User.php` (baca).
- **Implementation:**
  1. `edit`, `update` (nama; email unik dan wajib `current_password` bila berubah; avatar via MediaLibrary collection yang dipakai `User` — cek dulu), `updatePassword` (`current_password`, `Password::defaults()`, `confirmed`), `logoutOtherDevices` (`Auth::logoutOtherDevices`).
  2. Rute `admin.profil.edit|update|password|logout-others`, semua peran CMS.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(profil): backend profil saya"`
- **DoD:** lulus PHPStan.

## [Sesi 3-12] - Profil Saya: Halaman
- **Scope:** `resources/js/Pages/Admin/Profil/Edit.tsx` (baru), `AdminTopbar.tsx`, `AdminSidebar.tsx`, `types/index.ts`.
- **Implementation:**
  1. Tiga kartu: Data diri (nama, email, avatar via `ImageUpload`), Ganti password, Keluar dari perangkat lain (konfirmasi password).
  2. Topbar menu pengguna: "Profil Saya". Sidebar grup Sistem: "Profil Saya" untuk semua peran.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(profil): halaman profil saya"`
- **DoD:** tsc lulus.

## [Sesi 3-13] - Detail Album Galeri
- **Scope:** `app/Http/Controllers/Public/GaleriController.php`, `routes/web.php`, `resources/js/Pages/Public/Galeri.tsx`, `resources/js/Pages/Public/GaleriDetail.tsx` (baru), `GenerateSitemap.php`.
- **Implementation:**
  1. `show(Galeri $galeri)` via slug, foto dari media collection yang sama dengan `index`; SEO + `og:image` foto pertama.
  2. Rute `GET /galeri/{galeri:slug}` (`galeri.show`).
  3. GaleriDetail: grid foto + lightbox; pindahkan logika lightbox dari `Galeri.tsx` ke `Components/UI/Lightbox.tsx` bila bisa dipakai bersama (keduanya memakai komponen yang sama).
  4. `Galeri.tsx`: kartu album menautkan ke detail. Sitemap: tambah album.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(galeri): halaman detail album"`
- **DoD:** tidak ada duplikasi kode lightbox.

## [Sesi 3-14] - Agenda `.ics`
- **Scope:** `app/Http/Controllers/Public/AgendaPublikController.php`, `routes/web.php`, `resources/js/Pages/Public/AgendaDetail.tsx`.
- **Implementation:**
  1. `ics(Agenda $agenda)`: respons `text/calendar; charset=utf-8`, VEVENT all-day (`DTSTART;VALUE=DATE`, `DTEND` = selesai+1 hari), `SUMMARY`, `DESCRIPTION` (strip tag, escape koma/titik-koma), `UID` `agenda-{id}@smkmuhbligo.sch.id`. Baris diakhiri CRLF.
  2. Rute `GET /agenda/{agenda:slug}/ics` (`agenda.ics`). Tombol "Tambah ke kalender" di detail (`<a>` biasa karena unduhan file).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(agenda): unduh agenda sebagai ics"`
- **DoD:** lulus PHPStan.

## [Sesi 3-15] - TipTap untuk Pengumuman & Agenda
- **Scope:** `resources/js/Pages/Admin/Pengumuman/Form.tsx`, `resources/js/Pages/Admin/Agenda/Form.tsx`, `PengumumanController.php`, `AgendaController.php` (atau FormRequest-nya).
- **Implementation:**
  1. Baca migrasi translasi (pengumuman: `konten`; agenda: cek nama kolom deskripsi) lalu ganti textarea dengan `TipTapEditor` (`aiEnabled` mengikuti pengaturan).
  2. Backend: sanitasi `HtmlSanitizer::clean` sebelum simpan untuk kolom tersebut (ID & EN).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(editor): tiptap untuk pengumuman dan agenda"`
- **DoD:** setiap simpan konten melewati HtmlSanitizer.

## [Sesi 3-16] - Pratinjau Draft
- **Scope:** `app/Http/Resources/Public/BeritaDetailResource.php` (baru), `BeritaController.php`, `ArtikelController.php`, `PengumumanController.php` (admin), `routes/web.php`, `Pages/Public/Berita/Show.tsx`, `Pages/Public/Pengumuman/Show.tsx`, `Pages/Admin/Artikel/Form.tsx`, `Pages/Admin/Pengumuman/Form.tsx`.
- **Implementation:**
  1. Pindahkan pembentukan props detail berita di `BeritaController@show` ke `BeritaDetailResource` (bentuk props tetap sama); pakai di publik dan di pratinjau.
  2. `admin.artikel.preview` & `admin.pengumuman.preview`: render halaman publik yang sama dengan prop `isPreview: true`; Policy `update`.
  3. Halaman Show menampilkan pita "Pratinjau — belum terbit" bila `isPreview`. Tombol "Pratinjau" di kedua form (buka tab baru).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(cms): pratinjau draft artikel dan pengumuman"`
- **DoD:** props publik berita tidak berubah (tsc lulus).

## [Sesi 3-17] - Penutup Phase 3
- **Scope:** `AGENTS.md` (§4 rute, §5, §14), `README.md`, `public/build`.
- **Implementation:**
  1. Perbarui tabel rute publik/admin dan daftar fitur; hapus catatan "tags belum dipakai".
  2. `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-3): perbarui dokumentasi dan build aset"`
- **DoD:** semua checklist DoD Phase 3 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 3-01 | Scope terbit & aktif |
| 3-02 – 3-04 | Pengumuman publik (backend, halaman, banner) |
| 3-05 – 3-06 | Kategori (backend, halaman) |
| 3-07 – 3-09 | Tag (backend, UI, kelola) |
| 3-10 | Berita terkait & bagikan |
| 3-11 – 3-12 | Profil Saya (backend, halaman) |
| 3-13 | Detail album galeri |
| 3-14 | Agenda `.ics` |
| 3-15 | TipTap Pengumuman & Agenda |
| 3-16 | Pratinjau draft |
| 3-17 | Penutup phase |
