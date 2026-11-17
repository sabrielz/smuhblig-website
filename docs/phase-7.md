# Phase 7 — Dwibahasa, SEO, Performa & Aksesibilitas

> Rangkaian `docs/phase-0.md` … `docs/phase-8.md`. Kerjakan sesi berurutan.

---

## Global Directives (wajib)

1. **AGENTS.md §0 menang.** Dilarang menulis/menjalankan test PHP. Boleh: Pint, PHPStan, ESLint, `tsc`, `npx vitest run`.
2. **Continuous Coding First** — tulis semua perubahan dulu; jangan lint per file.
3. **Single-Pass End Verification** — `npm run verify` sekali di akhir sesi.
4. **One-Liner Execution** — `npm run verify && git add -A && git commit -m "..."`.
5. **Zero Scope Creep** — tanpa riset web bila pola lokal ada, tanpa worktree, tanpa push/PR. Temuan lain → laporan.
6. **Anti-halusinasi** — baca file terkait sebelum mengubah; untuk API Inertia SSR/i18next baca tipe di `node_modules` versi terpasang. Bila kode berbeda dari instruksi → berhenti & laporkan.
7. **Tampilan tidak boleh berubah** pada sesi refactor/pindah teks; markup & kelas Tailwind tetap.
8. **Integritas** — tanpa `any`/`@ts-ignore`/hex JSX/inline style/TODO; preset `lib/motion.ts`.
9. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** situs cepat, ramah mesin pencari, dapat diakses semua orang, dan konsisten dalam dua bahasa.
- **Syarat awal:** DoD Phase 6 lulus (semua modul sudah ada); ADR-009 disetujui (usulan: teks UI **publik** memakai `react-i18next`; UI admin tetap Bahasa Indonesia).
- **Kondisi awal:** teks UI ditulis `locale === 'id' ? … : …` per komponen; `i18next` tidak dipakai; tanpa SSR (meta, JSON-LD, hreflang dirender JS); beberapa halaman > 700 baris; belum ada audit aksesibilitas/Lighthouse.
- **Kondisi akhir:** semua teks UI publik di `resources/js/locales/{id,en}.json`; skrip cek kelengkapan terjemahan di `verify`; Inertia SSR aktif dengan fallback; JSON-LD per jenis konten; gambar WebP responsif; cache publik dengan invalidasi; halaman besar dipecah < 300 baris; WCAG 2.1 AA; konfigurasi Lighthouse siap.
- **Di luar cakupan phase:** desain ulang; fitur baru.

### DoD Phase 7
- [x] `grep -rn "locale === 'id' ?" resources/js/Pages/Public resources/js/Components/Layout resources/js/Components/UI` → kosong.
- [x] `node scripts/check-i18n.mjs` lulus (dipanggil `verify`).
- [x] `npm run build` menghasilkan bundle SSR; pemilik mengonfirmasi view-source halaman publik memuat konten & meta.
- [x] Tidak ada file di `resources/js/Pages` > 300 baris untuk 5 halaman target.
- [ ] Pemilik menjalankan Lighthouse mobile (median 3 run) di staging: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90, SEO ≥ 95; LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- [x] `npm run verify` lulus.

---

## [Sesi 7-00] - ADR i18n [MANUAL PEMILIK]
- **Scope:** AGENTS.md §18.
- **Implementation:** tulis `ADR-009` (usulan di atas) sebagai *menunggu persetujuan*, lalu berhenti sampai pemilik menjawab.
- **Finish & Commit (Run at End):**
  `git add AGENTS.md && git commit -m "docs(agents): ADR-009 strategi i18n"`
- **DoD:** ADR-009 disetujui.

## [Sesi 7-01] - Fondasi i18n
- **Scope:** `resources/js/i18n.ts` (baru), `resources/js/locales/id.json`, `en.json` (baru), `resources/js/app.tsx`, `scripts/check-i18n.mjs` (baru), `scripts/verify.mjs`.
- **Implementation:**
  1. Inisialisasi `i18next` + `react-i18next` dengan resource JSON, `fallbackLng: 'id'`, `interpolation.escapeValue: false`.
  2. `app.tsx`: sinkronkan bahasa dengan shared prop `locale` setiap navigasi (`router.on('navigate', ...)` atau efek pada props — baca tipe Inertia yang terpasang).
  3. `check-i18n.mjs`: gagal bila kunci di `id.json` tidak ada di `en.json` atau sebaliknya, atau nilai kosong. Dipanggil dari `verify.mjs`.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(i18n): fondasi react-i18next dan cek kelengkapan terjemahan"`
- **DoD:** cek i18n berjalan di `verify`.

## [Sesi 7-02] - Teks i18n (1): Layout & UI
- **Scope:** `Components/Layout/{Navbar,Footer,NavDropdown}.tsx`, `Layouts/PublicLayout.tsx`, `Components/UI/*.tsx` yang memuat teks publik, `locales/*.json`.
- **Implementation:** ganti ternary/objek teks per locale dengan `t('layout.xxx')`; kunci berprefiks per area (`nav.*`, `footer.*`, `ui.*`). Teks diambil persis dari kode lama.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(i18n): teks layout dan komponen UI ke file terjemahan"`
- **DoD:** grep ternary locale kosong di scope.

## [Sesi 7-03] - Teks i18n (2): Beranda, Tentang, Kontak
- **Scope:** `Pages/Public/{Beranda,Tentang,Kontak}.tsx` (+ komponen section bila sudah dipecah), `locales/*.json`.
- **Implementation:** sama dengan Sesi 7-02 (prefiks `beranda.*`, `tentang.*`, `kontak.*`). Teks yang berasal dari CMS (`HalamanKonten`) tidak dipindah.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(i18n): teks beranda, tentang, kontak"`
- **DoD:** grep ternary locale kosong di scope.

## [Sesi 7-04] - Teks i18n (3): Berita, Pengumuman, Agenda, Galeri, Jurusan
- **Scope:** `Pages/Public/{Berita,Pengumuman,Jurusan}/*.tsx`, `Agenda.tsx`, `AgendaDetail.tsx`, `Galeri.tsx`, `GaleriDetail.tsx`, `locales/*.json`.
- **Implementation:** sama dengan Sesi 7-02.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(i18n): teks berita, pengumuman, agenda, galeri, jurusan"`
- **DoD:** grep ternary locale kosong di scope.

## [Sesi 7-05] - Teks i18n (4): Modul Profil & Informasi, Lainnya
- **Scope:** `Pages/Public/{Guru,Fasilitas,Ekstrakurikuler,Prestasi,Unduhan,Faq,Pencarian,Tautan}*`, `Pages/Portal.tsx`, `Pages/Errors/*.tsx`, `locales/*.json`.
- **Implementation:** sama dengan Sesi 7-02.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(i18n): teks modul profil, informasi, pencarian, error"`
- **DoD:** grep DoD Phase 7 baris pertama kosong.

## [Sesi 7-06] - Inertia SSR
- **Scope:** `resources/js/ssr.tsx` (baru), `vite.config.ts`, `package.json` (script `build`), `config/inertia.php`, `.env.example`, `deploy/supervisor/` (program SSR baru), `resources/views/app.blade.php`.
- **Implementation:**
  1. Entry SSR memakai `createServer` dari `@inertiajs/react/server` (cek path & signature di `node_modules/@inertiajs/react`), resolver halaman sama dengan `app.tsx`, Ziggy route helper tersedia di SSR.
  2. `vite.config.ts`: `laravel({ input: ..., ssr: 'resources/js/ssr.tsx' })`; `build`: `vite build && vite build --ssr`.
  3. `config/inertia.php`: `ssr.enabled` dari env `INERTIA_SSR_ENABLED` (default false di local), bundle `bootstrap/ssr/ssr.js` (sesuai output). Bila SSR mati, Inertia otomatis fallback ke render klien.
  4. Program Supervisor `php artisan inertia:start-ssr`. `.gitignore`: abaikan `bootstrap/ssr`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "feat(ssr): aktifkan inertia ssr dengan fallback"`
- **DoD:** `npm run build` menghasilkan bundle SSR tanpa error.

## [Sesi 7-07] - Guard Akses Browser untuk SSR
- **Scope:** semua file hasil `grep -rln "window\.\|document\.\|localStorage\|sessionStorage\|navigator\." resources/js`.
- **Implementation:** pindahkan akses API browser yang berjalan saat render ke `useEffect` / handler event, atau lindungi dengan `typeof window !== 'undefined'`. Jangan mengubah perilaku di browser.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "fix(ssr): akses api browser hanya di klien"`
- **DoD:** tidak ada akses API browser di badan render komponen.

## [Sesi 7-08] - SEO Terstruktur
- **Scope:** `Layouts/PublicLayout.tsx`, `app/Support/JsonLd.php` (baru), controller publik detail (Berita, Pengumuman, Agenda, Galeri, Jurusan, Prestasi, FAQ), `GenerateSitemap.php`.
- **Implementation:**
  1. `JsonLd`: builder `educationalOrganization()`, `newsArticle(Article)`, `event(Agenda)`, `faqPage(...)`, `breadcrumbList(array)`; controller mengirim prop `jsonLd`.
  2. SEOTools: `og:image` dari gambar konten (fallback logo `site_logo`), `canonical` absolut, hreflang memakai pola URL yang sama dengan sitemap.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(seo): json-ld per jenis konten, og image, canonical"`
- **DoD:** setiap halaman detail publik mengirim JSON-LD sesuai jenisnya.

## [Sesi 7-09] - Gambar Responsif
- **Scope:** model ber-media (`Article`, `Galeri`, `StrukturOrganisasi`, `User`, `Guru`, `Fasilitas`, `Ekstrakurikuler`, `Prestasi`, `Testimoni`, `Mitra`), Resource publik terkait, `Components/UI/ResponsiveImage.tsx` (baru), halaman publik pemakai gambar, `Pages/Public/Beranda.tsx`.
- **Implementation:**
  1. `registerMediaConversions`: `thumb` (400w) & `large` (1200w) format WebP, `->withResponsiveImages()` (baca API versi terpasang di vendor).
  2. Resource mengirim `src`, `srcset`, `alt`, `width`, `height`.
  3. `ResponsiveImage`: `loading="lazy"` default, `fetchpriority="high"` + tanpa lazy untuk gambar hero; Beranda menambahkan `<link rel="preload" as="image">` untuk hero via `Head`.
  4. Catat di laporan: perintah `php artisan media-library:regenerate` dijalankan pemilik di server.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "perf(gambar): konversi webp responsif dan lazy loading"`
- **DoD:** setiap `<img>` publik punya `width`/`height` atau rasio tetap (cegah CLS).

## [Sesi 7-10] - Cache Publik dengan Invalidasi
- **Scope:** controller publik, `app/Observers/PublicCacheObserver.php` (baru), `AppServiceProvider.php`.
- **Implementation:** `Cache::tags(['publik', '<modul>'])->remember(...)` per halaman (key memuat locale & query); observer `saved`/`deleted` pada model konten mem-flush tag modul + `publik:beranda`. Bila driver cache tidak mendukung tag (env local `array`/`file`), fallback ke `Cache::remember` biasa (pola di `KontenHalamanController`).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "perf(cache): cache publik bertag dengan invalidasi otomatis"`
- **DoD:** setiap model konten terdaftar di observer.

## [Sesi 7-11] - Pecah Halaman (1): Beranda
- **Scope:** `Pages/Public/Beranda.tsx`, `Components/Public/Beranda/*Section.tsx` (baru).
- **Implementation:** pindahkan setiap section (Hero, Statistik, Jurusan, Prestasi, Berita, Testimoni, Mitra, CTA, dst.) ke komponen sendiri dengan interface props bertipe. Markup & kelas identik.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(beranda): pecah menjadi komponen section"`
- **DoD:** `Beranda.tsx` < 300 baris.

## [Sesi 7-12] - Pecah Halaman (2): Kontak & Jurusan/Show
- **Scope:** `Pages/Public/Kontak.tsx`, `Pages/Public/Jurusan/Show.tsx`, `Components/Public/{Kontak,Jurusan}/*` (baru).
- **Implementation:** sama dengan Sesi 7-11.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(publik): pecah halaman kontak dan detail jurusan"`
- **DoD:** kedua file < 300 baris.

## [Sesi 7-13] - Pecah Halaman (3): Artikel/Form & KontenHalaman/Edit
- **Scope:** `Pages/Admin/Artikel/Form.tsx`, `Pages/Admin/KontenHalaman/Edit.tsx`, `Components/Admin/{Artikel,KontenHalaman}/*` (baru).
- **Implementation:** sama dengan Sesi 7-11 (state form tetap di halaman induk, panel sebagai komponen).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "refactor(admin): pecah form artikel dan editor konten halaman"`
- **DoD:** kedua file < 300 baris.

## [Sesi 7-14] - Aksesibilitas WCAG 2.1 AA
- **Scope:** `app.tsx`, `Navbar.tsx`, `Components/UI/{Lightbox,Modal,ConfirmDialog,Input,Select,Textarea}.tsx`, `Layouts/PublicLayout.tsx`, `Layouts/AdminLayout.tsx`.
- **Implementation:**
  1. `MotionConfig reducedMotion="user"` di root.
  2. Tautan "Lewati ke konten" di kedua layout; `<main id="konten">`.
  3. Modal & Lightbox: fokus terkunci di dalam, Esc menutup, fokus kembali ke pemicu, `role="dialog"` + `aria-modal` + `aria-labelledby`.
  4. Input/Select/Textarea: `label` terhubung `htmlFor`/`id`, pesan error via `aria-describedby`, `aria-invalid`.
  5. Vitest untuk Modal: Esc menutup & fokus kembali.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(a11y): skip link, focus trap, label form, reduced motion"`
- **DoD:** vitest Modal lulus.

## [Sesi 7-15] - Konfigurasi Lighthouse & Penutup Phase 7
- **Scope:** `lighthouserc.json` (baru), `AGENTS.md` (§13, §14, §2), `README.md`, `public/build`.
- **Implementation:**
  1. `lighthouserc.json`: URL Beranda, `/berita`, satu detail berita, `/jurusan`, `/kontak`; preset mobile; `numberOfRuns: 3`; assertion sesuai target DoD. **Tidak** dijalankan agent — pemilik menjalankan `npx @lhci/cli autorun` di staging.
  2. Perbarui dokumentasi (SSR, i18n, gambar, cache); `npm run build`.
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "chore(phase-7): konfigurasi lighthouse, dokumentasi, build aset"`
- **DoD:** checklist DoD Phase 7 tercentang (item Lighthouse oleh pemilik).

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 7-00 | ADR i18n (manual) |
| 7-01 – 7-05 | i18n (fondasi + 4 sesi pemindahan teks) |
| 7-06 – 7-07 | Inertia SSR & guard browser |
| 7-08 | SEO terstruktur |
| 7-09 | Gambar responsif |
| 7-10 | Cache publik |
| 7-11 – 7-13 | Pecah halaman besar |
| 7-14 | Aksesibilitas |
| 7-15 | Lighthouse & penutup |
