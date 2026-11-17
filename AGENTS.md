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
| `/berita` | `BeritaController@index` | `berita.index` |
| `/berita/{slug}` | `BeritaController@show` | `berita.show` |
| `/galeri` | `GaleriController@index` | `galeri` |
| `/agenda` | `AgendaPublikController@index` | `agenda.index` |
| `/agenda/{slug}` | `AgendaPublikController@show` | `agenda.show` |
| `/tentang` | `TentangController@index` | `tentang` |
| `/kontak` | `KontakController@index` | `kontak` |
| `/pencarian` | `PencarianController@index` | `pencarian.index` |
| `/tautan` | `TautanController@index` | `tautan` |
| `/portal` | Inline closure | `portal` |

### Admin Routes (prefix: `/admin`, middleware: `auth` + `EnsureHasCmsRole`)
| Module | Controller | Access |
|--------|-----------|--------|
| Dashboard | `DashboardController` | All CMS roles |
| Artikel | `ArtikelController` (resource) | All CMS roles |
| Galeri | `GaleriController` | All CMS roles |
| Pengumuman | `PengumumanController` | All CMS roles |
| Agenda | `AgendaController` (resource) | All CMS roles |
| Jurusan | `JurusanController` (edit only) | All CMS roles |
| Notifikasi | `NotifikasiController` | All CMS roles |
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

**22 Eloquent models** across the domain:

| Model | Translation Table | Spatie Packages | Notes |
|-------|------------------|-----------------|-------|
| `User` | — | Permission, MediaLibrary | Roles: admin, editor, author |
| `Article` | `ArticleTranslation` | Sluggable, Tags, MediaLibrary, Translatable | Statuses: draft, pending_review, published, archived |
| `Category` | `CategoryTranslation` | Translatable | Article categories |
| `Jurusan` | `JurusanTranslation` | Sluggable, Translatable | 5 fixed programs (edit only, no create/delete) |
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

---

## 12. Database

- **30 migration files** covering all tables
- **12 seeder files** for initial data (roles, admin user, categories, jurusan, etc.)
- Translation tables follow `{model}_translations` naming convention
- Indexes on frequently queried columns: `status`, `published_at`, `slug`, `is_active`
- `timestamps()` required on all main tables (never nullable)

### Seeding Order (via `DatabaseSeeder`)

```
RoleSeeder → AdminUserSeeder → CategorySeeder → PengaturanSeeder →
JurusanSeeder → HalamanKontenSeeder → StatistikSeeder →
StrukturOrganisasiSeeder → TautanSeeder → ArticleSeeder → GaleriSeeder
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

## 14. SEO

- Backend: `artesaos/seotools` generates `<meta>` tags per page
- Frontend: `PublicLayout.tsx` parses and injects SEO tags via `<Head>`
- JSON-LD structured data (`EducationalOrganization`) on every public page
- `hreflang` alternate links for `id` and `en`
- Sitemap auto-generated at `/sitemap.xml` via `spatie/laravel-sitemap`
- Semantic HTML5 elements throughout

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
