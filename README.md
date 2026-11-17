<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel 12" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Inertia.js-2-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia.js 2" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 7" />
</p>

<h1 align="center">🏫 SMK Muhammadiyah Bligo</h1>

<p align="center">
  <strong>Website Resmi & Content Management System</strong><br/>
  <em>Modern, bilingual (ID/EN), AI-powered school website for SMK Muhammadiyah Bligo, Pekalongan, Central Java.</em>
</p>

<p align="center">
  <a href="https://smkmuhbligo.sch.id">🌐 Live Site</a> •
  <a href="#-quick-start">🚀 Quick Start</a> •
  <a href="#-architecture">🏗️ Architecture</a> •
  <a href="#-features">✨ Features</a> •
  <a href="#-documentation">📚 Documentation</a>
</p>

---

## 📖 Overview

This is the **official website and CMS** for SMK Muhammadiyah Bligo — a vocational high school in Pekalongan, Central Java. The project serves two audiences:

| Audience | Surface | Description |
|----------|---------|-------------|
| 🌍 **Public Visitors** | Marketing Site | Beranda, Berita, Galeri, Jurusan, Agenda, Kontak, Pencarian |
| 🔧 **CMS Operators** | Admin Dashboard | Content management, AI writing tools, in-app notifications |

**Design identity:** Modern-international, minimalist-elegant, with subtle Islamic/Muhammadiyah motifs.

---

## ✨ Features

### Public Website
- 🏠 **Beranda** — Hero section, emergency announcement banner, featured articles, statistics, top 3 student achievements, gallery showcase
- 📰 **Berita** — Full-featured news/blog with categories, tags, share buttons, related articles, search, and pagination
- 📢 **Pengumuman** — Public announcement directory and detail pages
- 🖼️ **Galeri** — Photo albums, individual album pages with lightbox viewer
- 🎓 **Jurusan** — 5 vocational programs with detailed descriptions and career prospects
- 👨‍🏫 **Guru & Tendik** — Faculty and administrative staff directory with division tabs and program filters
- 🏢 **Fasilitas** — School campus infrastructure and workshop facilities with photo lightbox galleries
- 🏃 **Ekstrakurikuler** — Student activities, Hizbul Wathan scouting, martial arts, and talent clubs
- 🏆 **Prestasi** — Academic and non-academic awards and student achievements directory
- 📅 **Agenda** — School events calendar with detail pages and iCalendar (.ics) export
- 📨 **Kontak** — Contact form with rate-limiting and spam protection
- 🔍 **Pencarian** — Comprehensive search across all public content modules
- 🔗 **Tautan** — Quick links portal
- 🌐 **Bilingual** — Full Indonesian/English content with locale switcher

### Admin CMS
- 📊 **Dashboard** — Real-time statistics, recent activities, quick actions
- ✍️ **Article Management** — Rich text editor (TipTap), tags & category management, draft/review/publish workflow, live draft preview
- 🤖 **AI Writing Tools** — Content generation, revision, grammar correction, SEO analysis, auto-translation
- 📢 **Pengumuman** — Announcement management with urgency levels (info, penting, urgent), TipTap editor, live preview
- 🖼️ **Galeri Management** — Album CRUD with drag-and-drop photo upload
- 📅 **Agenda** — Event management with date ranges and TipTap editor
- 🏫 **Jurusan** — Edit vocational program details with multilingual support
- 📝 **Konten Halaman** — CMS-managed static page content
- 👤 **Profil Saya** — Self-service profile, avatar, and password management for all CMS staff
- 👥 **User Management** — Role-based access (admin, editor, author)
- ⚙️ **Settings** — Site configuration, SMTP setup, AI configuration
- 🔔 **Notifications** — Polling-based in-app notifications
- 📈 **Statistics** — Customizable dashboard statistics with drag-and-drop ordering
- 🏢 **Struktur Organisasi** — Org chart management with photo uploads

### Technical Highlights
- 🔒 **Security** — CSP headers, CSRF protection, HTML sanitization, role-based middleware
- 🌐 **SEO** — Meta tags, JSON-LD, hreflang, auto-generated sitemap
- ⚡ **Performance** — Redis caching, image WebP conversion, eager loading, code splitting
- 📱 **Responsive** — Mobile-first design across all pages

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | PHP | ^8.2 |
| **Framework** | Laravel | ^12.0 |
| **SPA Bridge** | Inertia.js | 2.0 |
| **Frontend** | React | ^19.0 |
| **Language** | TypeScript | ^5.0 (strict mode) |
| **Build** | Vite | ^7.0 |
| **CSS** | Tailwind CSS | ^4.0 |
| **Animations** | Framer Motion | ^12.0 |
| **Rich Editor** | TipTap | ^2.0 |
| **Icons** | Lucide React | latest |
| **Database** | MySQL 8.0 | Dev & Production |
| **Cache/Queue/Session** | Redis | via Predis |
| **AI** | Anthropic Claude | via queue |

<details>
<summary><strong>📦 Full Dependency List</strong></summary>

#### PHP (Composer)

| Package | Purpose |
|---------|---------|
| `inertiajs/inertia-laravel` | Server-side Inertia adapter |
| `spatie/laravel-medialibrary` | Image upload, conversion, responsive images |
| `spatie/laravel-permission` | Role & permission management |
| `spatie/laravel-translatable` | Multilingual content (id/en) |
| `spatie/laravel-sluggable` | Auto-generated URL slugs |
| `spatie/laravel-tags` | Tagging system for articles |
| `spatie/laravel-sitemap` | Auto-generated XML sitemap |
| `spatie/laravel-query-builder` | API-style query parameters |
| `artesaos/seotools` | SEO meta tag generation |
| `ezyang/htmlpurifier` | HTML sanitization for editor content |
| `openai-php/laravel` | AI API client |
| `tightenco/ziggy` | Named route helper for JS |
| `predis/predis` | Redis client |

#### JavaScript (npm)

| Package | Purpose |
|---------|---------|
| `@inertiajs/react` | Client-side Inertia adapter |
| `@tanstack/react-query` | Data fetching & polling (AI jobs) |
| `@tiptap/*` | Rich text editor suite |
| `framer-motion` | Animations & transitions |
| `embla-carousel-react` | Touch-friendly carousels |
| `@dnd-kit/*` | Drag & drop (sortable lists) |
| `i18next` + `react-i18next` | Internationalization |
| `lucide-react` | Icon library |
| `react-hot-toast` | Toast notifications |
| `date-fns` | Date formatting |
| `clsx` + `tailwind-merge` | Conditional class names |
| `ziggy-js` | Client-side named routes |
| `@radix-ui/react-switch` | Accessible switch component |
| `@radix-ui/react-tabs` | Accessible tabs component |

</details>

---

## 🚀 Quick Start

### Prerequisites

- **PHP** >= 8.2 with extensions: `mbstring`, `xml`, `curl`, `mysql`, `redis`
- **Composer** >= 2.x
- **Node.js** >= 20.x with npm
- **MySQL** 8.0+
- **Redis** 6+

### Option A — Local Development (Laragon / Manual)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/smkmuhbligo.sch.id.git
cd smkmuhbligo.sch.id

# 2. Install PHP dependencies
composer install

# 3. Install JavaScript dependencies
npm install

# 4. Configure environment
cp .env.example .env
php artisan key:generate

# 5. Edit .env — configure database, Redis, etc.

# 6. Run migrations and seed the database
php artisan migrate --seed

# 7. Create storage symlink
php artisan storage:link

# 8. Start all services (server + queue + logs + vite)
composer dev
```

The `composer dev` command starts **4 processes concurrently**:

| Service | Port | Purpose |
|---------|------|---------|
| `php artisan serve` | `:8000` | Laravel backend |
| `npm run dev` | `:5173` | Vite dev server (HMR) |
| `php artisan queue:listen` | — | Queue worker (AI jobs) |
| `php artisan pail` | — | Real-time log viewer |

Visit **http://localhost:8000** to see the site.

### Option B — Docker (Sail)

```bash
# 1. Clone and configure
git clone https://github.com/your-org/smkmuhbligo.sch.id.git
cd smkmuhbligo.sch.id
cp .env.example .env

# 2. Update .env for Docker
# DB_HOST=smkmuhbligo-mysql
# REDIS_HOST=smkmuhbligo-redis

# 3. Start containers
docker compose up -d

# 4. Install dependencies inside container
docker compose exec smkmuhbligo-laravel composer install
docker compose exec smkmuhbligo-laravel npm install

# 5. Setup application
docker compose exec smkmuhbligo-laravel php artisan key:generate
docker compose exec smkmuhbligo-laravel php artisan migrate --seed
docker compose exec smkmuhbligo-laravel php artisan storage:link

# 6. Build frontend assets
docker compose exec smkmuhbligo-laravel npm run build
```

Docker services:

| Service | Port | Purpose |
|---------|------|---------|
| `smkmuhbligo-app` | `:80` | Laravel application |
| `smkmuhbligo-mysql` | `:3306` | MySQL 8.0 database |
| `smkmuhbligo-redis` | `:6379` | Redis cache/queue/session |
| `smkmuhbligo-phpmyadmin` | `:8080` | Database admin UI |
| `smkmuhbligo-mailpit` | `:8025` | Email testing UI |

### Default Admin Credentials

After seeding, log in at `/login`:

| Field | Value |
|-------|-------|
| Email | _(check `AdminUserSeeder.php`)_ |
| Password | _(check `AdminUserSeeder.php`)_ |

---

## 🏗️ Architecture

### Inertia.js Monolith — Server-Driven SPA

This project uses **Inertia.js** to bridge Laravel and React — there is **no REST API** and **no client-side router**. All routing happens in `routes/web.php`, and Laravel controllers render React pages via `Inertia::render()`.

```
Browser ─── Inertia XHR ───► Laravel Controller ───► Inertia::render('Page', $props)
                                    │                          │
                                    ▼                          ▼
                              Form Requests            React Page Component
                              API Resources            (receives typed props)
                              Eloquent Models
                              Service Classes
```

### Project Structure

```
smkmuhbligo.sch.id/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/           # 16 controllers — CRUD for all CMS modules
│   │   │   ├── Auth/            # Login + password reset
│   │   │   └── Public/          # 10 controllers — public-facing pages
│   │   ├── Middleware/          # Inertia, CSP, Locale, Role guard, Performance
│   │   ├── Requests/           # Form Request validation classes
│   │   └── Resources/          # API Resources for Inertia serialization
│   ├── Models/                  # 22 Eloquent models
│   ├── Services/                # AiService, HtmlSanitizer, Notifikasi, EmailConfig
│   ├── Observers/               # AiJobObserver, ArticleObserver
│   ├── Jobs/                    # ProcessAiJob, TranslateHalamanKonten, etc.
│   └── Mail/                    # PesanKontakMasukMail, TestEmailMail
│
├── resources/
│   ├── css/app.css              # Design tokens, Tailwind v4 @theme, base styles
│   └── js/
│       ├── app.tsx              # Inertia bootstrap + Ziggy setup
│       ├── Pages/
│       │   ├── Admin/           # 13 module directories + Dashboard.tsx
│       │   ├── Auth/            # Login, ForgotPassword, ResetPassword
│       │   ├── Public/          # Beranda, Berita, Galeri, Jurusan, Agenda, etc.
│       │   └── Errors/          # Error pages
│       ├── Components/
│       │   ├── UI/              # 18 reusable primitives (Button, Modal, Table, etc.)
│       │   ├── Admin/           # AdminSidebar, AdminTopbar
│       │   ├── Layout/          # Navbar, Footer
│       │   └── Editor/          # TipTap editor + AI integration (6 components)
│       ├── Layouts/             # AdminLayout, PublicLayout
│       ├── hooks/               # useAiJob (AI polling hook)
│       ├── lib/                 # utils.ts (cn, formatDate, etc.), motion.ts (Framer presets)
│       └── types/               # TypeScript interfaces (all models + shared props)
│
├── routes/web.php               # All routes (~214 lines)
├── database/
│   ├── migrations/              # 30 migration files
│   └── seeders/                 # 12 seeder files
│
├── config/                      # App config + 3rd party (AI, SEO, media, permissions, etc.)
├── deploy/                      # Apache configs, supervisor, deployment script
├── docker/                      # Dockerfile + MySQL init scripts
└── docker-compose.yml           # Full Docker stack (app, mysql, redis, phpmyadmin, mailpit)
```

### Data Flow Patterns

#### Standard Page Rendering
```
routes/web.php → Controller → FormRequest (validation)
                            → Eloquent Model (data)
                            → API Resource (serialization)
                            → Inertia::render('Page', $props) → React Component
```

#### AI Content Generation
```
React (AiToolbar) ──POST──► AiController ──dispatch──► ProcessAiJob (queue)
                                                              │
React (useAiJob) ──GET poll──► AiController@jobStatus    AiService (Anthropic)
(every 2 seconds)                                             │
                                                        Updates AiJob record
React (AiPanel) ← preview ← accept/reject              (done | failed)
```

---

## 🗄️ Data Models

**22 Eloquent models** organized by domain:

| Model | Translatable | Media | Key Features |
|-------|:---:|:---:|---|
| `User` | — | ✅ | Roles: admin, editor, author |
| `Article` | ✅ | ✅ | draft → pending_review → published → archived |
| `Category` | ✅ | — | Article categories with color |
| `Jurusan` | ✅ | — | 5 fixed vocational programs |
| `Galeri` | ✅ | ✅ | Photo albums |
| `Pengumuman` | ✅ | — | Types: info, penting, urgent |
| `Agenda` | ✅ | — | School events/calendar |
| `HalamanKonten` | ✅ | — | CMS-managed static pages |
| `Tautan` | — | — | External important links |
| `Pengaturan` | — | — | Key-value site settings |
| `Statistik` | — | — | Dashboard stats (sortable) |
| `StrukturOrganisasi` | — | ✅ | Org chart members (sortable) |
| `PesanKontak` | — | — | Contact form submissions |
| `NotifikasiAdmin` | — | — | In-app CMS notifications |
| `AiJob` | — | — | AI task tracking & results |

Translation tables use `{model}_translations` naming convention with Spatie Translatable. Supported locales: `id` (Indonesian), `en` (English).

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-600` | `#003f87` | Brand primary — buttons, links, headers |
| `primary-900` | `#001f4d` | Dark sections, navbars |
| `gold-500` | `#c9a84c` | Prestige accent — badges, dividers |
| `neutral-900` | `#111111` | Body text |
| `neutral-500` | `#636366` | Secondary text |
| `neutral-0` | `#ffffff` | Page background |
| `neutral-50` | `#f2f2f7` | Section/admin background |

### Typography

| Font | Weights | Usage |
|------|---------|-------|
| **Plus Jakarta Sans** | 300–800 | Primary — all UI, body, headings |
| **Playfair Display** | 700, 800 | Accent — hero headlines only |

### Animation Presets (`lib/motion.ts`)

| Preset | Description |
|--------|-------------|
| `fadeInUp` | Scroll reveal (y: 30→0, 600ms) |
| `fadeIn` | Opacity-only reveal (500ms) |
| `staggerContainer` | Stagger children (0.12s gap) |
| `scaleIn` | Scale + opacity entrance |
| `slideFromLeft/Right` | Horizontal entrance |
| `heroStagger` | Hero section stagger (0.2s) |
| `cardHover` | Card hover effect (y: -6) |

---

## 🔐 Roles & Permissions

| Role | Access |
|------|--------|
| **Admin** | Full access — all modules, settings, users, statistics, structure |
| **Editor** | Articles, gallery, announcements, agenda, jurusan, notifications, messages |
| **Author** | Same as Editor (article workflow may require admin approval) |

All admin routes are guarded by `auth` + `EnsureHasCmsRole` middleware. Sensitive modules (settings, users, stats) require `role:admin`.

---

## 🧪 Development

### Available Scripts

```bash
# Start all development services concurrently
composer dev

# Start individual services
php artisan serve              # Laravel server
npm run dev                    # Vite dev server (HMR)
php artisan queue:listen       # Queue worker

# Code quality
npm run type-check             # TypeScript type checking
./vendor/bin/pint              # PHP code style (PSR-12)

# Database
php artisan migrate            # Run migrations
php artisan migrate:fresh --seed  # Reset & seed database
php artisan db:seed            # Seed database

# Build for production
npm run build                  # Vite production build
```

### Seeding Order

```
RoleSeeder → AdminUserSeeder → CategorySeeder → JurusanSeeder →
TautanSeeder → GaleriSeeder → ArticleSeeder → PengaturanSeeder
```

### Key Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `DB_CONNECTION` | `mysql` | Database driver (`mysql`) |
| `QUEUE_CONNECTION` | `redis` | Queue backend |
| `SESSION_DRIVER` | `redis` | Session storage |
| `CACHE_STORE` | `redis` | Cache backend |
| `ANTHROPIC_API_KEY` | — | Anthropic AI key (server-side only) |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-20250514` | AI model name (default in config/ai.php) |
| `AI_MAX_TOKENS` | `4096` | Max tokens per AI request |
| `APP_LOCALE` | `id` | Default locale |
| `APP_AVAILABLE_LOCALES` | `id,en` | Supported locales |

---

## 🚢 Deployment

### Production Setup

A comprehensive deployment script is provided at `deploy/deploy.sh`. See also:

- `deploy/CHECKLIST_PRE_LAUNCH.md` — Pre-launch verification checklist
- `deploy/apache/` — Apache virtual host configuration
- `deploy/supervisor/` — Supervisor configs for queue workers
- `deploy/php-fpm/` — PHP-FPM pool configuration
- `.env.production.example` — Production environment template

### Quick Production Deploy

```bash
# 1. Copy production env template
cp .env.production.example .env
# Fill in all sensitive values (DB, Redis, SMTP, AI keys)

# 2. Install production dependencies
composer install --optimize-autoloader --no-dev
npm ci && npm run build

# 3. Generate app key
php artisan key:generate

# 4. Run migrations
php artisan migrate --force

# 5. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 6. Create storage symlink
php artisan storage:link

# 7. Start queue worker (via Supervisor recommended)
php artisan queue:work redis --queue=default,ai --tries=3
```

### Backup

See [`BACKUP_SETUP.md`](./BACKUP_SETUP.md) for database and storage backup procedures.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`AGENTS.md`](./AGENTS.md) | Comprehensive AI agent reference — architecture, conventions, hard rules |
| [`docs/phase-*.md`](./docs/) | Phase implementation guides (phase-0.md through phase-8.md) |
| [`BACKUP_SETUP.md`](./BACKUP_SETUP.md) | Database & storage backup/restore procedures |
| [`.env.example`](./.env.example) | Local development environment template |
| [`.env.production.example`](./.env.production.example) | Production environment template (annotated) |
| [`deploy/CHECKLIST_PRE_LAUNCH.md`](./deploy/CHECKLIST_PRE_LAUNCH.md) | Pre-launch verification checklist |

---

## 📁 Coding Conventions

### PHP / Laravel
- **PSR-12** coding standard (enforced via Laravel Pint)
- Always use `FormRequest` for validation — never validate in controllers
- Always use `Resource` classes for Inertia data serialization
- Return type hints on all methods
- Eager-load relationships to avoid N+1

### React / TypeScript
- Functional components only — no class components
- All props must have typed `interface`
- Use `cn()` for conditional classNames
- Use `usePage<SharedProps>()` for shared Inertia data
- Use Inertia `<Link>` / `router` for navigation
- Use `route()` (Ziggy) for named route URLs

### Tailwind CSS v4
- Mobile-first responsive design
- Class order: layout → spacing → typography → color → animation → state
- Use `@apply` only in `app.css`, not in components
- Never hardcode hex colors in JSX

> **Full details:** See [`AGENTS.md`](./AGENTS.md) §8–9 for complete coding rules and prohibitions.

---

## 📄 License

This project is proprietary software developed for SMK Muhammadiyah Bligo, Pekalongan, Central Java, Indonesia.

---

<p align="center">
  <sub>Built with ❤️ for <strong>SMK Muhammadiyah Bligo</strong> — Mencetak Generasi Unggul dan Berakhlak</sub>
</p>
