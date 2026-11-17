# Phase 8 — Rilis Produksi MySQL & Serah Terima

> Rangkaian `docs/phase-0.md` … `docs/phase-8.md`. Phase terakhir menuju **v1.0 Landing Page & CMS Lengkap**.

---

## Global Directives (wajib)

1. **AGENTS.md §0 menang.** Dilarang menulis/menjalankan test PHP. Boleh: Pint, PHPStan, ESLint, `tsc`, `npx vitest run`.
2. **Continuous Coding First** — tulis semua perubahan dulu; jangan lint per file.
3. **Single-Pass End Verification** — `npm run verify` sekali di akhir sesi.
4. **One-Liner Execution** — `npm run verify && git add -A && git commit -m "..."`.
5. **Zero Scope Creep** — tidak ada fitur baru di phase ini. Tanpa worktree, tanpa push/PR. Agent **tidak** menyentuh server produksi atau `.env` produksi.
6. **Anti-halusinasi** — baca `deploy/`, `.env.production.example`, `config/database.php`, `config/filesystems.php` sebelum menulis. Bila berbeda dari instruksi → berhenti & laporkan.
7. **Rahasia** — skrip tidak boleh memuat password; kredensial dibaca dari file opsi (`~/.my.cnf`) atau env.
8. **Laporan akhir** — file diubah, output verify apa adanya, centang DoD.

---

## Konteks Phase

- **Tujuan:** merilis v1.0 ke produksi MySQL dengan backup yang terbukti bisa dipulihkan, lalu menyerahkannya ke operator sekolah.
- **Syarat awal:** DoD Phase 7 lulus; server produksi & domain tersedia; pemilik menunjuk operator untuk UAT.
- **Kondisi awal:** `deploy/CHECKLIST_PRE_LAUNCH.md` & `BACKUP_SETUP.md` ditulis untuk PostgreSQL; backup hanya panduan manual, belum pernah diuji restore; konten masih contoh; belum ada panduan operator dan CHANGELOG.
- **Kondisi akhir:** dokumen deploy & backup untuk MySQL 8; skrip backup otomatis DB + storage; pemantauan & peringatan job gagal; perintah pemeriksa konten contoh; panduan operator; CHANGELOG; tag `v1.0.0` lokal.
- **Di luar cakupan phase:** fitur baru, perubahan cakupan.

### DoD Phase 8 (= DoD v1.0)
- [ ] Seluruh item `deploy/CHECKLIST_PRE_LAUNCH.md` (versi MySQL) dicentang pemilik.
- [ ] Uji restore dari backup otomatis berhasil dan tercatat (Sesi 8-07).
- [ ] `php artisan smk:cek-konten-contoh` di produksi → 0 temuan.
- [ ] UAT ditandatangani pemilik; tidak ada temuan kritis/tinggi terbuka.
- [ ] Tag `v1.0.0` dibuat dari commit dengan CI hijau.

---

## [Sesi 8-01] - Checklist Pra-Rilis versi MySQL
- **Scope:** `deploy/CHECKLIST_PRE_LAUNCH.md`.
- **Implementation:** tulis ulang seluruh bagian PostgreSQL: paket `mysql-server` 8 / MariaDB tidak dipakai; ekstensi `pdo_mysql`; pembuatan DB `utf8mb4_unicode_ci` & user dengan hak terbatas; Supervisor untuk worker antrean `default,ai` dan program SSR (Phase 7); langkah `php artisan inertia:start-ssr`; `CSP_REPORT_ONLY=false`; `TELESCOPE_ENABLED=false`; `media-library:regenerate`; cron scheduler; bagian backup merujuk Sesi 8-02. Hapus semua perintah `pg_*`/`psql`.
- **Finish & Commit (Run at End):**
  `git add deploy/CHECKLIST_PRE_LAUNCH.md && git commit -m "docs(deploy): checklist pra-rilis untuk mysql"`
- **DoD:** `grep -n "pg_\|psql\|PostgreSQL" deploy/CHECKLIST_PRE_LAUNCH.md` → kosong.

## [Sesi 8-02] - Backup Otomatis DB & Storage
- **Scope:** `deploy/backup/backup_db.sh`, `deploy/backup/backup_storage.sh` (baru), `BACKUP_SETUP.md`.
- **Implementation:**
  1. `backup_db.sh`: `set -euo pipefail`; `mysqldump --defaults-extra-file="$MYSQL_OPTS" --single-transaction --routines --triggers "$DB_NAME" | gzip > "$DIR/$(date +%Y%m%d_%H%M%S).sql.gz"`; retensi 30 hari (`find -mtime +30 -delete`); variabel dari env/argumen, tanpa password literal.
  2. `backup_storage.sh`: `rsync -az --delete` `storage/app/public/` **dan** disk privat berkas unduhan (cek `config/filesystems.php`) ke tujuan offsite dari env.
  3. `BACKUP_SETUP.md`: tulis ulang untuk MySQL (setup `~/.my.cnf` permission 600, cron 02:00 & 03:00 WIB, prosedur restore `gunzip -c ... | mysql`, verifikasi bulanan).
- **Finish & Commit (Run at End):**
  `git add deploy/backup BACKUP_SETUP.md && git commit -m "feat(backup): skrip backup mysql dan storage, panduan restore"`
- **DoD:** tidak ada password literal; `grep -n "pg_dump\|psql" BACKUP_SETUP.md` → kosong.

## [Sesi 8-03] - Bersihkan Sisa PostgreSQL
- **Scope:** `.env.production.example`, `README.md`, `deploy/deploy.sh`, file lain hasil `grep -rln "pgsql\|postgres" --exclude-dir=vendor --exclude-dir=node_modules .`.
- **Implementation:** `DB_CONNECTION=mysql`, `DB_PORT=3306`, contoh nama DB; hapus langkah/variabel khusus PostgreSQL di deploy script; README produksi = MySQL. Jangan ubah `config/database.php` bawaan Laravel.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "chore(deploy): hapus sisa konfigurasi postgresql"`
- **DoD:** grep di scope hanya menyisakan `config/database.php` bawaan.

## [Sesi 8-04] - Pemantauan & Peringatan
- **Scope:** `app/Console/Commands/LaporJobGagal.php` (baru), `app/Mail/JobGagalMail.php` (baru), `routes/console.php`, `config/logging.php`, `.env.production.example`.
- **Implementation:**
  1. Perintah `smk:lapor-job-gagal`: bila ada baris `failed_jobs` baru sejak laporan terakhir (simpan timestamp di cache), kirim email ringkasan ke `email_admin_address` (Pengaturan). Jadwal per jam.
  2. Logging produksi: channel `daily` retensi 14 hari (`LOG_STACK=daily`, `LOG_DAILY_DAYS=14`).
  3. Dokumentasikan di checklist: pantau `/health` dengan uptime monitor eksternal (pemilik memilih layanan).
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(ops): peringatan job gagal dan rotasi log"`
- **DoD:** jadwal per jam terdaftar.

## [Sesi 8-05] - Pemeriksa Konten Contoh
- **Scope:** `app/Console/Commands/CekKontenContoh.php` (baru).
- **Implementation:** perintah `smk:cek-konten-contoh` memindai kolom judul/nama di semua model konten & translasinya untuk awalan `Contoh – ` dan URL placeholder; mencetak tabel (model, id, kolom, nilai) dan exit code 1 bila ada temuan. Agent tidak menjalankannya.
- **Finish & Commit (Run at End):**
  `npm run verify && git add -A && git commit -m "feat(ops): perintah pemeriksa konten contoh"`
- **DoD:** semua model konten Phase 3–5 tercakup.

## [Sesi 8-06] - Panduan Operator & CHANGELOG
- **Scope:** `PANDUAN_OPERATOR.md` (root, baru), `CHANGELOG.md` (baru).
- **Implementation:**
  1. Panduan berbahasa Indonesia untuk operator sekolah: login & 2FA, kode pemulihan, menulis artikel & alur review, pratinjau, mengelola media & alt text, pengumuman/agenda, modul profil & informasi, Pengaturan (termasuk `spmb_url`, toggle), apa yang **tidak** ada di situs ini (arahkan ke Portal), prosedur reset 2FA oleh Admin. Tempat screenshot ditandai `[Screenshot: …]` untuk diisi pemilik.
  2. CHANGELOG format Keep a Changelog: ringkasan per phase 0–8 dari riwayat commit (`git log --oneline`), versi `1.0.0`.
- **Finish & Commit (Run at End):**
  `git add PANDUAN_OPERATOR.md CHANGELOG.md && git commit -m "docs: panduan operator dan changelog 1.0.0"`
- **DoD:** setiap modul CMS punya bagian di panduan.

## [Sesi 8-07] - Uji Restore, Konten Nyata, UAT [MANUAL PEMILIK]
- **Scope:** server staging/produksi. Bukan pekerjaan agent.
- **Implementation:**
  1. Pulihkan backup otomatis terbaru ke staging; cocokkan jumlah baris tabel utama & buka 5 URL media acak; catat tanggal & hasil.
  2. Operator mengganti seluruh konten contoh; jalankan `php artisan smk:cek-konten-contoh` sampai 0 temuan.
  3. UAT per peran (Admin, Editor, Author) memakai checklist BR-001 (AGENTS.md §17) + Lighthouse (Phase 7). Temuan dicatat sebagai sesi perbaikan `8-07a`, `8-07b`, … dengan format sesi yang sama.
- **Finish & Commit (Run at End):** tidak ada commit (kecuali sesi perbaikan).
- **DoD:** catatan restore ada; UAT ditandatangani.

## [Sesi 8-08] - Rilis v1.0.0
- **Scope:** `public/build`, tag git lokal.
- **Implementation:**
  1. Pastikan working tree bersih dan commit terakhir sudah hijau di CI (konfirmasi pemilik).
  2. `npm run build`; commit aset bila berubah.
  3. Buat tag beranotasi `v1.0.0` (jangan push — pemilik yang push).
- **Finish & Commit (Run at End):**
  `npm run verify && npm run build && git add -A && git commit -m "build(release): aset v1.0.0" ; git tag -a v1.0.0 -m "v1.0.0 Landing Page & CMS Lengkap"`
- **DoD:** `git tag -l v1.0.0` menampilkan tag; seluruh DoD Phase 8 tercentang.

---

## Ringkasan Sesi

| Sesi | Nama |
|------|------|
| 8-01 | Checklist pra-rilis MySQL |
| 8-02 | Backup otomatis DB & storage |
| 8-03 | Bersihkan sisa PostgreSQL |
| 8-04 | Pemantauan & peringatan |
| 8-05 | Pemeriksa konten contoh |
| 8-06 | Panduan operator & CHANGELOG |
| 8-07 | Uji restore, konten nyata, UAT (manual) |
| 8-08 | Rilis v1.0.0 |
