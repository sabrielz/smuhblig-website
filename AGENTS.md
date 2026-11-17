# AGENTS.md — SMK Muhammadiyah Bligo Website

> **Last updated:** 2026-05-17
> **Domain:** smkmuhbligo.sch.id
> **Purpose:** Canonical reference for any AI coding agent operating on this codebase.

---

## 0. Override Aktif — Baca Dulu

Sejak 11 Nov 2026, aturan berikut berlaku di atas segalanya, termasuk di atas bagian lain file ini. Bila ada pertentangan, aturan di bagian ini yang menang.

1. Fokus membangun kode dan dokumen, bukan menguji. Tugas Anda adalah membuat/mengubah kode sampai tidak ada error dan tidak ada kesalahan syntax. Review mendalam dan pengujian menyeluruh bukan tugas Anda sekarang.
2. Dilarang keras menulis atau menjalankan test PHP/Laravel apa pun: Pest, PHPUnit, mutation testing, `composer test`, `composer test:fast`, `composer test:quick`, `composer test:module`, `composer test:phase`, `composer test:mutate`, dan semacamnya.
3. Yang boleh dijalankan hanya: linter dan formatter (`vendor/bin/pint`, `vendor/bin/phpstan`, ESLint, Prettier), dan test Frontend saja (`npx vitest run`). Tidak ada yang lain.
4. Jangan memakai git worktree. Kerjakan di branch kerja yang aktif (checkout biasa).
5. Jangan memakai tools web atau tools lain yang menguras token kecuali benar-benar diperlukan tugas. Kerjakan cepat, efisien, dan fokus pada hasil.
6. Definition of Done efektif selama mode ini aktif: berkas yang diubah lulus format + lint, tidak ada syntax error, dan lulus `vitest` bila menyentuh frontend.
7. Commit rapi di akhir setiap pengerjaan. Jangan push, jangan membuka PR — itu dilakukan manusia.
8. Jangan menebak atau mengarang. Bila dokumen tidak menjawab atau kode berbeda dari ekspektasi, berhenti dan laporkan apa adanya.

---

## 1. Project Identity

This is the **official website and CMS** for SMK Muhammadiyah Bligo, a vocational high school in Pekalongan, Central Java.
It serves two audiences:

| Audience | Surface | URL prefix |
|----------|---------|------------|
| Public visitors | Marketing site — Beranda, Berita, Galeri, Jurusan, Agenda, Kontak, Pencarian | `/` |
| CMS operators | Admin dashboard — content management, AI writing tools, notifications | `/admin` |

**Visual identity:** Modern-international, minimalist-elegant, subtle Islamic/Muhammadiyah motifs.

---

## 2. Tech Stack — Verified Versions

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Runtime | PHP | `^8.2` | |
| Framework | Laravel | `^12.0` | |
| SPA Bridge | Inertia.js | `2.0.1` (server) / `^2.0` (client) | Server-driven SPA — **no REST API** |
| Frontend | React | `^19.0` | |
| Language | TypeScript | `^5.0` | Strict mode enabled |
| Build | Vite | `^7.0.7` | With `laravel-vite-plugin ^2.0.0` |
| CSS | Tailwind CSS | `^4.0.0` | v4 — uses `@tailwindcss/vite` plugin, `@theme` directive |
| Animations | Framer Motion | `^12.0` | |
| Rich Editor | TipTap | `^2.0` | With image, link, placeholder, typography, character-count extensions |
| Icons | Lucide React | `latest` | stroke-width: 1.5 |
| Routing (client) | Ziggy | `^2.6` | `route()` helper globally available via `window.Ziggy` |
| Database | MySQL | (via Sail/Docker) | Connection: `mysql` (`.env` configured) |
| Queue/Cache/Session | Redis | via Predis `^3.4` | |
| State/Data Fetching | TanStack React Query | `^5.0` | Used for polling (AI jobs) |
| i18n | i18next + react-i18next | `^24.0` / `^15.0` | Bilingual: `id` (primary), `en` |
| Carousel | Embla Carousel React | `^8.0` | |
| Drag & Drop | dnd-kit | `^6.3.1` (core) / `^10.0.0` (sortable) | |

---

## 3. Architecture

### 3.1 Pattern: Inertia.js Monolith (Server-Driven SPA)

```
Browser ─── Inertia XHR ───► Laravel Controller ───► Inertia::render('Page', $props)
                                    │                          │
                                    ▼                          ▼
                              Form Requests            React Page Component
                              API Resources            (receives typed props)
                              Eloquent Models
                              Service Classes
```

- **No REST API.** All data flows through `Inertia::render()` and shared props.
- **No client-side router.** Routing is 100% `routes/web.php` → Inertia resolves to `resources/js/Pages/**/*.tsx`.
- Pages are eagerly loaded via `import.meta.glob('./Pages/**/*.tsx', { eager: true })`.

### 3.2 Backend Layers

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/       ← 16 controllers (CRUD for all CMS modules)
│   │   ├── Auth/        ← LoginController (login + password reset)
│   │   └── Public/      ← 10 controllers (public-facing pages)
│   ├── Middleware/
│   │   ├── HandleInertiaRequests.php  ← Shared props (auth, locale, pengaturan, flash, notifikasi, pesan)
│   │   ├── EnsureHasCmsRole.php       ← Guards all /admin routes
│   │   ├── SetLocale.php              ← i18n locale from session
│   │   ├── ContentSecurityPolicy.php  ← CSP headers
│   │   └── SlowRequestLogger.php      ← Performance monitoring
│   ├── Requests/        ← Form Request validation (Admin/, Auth/, Public/ subdirs)
│   └── Resources/       ← API Resources for Inertia prop serialization
├── Models/              ← 22 Eloquent models (see §5)
├── Services/            ← Business logic (AiService, EmailConfigService, HtmlSanitizer, NotifikasiService)
├── Observers/           ← AiJobObserver, ArticleObserver
├── Jobs/                ← Queue jobs (ProcessAiJob, TranslateHalamanKonten, KirimNotifikasiPesanBaru, IncrementArticleViewCount)
├── Mail/                ← PesanKontakMasukMail, TestEmailMail
├── Console/             ← Artisan commands
├── Exceptions/          ← Custom exceptions
└── Providers/           ← Service providers
```

### 3.3 Frontend Structure

```
resources/js/
├── app.tsx              ← Inertia bootstrap + Ziggy setup
├── Pages/
│   ├── Admin/           ← 13 module directories + Dashboard.tsx
│   │   ├── Agenda/
│   │   ├── Artikel/
│   │   ├── Galeri/
│   │   ├── Jurusan/
│   │   ├── KontenHalaman/
│   │   ├── Notifikasi/
│   │   ├── Pengaturan/
│   │   ├── Pengguna/
│   │   ├── Pengumuman/
│   │   ├── PesanKontak/
│   │   ├── Statistik/
│   │   ├── StrukturOrganisasi/
│   │   ├── Tautan/
│   │   └── Dashboard.tsx
│   ├── Auth/            ← Login, ForgotPassword, ResetPassword
│   ├── Public/          ← Beranda, Berita/, Galeri, Jurusan/, Agenda, Kontak, Pencarian, Tautan, Tentang
│   ├── Errors/          ← Error pages
│   └── Portal.tsx       ← Quick-link portal page
├── Components/
│   ├── UI/              ← 18 primitives (Button, Modal, Table, Pagination, Input, Select, etc.)
│   ├── Admin/           ← AdminSidebar, AdminTopbar
│   ├── Layout/          ← Navbar, Footer (public site)
│   └── Editor/          ← TipTapEditor, AiBubble, AiPanel, AiToolbar, AiStatusBadge, SeoPanel
├── Layouts/
│   ├── AdminLayout.tsx  ← Sidebar + Topbar shell for /admin
│   └── PublicLayout.tsx ← Navbar + Footer + SEO <Head> for public pages
├── hooks/
│   └── useAiJob.ts      ← Polling hook for AI job status
├── lib/
│   ├── utils.ts          ← cn(), formatDate(), formatRelativeDate(), truncate(), getInitials()
│   └── motion.ts         ← Framer Motion presets: fadeInUp, fadeIn, staggerContainer, scaleIn, slideFromLeft/Right, heroStagger, cardHover
└── types/
    ├── index.ts          ← All TypeScript interfaces (User, Article, Jurusan, Galeri, SharedProps, PaginatedData<T>, etc.)
    └── vite-env.d.ts     ← Vite client types
```

---

## 4. Routing Overview

All routes are in `routes/web.php` (~214 lines). Two groups:

### Public Routes
| Path | Controller | Name |
|------|-----------|------|
| `/` | `BerandaController` | `beranda` |
| `/jurusan` | `JurusanController@index` | `jurusan.index` |
| `/jurusan/{slug}` | `JurusanController@show` | `jurusan.show` |
| `/guru` | `Public\GuruController@index` | `guru.index` |
| `/fasilitas` | `Public\FasilitasController@index` | `fasilitas.index` |
| `/fasilitas/{slug}` | `Public\FasilitasController@show` | `fasilitas.show` |
| `/ekstrakurikuler` | `Public\EkstrakurikulerController@index` | `ekstrakurikuler.index` |
| `/ekstrakurikuler/{slug}` | `Public\EkstrakurikulerController@show` | `ekstrakurikuler.show` |
| `/prestasi` | `Public\PrestasiController@index` | `prestasi.index` |
| `/prestasi/{slug}` | `Public\PrestasiController@show` | `prestasi.show` |
| `/berita` | `BeritaController@index` | `berita.index` |
| `/berita/{slug}` | `BeritaController@show` | `berita.show` |
| `/pengumuman` | `PengumumanController@index` | `pengumuman.index` |
| `/pengumuman/{slug}` | `PengumumanController@show` | `pengumuman.show` |
| `/galeri` | `GaleriController@index` | `galeri` |
| `/galeri/{slug}` | `GaleriController@show` | `galeri.show` |
| `/agenda` | `AgendaPublikController@index` | `agenda.index` |
| `/agenda/{slug}` | `AgendaPublikController@show` | `agenda.show` |
| `/agenda/{slug}/ics` | `AgendaPublikController@ics` | `agenda.ics` |
| `/tentang` | `TentangController@index` | `tentang` |
| `/kontak` | `KontakController@index` | `kontak` |
| `/pencarian` | `PencarianController@index` | `pencarian.index` |
| `/tautan` | `TautanController@index` | `tautan` |
| `/portal` | Inline closure | `portal` |

### Admin Routes (prefix: `/admin`, middleware: `auth` + `EnsureHasCmsRole`)
| Module | Controller | Access |
|--------|-----------|--------|
| Dashboard | `DashboardController` | All CMS roles |
| Artikel | `ArtikelController` (resource + publish + preview) | All CMS roles |
| Kategori | `KategoriController` (resource) | All CMS roles |
| Tag | `TagController` (index + merge + delete) | All CMS roles |
| Galeri | `GaleriController` (resource + foto CRUD) | All CMS roles |
| Pengumuman | `PengumumanController` (resource + preview) | All CMS roles |
| Agenda | `AgendaController` (resource) | All CMS roles |
| Jurusan | `JurusanController` (edit only) | All CMS roles |
| Guru & Tendik | `GuruController` (resource + reorder) | Admin & Editor |
| Fasilitas | `FasilitasController` (resource + reorder) | Admin & Editor |
| Ekstrakurikuler | `EkstrakurikulerController` (resource + reorder) | Admin & Editor |
| Prestasi | `PrestasiController` (resource) | Admin & Editor |
| Notifikasi | `NotifikasiController` | All CMS roles |
| Profil Saya | `ProfilController` (edit + update + password) | All CMS roles |
| Pesan Kontak | `PesanKontakController` | All CMS roles (delete: admin only) |
| Konten Halaman | `KontenHalamanController` | View: all, Update: admin only |
| Media Upload | `MediaUploadController` | All CMS roles |
| AI Features | `AiController` | All CMS roles (throttled) |
| Tautan | `TautanController` (resource) | **Admin only** |
| Pengaturan | `PengaturanController` | **Admin only** |
| Statistik | `StatistikController` | **Admin only** |
| Struktur Organisasi | `StrukturOrganisasiController` | **Admin only** |
| Pengguna | `PenggunaController` (resource) | **Admin only** |

---

## 5. Data Model Summary

**26 Eloquent models** across the domain:

| Model | Translation Table | Spatie Packages | Notes |
|-------|------------------|-----------------|-------|
| `User` | — | Permission, MediaLibrary | Roles: admin, editor, author |
| `Article` | `ArticleTranslation` | Sluggable, Tags, MediaLibrary, Translatable | Statuses: draft, pending_review, published, archived |
| `Category` | `CategoryTranslation` | Translatable | Article categories |
| `Jurusan` | `JurusanTranslation` | Sluggable, Translatable | 5 fixed programs (edit only, no create/delete) |
| `Guru` | `GuruTranslation` | MediaLibrary | Guru & Tenaga Kependidikan |
| `Fasilitas` | `FasilitasTranslation` | Sluggable, MediaLibrary | Sarana & prasarana sekolah (multiple photos) |
| `Ekstrakurikuler` | `EkstrakurikulerTranslation` | Sluggable, MediaLibrary | Kegiatan minat & bakat siswa |
| `Prestasi` | `PrestasiTranslation` | Sluggable, MediaLibrary | Penghargaan & kejuaraan siswa |
| `Galeri` | `GaleriTranslation` | Sluggable, MediaLibrary, Translatable | Photo albums |
| `Pengumuman` | `PengumumanTranslation` | Sluggable, Translatable | Types: info, penting, urgent |
| `Agenda` | `AgendaTranslation` | Sluggable, Translatable | School events/calendar |
| `HalamanKonten` | `HalamanKontenTranslation` | Translatable | CMS-managed static page content |
| `Tautan` | — | — | Important links (external) |
| `Pengaturan` | — | — | Key-value site settings |
| `Statistik` | — | — | Dashboard statistics (sortable) |
| `StrukturOrganisasi` | — | MediaLibrary | Org chart members (sortable) |
| `PesanKontak` | — | — | Contact form submissions |
| `NotifikasiAdmin` | — | — | In-app notifications for CMS users |
| `AiJob` | — | — | AI task tracking (generate, revise, translate, seo) |

**Multilingual pattern:** Content stored in `*_translations` tables using Spatie Translatable. Available locales: `id` (Indonesian, primary), `en` (English).

---

## 6. Shared Inertia Props

Defined in `HandleInertiaRequests.php`. Available on **every page** via `usePage<SharedProps>().props`:

```typescript
interface SharedProps {
    locale: string;                    // Current locale ('id' | 'en')
    availableLocales: string[];        // ['id', 'en']
    auth: { user: User | null };       // Authenticated user with roles/permissions
    pengaturan: Pengaturan;            // Site-wide settings (cached 1hr)
    flash: FlashMessages;             // success/error/warning/info session flash
    notifikasi_count: number;          // Unread admin notification count
    pesan_baru_count: number;          // New contact message count
    seo: string;                       // Pre-rendered SEO meta tags (Artesaos)
    csp_nonce: string;                 // CSP nonce for inline scripts
}
```

---

## 7. Design System

### 7.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-600` | `#003f87` | **Brand primary** — buttons, links, headers |
| `primary-900` | `#001f4d` | Dark sections, navbars |
| `gold-500` | `#c9a84c` | Prestige accent — badges, dividers |
| `neutral-900` | `#111111` | Body text |
| `neutral-500` | `#636366` | Secondary text |
| `neutral-0` | `#ffffff` | Page background |
| `neutral-50` | `#f2f2f7` | Admin/section background |

All tokens are defined as CSS custom properties in `resources/css/app.css` and registered in the `@theme` block for Tailwind v4.

### 7.2 Typography

| Font | Weight | Usage |
|------|--------|-------|
| **Plus Jakarta Sans** | 300–800 | Primary — all body text, UI, headings |
| **Playfair Display** | 700, 800 | Accent — **hero headlines and editorial titles only** |

Display size utilities: `.text-display-2xl` through `.text-display-sm` (defined in `app.css`).

### 7.3 Animation Presets

All in `resources/js/lib/motion.ts` — **always use these, never define ad-hoc variants:**

| Export | Purpose |
|--------|---------|
| `fadeInUp` | Default scroll reveal (y: 30→0, 600ms) |
| `fadeIn` | Opacity-only reveal (500ms) |
| `staggerContainer` | Parent for staggered children (0.12s gap) |
| `scaleIn` | Scale + opacity reveal |
| `slideFromLeft` / `slideFromRight` | Horizontal entrance |
| `heroStagger` | Hero section child stagger (0.2s gap) |
| `cardHover` | Card `whileHover` effect (y: -6) |

**Rules:** All reveals use `whileInView + viewport={{ once: true }}`. UI transitions: 150–300ms. Reveal transitions: 500–700ms. Easing: `easeOut` or `easeInOut`, **never** `linear`.

---

## 8. Coding Conventions

### 8.1 PHP / Laravel

- **PSR-12** coding standard
- Controller methods: `index`, `show`, `create`, `store`, `edit`, `update`, `destroy`
- **Always** use `FormRequest` classes for validation — never validate in controllers
- **Always** use `Resource` classes for serializing data to Inertia
- Return type hints on all methods
- Typed properties on all models
- Eager-load relationships in controllers to avoid N+1

### 8.2 React / TypeScript

- **Functional components only** — no class components
- File naming: `PascalCase.tsx` for components, `useHookName.ts` for hooks
- All component props must have a typed `interface`
- Use `cn()` from `@/lib/utils` for conditional classNames
- Use `usePage<SharedProps>()` to access shared Inertia data
- Use Inertia `<Link>` and `router` for navigation — never raw `<a>` for internal links
- Use `route()` helper (Ziggy) for named route URLs

### 8.3 Tailwind CSS v4

- **Mobile-first**: start with base, add `sm:` `md:` `lg:` `xl:` breakpoints
- Class order: layout → spacing → typography → color → animation → state
- Use `@apply` only in `app.css` for global utilities, **not** in components
- Never hardcode hex colors in JSX — always use Tailwind classes or CSS variables

### 8.4 File Placement

| What | Where |
|------|-------|
| UI primitives | `resources/js/Components/UI/` |
| Layout components | `resources/js/Components/Layout/` |
| Admin components | `resources/js/Components/Admin/` |
| Editor/AI components | `resources/js/Components/Editor/` |
| Public pages | `resources/js/Pages/Public/` |
| Admin pages | `resources/js/Pages/Admin/{ModuleName}/` |
| Custom hooks | `resources/js/hooks/` |
| Shared utilities | `resources/js/lib/` |
| TypeScript types | `resources/js/types/` |

---

## 9. Hard Rules — Do NOT Violate

### Prohibited

| ❌ Never | ✅ Use instead |
|---------|---------------|
| jQuery, Bootstrap, Material UI | Tailwind + custom UI components |
| moment.js | `date-fns` or `Intl` API |
| axios | `fetch` or Inertia built-in methods |
| react-router | Inertia `<Link>` + `router` |
| REST API endpoints for frontend | `Inertia::render()` + shared props |
| Direct AI API calls from frontend | Laravel Controller → Queue → `ProcessAiJob` |
| `any` in TypeScript | Proper interfaces (exceptions: truly unavoidable) |
| Inline styles | Tailwind classes or CSS variables |
| Class components | Functional components |

### Required

- **CSRF protection** — active on all forms (Laravel default)
- **HTML sanitization** — all editor content passes through `HtmlSanitizer` before storage
- **File upload validation** — MIME type + size limit + UUID rename
- **AI API keys** — server-side only, never exposed to frontend
- **All admin routes** — `auth` + Spatie role middleware
- **All images** — converted to WebP via Spatie Media Library
- **Cache** — `Cache::remember()` for public data that changes infrequently
- **Migrations** — always create new migration files, never edit existing ones

---

## 10. AI Feature Architecture

```
Frontend                    Backend                         Queue
───────                    ───────                         ─────
AiToolbar.tsx ──POST──► AiController@generate ──dispatch──► ProcessAiJob
     │                                                         │
     ▼                                                         ▼
useAiJob.ts ──GET poll──► AiController@jobStatus          AiService (OpenAI/Anthropic)
(every 2s)                     │                               │
     │                         ▼                               ▼
     ▼                    AiJob model                    Updates AiJob record
AiPanel.tsx               (status, output)              (status: done | failed)
(preview → accept)
```

- All AI requests go through Laravel Queue (`queue: 'ai'`)
- Frontend polls `GET /admin/ai/jobs/{id}/status` every 2 seconds via `useAiJob` hook
- AI output is always shown as **preview** — user must explicitly accept before applying
- All usage logged to `ai_jobs` table
- Rate limit: 20 req/min per user (`throttle:ai`)
- Provider configurable: `ai_provider` setting (currently supports `anthropic`)

---

## 11. Development Environment

### Local Setup (Laragon / Sail)

```bash
# Install dependencies
composer install
npm install

# Start all services (artisan serve + queue + pail + vite)
composer dev

# Or individually
php artisan serve          # Backend server
npm run dev                # Vite dev server
php artisan queue:listen   # Queue worker
```

### Docker (Sail)

```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate --seed
```

### Key Environment Variables

| Variable | Purpose |
|----------|---------|
| `DB_CONNECTION` | `mysql` |
| `QUEUE_CONNECTION` | `redis` |
| `SESSION_DRIVER` | `redis` |
| `CACHE_STORE` | `redis` |
| `ANTHROPIC_API_KEY` | Anthropic API key (server-side only) |
| `ANTHROPIC_MODEL` | AI model name |
| `AI_MAX_TOKENS` | Max tokens per AI request |
| `APP_LOCALE` | Default locale (`id`) |
| `APP_AVAILABLE_LOCALES` | Comma-separated (`id,en`) |

### Verifikasi Akhir Sesi

Setiap akhir sesi diverifikasi menggunakan perintah tunggal:
```bash
npm run verify
```
Skrip ini menjalankan:
1. `php vendor/bin/pint` pada berkas PHP yang berubah.
2. `php vendor/bin/phpstan` pada berkas `app/` yang berubah.
3. `npx eslint` pada berkas TS/TSX di `resources/js` yang berubah.
4. `npx tsc --noEmit` untuk type check global.
5. `npx vitest run --passWithNoTests` untuk pengujian frontend.

---

## 12. Database

- **30 migration files** covering all tables
- **12 seeder files** for initial data (roles, admin user, categories, jurusan, etc.)
- Translation tables follow `{model}_translations` naming convention
- Indexes on frequently queried columns: `status`, `published_at`, `slug`, `is_active`
- `timestamps()` required on all main tables (never nullable)

### Seeding Order (via `DatabaseSeeder`)

`DatabaseSeeder` memanggil 11 seeder:
```
RoleSeeder → AdminUserSeeder → CategorySeeder → JurusanSeeder →
TautanSeeder → GaleriSeeder → ArticleSeeder → PengaturanSeeder →
HalamanKontenSeeder → StatistikSeeder → StrukturOrganisasiSeeder
```

---

## 13. Performance Guidelines

- All images → WebP conversion via Spatie Media Library
- Lazy-load images below the fold
- `Cache::remember()` for public data (pengaturan cached 1 hour)
- Eager-load Eloquent relationships in controllers
- `React.lazy()` + `Suspense` for heavy components when needed
- Vite code-splitting via page-based `import.meta.glob`

---

## 14. SEO & Security

- Backend: `artesaos/seotools` generates `<meta>` tags per page
- Frontend: `PublicLayout.tsx` parses and injects SEO tags via `<Head>`
- JSON-LD structured data (`EducationalOrganization`) on every public page
- `hreflang` alternate links for `id` and `en`
- Sitemap auto-generated at `/sitemap.xml` via `spatie/laravel-sitemap`
- Semantic HTML5 elements throughout
- **Security Note:** CSP middleware telah aktif dengan nonce script & frame-ancestors none. Fitur pencarian mencakup Jurusan, Artikel, Pengumuman, Agenda, Guru & Tendik, Fasilitas, Ekstrakurikuler, dan Prestasi. Seluruh toggle pengaturan (`artikel_ai_enabled`, `multibahasa_enabled`, `ai_translate_auto`, `artikel_approval`) telah berefek penuh di backend dan frontend. Status artikel menggunakan enum `ArticleStatus` (Draft, PendingReview, Published, Archived). Seeder lengkap dengan placeholder SVG lokal (bebas dependensi eksternal picsum). Seluruh validasi controller menggunakan FormRequest dan props admin menggunakan Resource. Class styling bersih menggunakan token Tailwind v4 tanpa arbitrary hex di JSX. Modul Kategori & Tag telah terintegrasi penuh pada penulisan artikel dan filter publik/pengelolaan admin. Pengumuman publik memiliki halaman index/show dan banner darurat di Beranda. Galeri mendukung detail album per slug. Agenda mendukung unduhan kalender iCalendar (.ics). Modul Profil Sekolah lengkap: Guru & Tendik (publik, admin, reorder), Fasilitas (publik, admin, reorder, galeri foto s/d 8 foto), Ekstrakurikuler (publik, admin, reorder), Prestasi (publik, admin, section beranda), serta Navigasi dropdown/accordion Profil yang aksesibel. Editor TipTap aktif untuk konten Pengumuman, Agenda, Fasilitas, Ekstrakurikuler, dan Prestasi. Fitur pratinjau draft aktif untuk artikel dan pengumuman.

---

## 15. Quick Reference — Creating a New Feature

### New Admin CRUD Module

1. **Migration** — `php artisan make:migration create_xxx_table`
2. **Model** — `app/Models/Xxx.php` (with casts, fillable, relationships)
3. **Translation Model** — if multilingual: `app/Models/XxxTranslation.php`
4. **Form Request** — `app/Http/Requests/Admin/XxxRequest.php`
5. **Resource** — `app/Http/Resources/Admin/XxxResource.php`
6. **Controller** — `app/Http/Controllers/Admin/XxxController.php`
7. **Routes** — add to `routes/web.php` inside the admin group
8. **TypeScript type** — add interface to `resources/js/types/index.ts`
9. **React pages** — `resources/js/Pages/Admin/Xxx/Index.tsx`, `Create.tsx`, `Edit.tsx`
10. **Sidebar link** — add to `AdminSidebar.tsx`

### New Public Page

1. **Controller** — `app/Http/Controllers/Public/XxxController.php`
2. **Route** — add to public routes in `web.php`
3. **SEO** — configure `SEOTools` in controller
4. **React page** — `resources/js/Pages/Public/Xxx.tsx`
5. **Layout** — wrap with `<PublicLayout>` and add Framer Motion reveals
6. **Navbar** — add link to `Navbar.tsx` if needed

---

## 16. Batas Cakupan

### 16.1 Masuk Cakupan
- Halaman informasi publik yang dikelola via CMS (Beranda, Profil/Tentang, Jurusan, Berita/Artikel, Agenda, Galeri, Kontak, Pencarian).
- Fitur CMS untuk operator (pengelolaan artikel, agenda, galeri, pengumuman, jurusan, tautan, statistik, struktur organisasi, pesan kontak, pengguna, pengaturan).
- Form kontak publik sebagai satu-satunya sarana input/interaksi dari pengunjung umum.
- Tautan keluar ke Portal Sekolah & `spmb_url` (PPDB).
- Fondasi non-fungsional: SEO, dwibahasa (ID/EN), performa, aksesibilitas, keamanan dasar, dan skema backup.
- Asisten penulisan AI berbasis antrean (queue-backed).

### 16.2 Di Luar Cakupan (Out of Scope)
- Sistem PPDB / SPMB mandiri.
- Sistem BKK, bursa kerja, lowongan kerja, atau tracer study alumni mandiri.
- Sistem keuangan, pembayaran SPP, atau integrasi payment gateway.
- Pengelolaan sarana & prasarana (sarpras) / inventaris internal.
- Sistem akademik, LMS (Learning Management System), presensi siswa/guru, e-rapor.
- Akun login publik bagi siswa, calon siswa, atau wali murid.
- Jurnal kegiatan harian siswa/prakerin/PKL, jurnal ekskul.
- E-voting atau pemilihan ketua OSIS/organisasi.
- Sistem perpustakaan digital / OPAC mandiri.

*Semua modul di luar cakupan di atas dialihkan sebagai tautan eksternal ke Portal Sekolah.*

### 16.3 Uji 3 Pertanyaan (Scope Filter)
Setiap usulan fitur baru wajib lolos 3 pertanyaan berikut:
1. Apakah tujuannya murni menyampaikan informasi sekolah kepada masyarakat/publik?
2. Apakah pengelolaannya cukup dilakukan oleh operator sekolah melalui antarmuka CMS?
3. Apakah fitur dapat berjalan tanpa memerlukan registrasi akun, otentikasi login, transaksi data, atau unggahan berkas dari masyarakat/publik (selain formulir kontak)?

> **Aturan:** 3× Ya = Fitur diizinkan untuk diusulkan ke dalam web ini. 1× Tidak = Fitur dialihkan ke Portal Sekolah / sistem terpisah.

---

## 17. Aturan Bisnis (Business Rules)

- **`BR-001` Matriks Peran (Role Matrix)** *(Status: disetujui)*:
  - **Author**: Membuat artikel baru; mengubah artikel milik sendiri yang berstatus `draft` atau `pending_review`; mengajukan review; tidak berhak mempublikasikan, mengarsipkan, atau menghapus artikel milik orang lain.
  - **Editor**: Semua kewenangan Author ditambah hak mengedit seluruh artikel, mengelola galeri, pengumuman, agenda, dan mengedit data jurusan serta melakukan publikasi.
  - **Admin**: Semua kewenangan Editor ditambah hak penuh mengelola pengguna, pengaturan sistem, tautan penting, statistik, struktur organisasi, konten halaman dinamis, serta menghapus riwayat pesan kontak.
- **`BR-002` Transisi Status Artikel**:
  - Author hanya dapat mengubah status ke `draft` dan `pending_review` (atau langsung `published` hanya bila opsi pengaturan `artikel_approval` dimatikan).
  - Editor dan Admin berhak mengubah artikel ke semua status (`draft`, `pending_review`, `published`, `archived`).
- **`BR-003` Pengumuman Aktif**:
  - Sebuah pengumuman dianggap aktif jika dan hanya jika `is_active = true` **dan** (`tanggal_mulai` null atau ≤ tanggal hari ini) **dan** (`tanggal_selesai` null atau ≥ tanggal hari ini).
- **`BR-004` Validasi Unggahan Gambar**:
  - Format yang diizinkan: `jpg`, `jpeg`, `png`, `webp`.
  - Ukuran berkas maksimum: **2 MB** untuk thumbnail artikel, avatar pengguna, logo sekolah, dan foto struktur organisasi; **20 MB** khusus untuk foto galeri/album kegiatan.
  - Penamaan berkas fisik di server wajib menggunakan nama acak berbasis UUID unik.
- **`BR-005` Dukungan Bahasa (i18n)**:
  - Konten Bahasa Indonesia (`id`) bersifat wajib pada seluruh entitas multibahasa.
  - Konten Bahasa Inggris (`en`) bersifat opsional. Jika entitas tidak memiliki terjemahan EN, sistem wajib menampilkan fallback konten versi `id`.
- **`BR-010` Guru & Tendik** *(Status: disetujui)*:
  - Tabel `guru`: `nama`, `gelar_depan` (nullable), `gelar_belakang` (nullable), `kelompok` (`guru`/`tendik`), `jurusan_id` (nullable FK `jurusans`), `urutan`, `is_active`.
  - Translasi (`guru_translations`): `jabatan`, `mapel` (nullable).
  - Media: `foto` (single). Tanpa NIP/NUPTK/kontak pribadi.
- **`BR-011` Fasilitas** *(Status: disetujui)*:
  - Tabel `fasilitas`: `slug`, `kategori` (`ruang_praktik`/`umum`/`olahraga`/`ibadah`), `urutan`, `is_active`.
  - Translasi (`fasilitas_translations`): `nama`, `deskripsi`.
  - Media: `foto` (multiple, maks 8). Tanpa data inventaris.
- **`BR-012` Ekstrakurikuler** *(Status: disetujui)*:
  - Tabel `ekstrakurikuler`: `slug`, `pembina_guru_id` (nullable FK `guru`), `urutan`, `is_active`.
  - Translasi (`ekstrakurikuler_translations`): `nama`, `deskripsi`, `jadwal` (teks bebas).
  - Media: `foto` (single). Tanpa pendaftaran anggota.
- **`BR-013` Prestasi** *(Status: disetujui)*:
  - Tabel `prestasi`: `slug`, `tingkat` (`sekolah`/`kabupaten`/`provinsi`/`nasional`/`internasional`), `kategori` (`akademik`/`non_akademik`), `tahun` (smallint), `tanggal` (nullable date), `jurusan_id` (nullable FK `jurusans`), `is_active`.
  - Translasi (`prestasi_translations`): `judul`, `ringkasan`.
  - Media: `foto` (single).
- **`BR-020` Unduhan** *(Status: menunggu persetujuan)*:
  - Tabel `unduhan`: `slug`, `kategori` (`brosur`/`kalender`/`formulir`/`sk`/`lainnya`), `tanggal_terbit`, `jumlah_unduh` (default 0), `is_active`.
  - Translasi (`unduhan_translations`): `judul`, `deskripsi`.
  - Media: `berkas` (single; pdf/docx/xlsx; maks 10 MB). Disimpan di storage disk lokal non-publik.
- **`BR-021` FAQ** *(Status: menunggu persetujuan)*:
  - Tabel `faq`: `kategori` (`umum`/`pendaftaran`/`akademik`/`fasilitas`), `urutan`, `is_active`.
  - Translasi (`faq_translations`): `pertanyaan`, `jawaban`.
- **`BR-022` Testimoni** *(Status: menunggu persetujuan)*:
  - Tabel `testimoni`: `nama`, `peran` (`alumni`/`orang_tua`/`mitra`), `keterangan` (mis. "Alumni TKJ 2022"), `persetujuan_tampil` (bool, wajib true agar bisa aktif), `is_active`, `urutan`.
  - Translasi (`testimoni_translations`): `kutipan`.
  - Media: `foto` (single).
- **`BR-023` Mitra Industri** *(Status: menunggu persetujuan)*:
  - Tabel `mitra`: `nama`, `bidang`, `url` (nullable), `urutan`, `is_active`.
  - Pivot: `jurusan_mitra` (`jurusan_id`, `mitra_id`).
  - Media: `logo` (single).
- **`BR-024` Video** *(Status: menunggu persetujuan)*:
  - Tabel `video`: `youtube_id` (11 karakter), `urutan`, `is_active`, `galeri_id` (nullable FK `galeris`).
  - Translasi (`video_translations`): `judul`.

---

## 18. Keputusan Arsitektur (ADR)

- **`ADR-001` Database Engine**: Menggunakan MySQL 8 untuk lingkungan lokal dev maupun server produksi (konsisten, tidak menggunakan variasi engine seperti PostgreSQL di produksi).
- **`ADR-002` Pendaftaran Siswa (PPDB/SPMB)**: Tidak membangun aplikasi penerimaan siswa baru di dalam repositori ini. Tombol pendaftaran publik mengarah langsung ke tautan luar sesuai konfigurasi pengaturan `spmb_url`.
- **`ADR-003` Pemisahan CMS dan Portal Sekolah**: Repositori ini didedikasikan secara eksklusif sebagai portal profil publik (landing page) dan CMS pengelola konten. Modul layanan internal sekolah disediakan terpisah lewat halaman Portal tautan cepat.
- **`ADR-004` Notifikasi Dashboard Operator**: Pembaruan notifikasi admin dan jumlah pesan baru menggunakan mekanisme interval polling yang efisien, tanpa server WebSocket/SSE eksternal.
- **`ADR-005` Larangan Test PHP Selama Mode Override**: Mengacu pada §0, dilarang menjalankan suite test PHP/Pest/PHPUnit. Penjaminan mutu backend dilakukan dengan `vendor/bin/pint` dan analisis statis `vendor/bin/phpstan`, frontend diverifikasi via TypeScript compiler `tsc` dan `vitest`.
- **`ADR-006` Video Galeri & Integrasi YouTube** *(Status: menunggu persetujuan)*:
  - Menggunakan opsi (a): thumbnail `i.ytimg.com` dengan tautan keluar ke YouTube resmi (lebih ringan, ramah privasi, dan tidak membebani performa browser pengguna dengan iframe besar) ATAU opsi (b): embed `youtube-nocookie.com` setelah klik pengguna. Usulan default: opsi (a).

---

## 19. Roadmap Pengerjaan & Aturan Gerbang

Rangkaian pengerjaan sistem terbagi ke dalam fase berurutan:
- `docs/phase-0.md`: Fondasi, standarisasi dokumen acuan, pembersihan repo, eliminasi tsc error, pasang lint & CI.
- `docs/phase-1.md`: Keamanan dasar & audit surface.
- `docs/phase-2.md`: Standarisasi database & seeder lengkap.
- `docs/phase-3.md`: Otorisasi peran (BR-001) & kebijakan akses.
- `docs/phase-4.md`: Pembersihan & optimasi modul CMS Admin.
- `docs/phase-5.md`: Standardisasi komponen publik & SEO.
- `docs/phase-6.md`: Fitur AI writing assistant & observer antrean.
- `docs/phase-7.md`: Audit performa, aset WebP, dan cache layer.
- `docs/phase-8.md`: Kesiapan rilis v1.0, dokumentasi panduan, dan final audit.

> **Aturan Gerbang (Gate Rule):** Hanya ada satu fase aktif dalam satu waktu. Seluruh item Definition of Done (DoD) pada dokumen fase yang sedang aktif wajib terpenuhi dan terverifikasi sebelum berpindah ke fase berikutnya.

