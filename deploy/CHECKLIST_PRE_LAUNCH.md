# =============================================================================
# Pre-Launch Checklist — SMK Muhammadiyah Bligo
# Server  : VPS Ubuntu 22.04+, Apache2 + PHP-FPM 8.3
# Database: MySQL 8 (utf8mb4_unicode_ci)
# Domain  : smkmuhbligo.sch.id
# App dir : /var/www/smkmuhbligo
# Updated : 2026-11-18
# =============================================================================

Tandai setiap item dengan [x] setelah selesai dikerjakan.
Ikuti urutan dari atas ke bawah — JANGAN loncat!

# ─── FASE 1: SERVER SETUP ─────────────────────────────────────────────────────

## 1.1 Software Stack
- [ ] Apache2 terinstall dan berjalan:
      `sudo systemctl status apache2`
- [ ] PHP 8.3 + PHP-FPM terinstall:
      `php8.3 --version` dan `sudo systemctl status php8.3-fpm`
- [ ] MySQL 8 terinstall dan berjalan:
      `sudo systemctl status mysql`
- [ ] Redis terinstall dan berjalan:
      `redis-cli ping` → harus reply `PONG`
- [ ] Supervisor terinstall:
      `supervisord --version`
- [ ] Node.js v20+ terinstall (untuk build & SSR):
      `node --version`
- [ ] Composer v2 terinstall:
      `composer --version`
- [ ] Git terinstall:
      `git --version`

## 1.2 PHP Extensions Wajib
Run: `php8.3 -m` — pastikan semua extension ini ada:
- [ ] pdo_mysql + mysqlnd
- [ ] redis
- [ ] gd ATAU imagick (untuk Spatie Media Library — konversi WebP)
- [ ] exif
- [ ] bcmath
- [ ] mbstring
- [ ] xml
- [ ] tokenizer
- [ ] curl
- [ ] zip
- [ ] intl
- [ ] opcache

## 1.3 Database Setup (MySQL 8)
```sql
CREATE DATABASE smkmuhbligo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smkuser'@'localhost' IDENTIFIED BY '<<PASSWORD_KUAT_ACAK>>';
GRANT ALL PRIVILEGES ON smkmuhbligo.* TO 'smkuser'@'localhost';
FLUSH PRIVILEGES;
```
- [ ] Database dibuat dengan charset `utf8mb4` dan collation `utf8mb4_unicode_ci`
- [ ] User database dengan hak terbatas dibuat dan terverifikasi bisa login

# ─── FASE 2: KONFIGURASI APACHE2 & SUPERVISOR ─────────────────────────────────

## 2.1 Aktifkan Apache Modules
```bash
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod proxy_fcgi
sudo a2enmod proxy_http
sudo a2enmod setenvif
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enconf php8.3-fpm
sudo systemctl reload apache2
```
- [ ] Semua module berhasil diaktifkan
- [ ] `sudo apache2ctl -M` → daftar module aktif tidak ada error

## 2.2 Install Virtual Host Config
```bash
sudo cp deploy/apache/smkmuhbligo.sch.id.conf /etc/apache2/sites-available/
sudo a2ensite smkmuhbligo.sch.id
sudo a2dissite 000-default
sudo apachectl configtest    # harus "Syntax OK"
sudo systemctl reload apache2
```
- [ ] Config berhasil di-enable
- [ ] Default virtual host di-disable
- [ ] `apachectl configtest` → Syntax OK

## 2.3 Install PHP-FPM Pool Config
```bash
sudo cp deploy/php-fpm/smkmuhbligo.conf /etc/php/8.3/fpm/pool.d/
sudo systemctl reload php8.3-fpm
```
- [ ] Pool `smkmuhbligo` aktif
- [ ] Socket `/run/php/php8.3-fpm-smkmuhbligo.sock` terbuat
- [ ] `sudo systemctl status php8.3-fpm` → active (running)

## 2.4 Install Supervisor Config (Worker default, ai & SSR)
```bash
sudo cp deploy/supervisor/smkmuhbligo-worker.conf /etc/supervisor/conf.d/
sudo cp deploy/supervisor/smkmuhbligo-ssr.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```
- [ ] `smkmuhbligo-worker:smkmuhbligo-worker_00` (queue default,ai) → RUNNING
- [ ] `smkmuhbligo-worker:smkmuhbligo-worker_01` (queue default,ai) → RUNNING
- [ ] `smkmuhbligo-ssr:smkmuhbligo-ssr_00` (Inertia SSR server port 13714) → RUNNING

# ─── FASE 3: SSL CERTIFICATE ──────────────────────────────────────────────────

## 3.1 Let's Encrypt (Certbot)
```bash
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d smkmuhbligo.sch.id -d www.smkmuhbligo.sch.id
sudo certbot renew --dry-run
```
- [ ] Sertifikat berhasil digenerate
- [ ] Auto-renew berfungsi (dry-run sukses)
- [ ] Browser menampilkan gembok hijau di https://smkmuhbligo.sch.id

# ─── FASE 4: DEPLOY APLIKASI ─────────────────────────────────────────────────

## 4.1 Repository Setup
```bash
sudo mkdir -p /var/www/smkmuhbligo
sudo chown -R www-data:www-data /var/www/smkmuhbligo
# Clone repository ke server
git clone git@github.com:<<repo>>.git /var/www/smkmuhbligo
```
- [ ] Repository berhasil di-clone

## 4.2 Environment Configuration
```bash
cp deploy/.env.production /var/www/smkmuhbligo/.env
cd /var/www/smkmuhbligo
php8.3 artisan key:generate
nano .env
```
- [ ] `APP_KEY` sudah di-generate baru di server
- [ ] `DB_CONNECTION=mysql`, `DB_PORT=3306`, `DB_DATABASE=smkmuhbligo`
- [ ] `CSP_REPORT_ONLY=false`
- [ ] `TELESCOPE_ENABLED=false`
- [ ] `REDIS_PASSWORD`, `ANTHROPIC_API_KEY`, `MAIL_*` sudah diisi
- [ ] Verifikasi tidak ada sisa placeholder: `grep -n "WAJIB_DIISI" .env` → kosong
- [ ] Test koneksi DB: `php8.3 artisan db:show`
- [ ] Test Redis: `php8.3 artisan tinker --execute="echo Cache::put('t',1)?'ok':'fail';"`

## 4.3 Jalankan Deployment & Optimasi
```bash
chmod +x deploy/deploy.sh
bash deploy/deploy.sh
php8.3 artisan inertia:start-ssr
php8.3 artisan media-library:regenerate --only-missing --force
```
- [ ] Deploy script berjalan tanpa error
- [ ] SSR server aktif dan melayani render pra-halaman
- [ ] Varian gambar WebP terkonversi lengkap

## 4.4 Storage & Permissions
```bash
cd /var/www/smkmuhbligo
php8.3 artisan storage:link
sudo chown -R www-data:www-data /var/www/smkmuhbligo
sudo chmod -R 755 /var/www/smkmuhbligo
sudo chmod -R 775 /var/www/smkmuhbligo/storage
sudo chmod -R 775 /var/www/smkmuhbligo/bootstrap/cache
sudo chmod 640 /var/www/smkmuhbligo/.env
```
- [ ] Symlink `public/storage` terhubung dengan benar
- [ ] Permission `.env` 640 aman

# ─── FASE 5: VERIFIKASI FUNGSIONAL & KONTEN ───────────────────────────────────

## 5.1 Halaman Publik & SSR
- [ ] Beranda: https://smkmuhbligo.sch.id
- [ ] View Source: Tag meta, JSON-LD, dan konten SSR muncul tanpa eksekusi JS klien
- [ ] Jurusan: https://smkmuhbligo.sch.id/jurusan
- [ ] Berita: https://smkmuhbligo.sch.id/berita
- [ ] Pengumuman: https://smkmuhbligo.sch.id/pengumuman
- [ ] Agenda: https://smkmuhbligo.sch.id/agenda
- [ ] Galeri: https://smkmuhbligo.sch.id/galeri
- [ ] Tentang: https://smkmuhbligo.sch.id/tentang
- [ ] Kontak: https://smkmuhbligo.sch.id/kontak
- [ ] Sitemap: https://smkmuhbligo.sch.id/sitemap.xml
- [ ] Robots: https://smkmuhbligo.sch.id/robots.txt

## 5.2 Pemeriksaan Konten Contoh
```bash
php8.3 artisan smk:cek-konten-contoh
```
- [ ] Hasil pemindaian: 0 temuan (semua placeholder dan data seeder contoh telah diganti konten riil sekolah)

## 5.3 Admin Panel & Keamanan
- [ ] Login admin & 2FA TOTP: https://smkmuhbligo.sch.id/admin/login
- [ ] Buat artikel baru + upload cover WebP
- [ ] Security headers terverifikasi di https://securityheaders.com/
- [ ] Akses langsung ke `/.env` menghasilkan HTTP 403 Forbidden

# ─── FASE 6: CRON, BACKUP & MONITORING ────────────────────────────────────────

## 6.1 Laravel Scheduler (Cron)
```bash
# Crontab www-data:
* * * * * php8.3 /var/www/smkmuhbligo/artisan schedule:run >> /dev/null 2>&1
```
- [ ] Scheduler aktif di crontab www-data
- [ ] `php8.3 artisan schedule:list` mencakup `smk:lapor-job-gagal` setiap jam

## 6.2 Backup Otomatis MySQL & Storage
- [ ] Konfigurasi `~/.my.cnf` permission 600 untuk kredensial mysqldump aman tanpa password literal
- [ ] Skrip `deploy/backup/backup_db.sh` dijadwalkan pukul 02:00 WIB (retensi 30 hari)
- [ ] Skrip `deploy/backup/backup_storage.sh` dijadwalkan pukul 03:00 WIB
- [ ] Uji coba pemulihan database (restore) di staging berhasil dan didokumentasikan (merujuk `BACKUP_SETUP.md`)

## 6.3 External Uptime Monitoring
- [ ] Endpoint `/health` didaftarkan ke layanan monitoring eksternal (misal UptimeRobot / Better Uptime)
