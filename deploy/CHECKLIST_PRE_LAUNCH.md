# =============================================================================

# Pre-Launch Checklist — SMK Muhammadiyah Bligo

# Server : VPS Ubuntu 22.04+, Apache2 + PHP-FPM 8.3

# Domain : smkmuhbligo.sch.id

# App dir : /var/www/smkmuhbligo

# Updated : 2026-03-06

# =============================================================================

#

# Tandai setiap item dengan [x] setelah selesai dikerjakan.

# Ikuti urutan dari atas ke bawah — JANGAN loncat!

# ─── FASE 1: SERVER SETUP ─────────────────────────────────────────────────────

## 1.1 Software Stack

- [ ] Apache2 terinstall dan berjalan:
      `sudo systemctl status apache2`
- [ ] PHP 8.3 + PHP-FPM terinstall:
      `php8.3 --version` dan `sudo systemctl status php8.3-fpm`
- [ ] PostgreSQL terinstall dan berjalan:
      `sudo systemctl status postgresql`
- [ ] Redis terinstall dan berjalan:
      `redis-cli ping` → harus reply `PONG`
- [ ] Supervisor terinstall:
      `supervisord --version`
- [ ] Node.js v20+ terinstall (untuk build):
      `node --version`
- [ ] Composer v2 terinstall:
      `composer --version`
- [ ] Git terinstall:
      `git --version`

## 1.2 PHP Extensions Wajib

Run: `php8.3 -m` — pastikan semua extension ini ada:

- [ ] pdo_pgsql + pgsql
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

# ─── FASE 2: KONFIGURASI APACHE2 ─────────────────────────────────────────────

## 2.1 Aktifkan Apache Modules

```bash
sudo a2enmod rewrite
sudo a2enmod ssl
sudo a2enmod proxy_fcgi
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
# Opsional: disable pool www default
# sudo mv /etc/php/8.3/fpm/pool.d/www.conf /etc/php/8.3/fpm/pool.d/www.conf.disabled
sudo systemctl reload php8.3-fpm
```

- [ ] Pool `smkmuhbligo` aktif
- [ ] Socket `/run/php/php8.3-fpm-smkmuhbligo.sock` terbuat
- [ ] `sudo systemctl status php8.3-fpm` → active (running)

## 2.4 Install Supervisor Config

```bash
sudo cp deploy/supervisor/smkmuhbligo-worker.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl status
```

- [ ] `smkmuhbligo-worker:smkmuhbligo-worker_00` → RUNNING
- [ ] `smkmuhbligo-worker:smkmuhbligo-worker_01` → RUNNING

# ─── FASE 3: SSL CERTIFICATE ──────────────────────────────────────────────────

## 3.1 Let's Encrypt (Certbot)

```bash
# Install Certbot Apache plugin
sudo apt install certbot python3-certbot-apache -y

# Generate SSL (Apache HTTP config harus sudah aktif)
sudo certbot --apache -d smkmuhbligo.sch.id -d www.smkmuhbligo.sch.id

# Test auto-renew
sudo certbot renew --dry-run
```

- [ ] Sertifikat berhasil digenerate
- [ ] Auto-renew berfungsi (dry-run sukses)
- [ ] Browser menampilkan gembok hijau di https://smkmuhbligo.sch.id
- [ ] SSL Grade A di: https://www.ssllabs.com/ssltest/analyze.html?d=smkmuhbligo.sch.id

# ─── FASE 4: DEPLOY APLIKASI ─────────────────────────────────────────────────

## 4.1 Repository Setup

```bash
# Clone repository ke server
sudo mkdir -p /var/www/smkmuhbligo
sudo chown smgo3811:smgo3811 /var/www/smkmuhbligo
git clone git@github.com:<<repo>>.git /var/www/smkmuhbligo
```

- [ ] Repository berhasil di-clone
- [ ] SSH key server sudah ditambahkan ke GitHub/GitLab

## 4.2 Environment Configuration

```bash
cp deploy/.env.production /var/www/smkmuhbligo/.env
cd /var/www/smkmuhbligo
php8.3 artisan key:generate    # JANGAN skip — generate baru di server!
nano .env                      # Isi semua <<WAJIB_DIISI>>
```

- [ ] APP_KEY sudah di-generate (bukan copy dari lokal)
- [ ] DB\_\* sudah diisi (PostgreSQL)
- [ ] REDIS_PASSWORD sudah diisi
- [ ] ANTHROPIC_API_KEY sudah diisi
- [ ] MAIL\_\* sudah diisi
- [ ] Verifikasi tidak ada sisa placeholder:
      `grep -n "WAJIB_DIISI" .env` → harus kosong
- [ ] Test koneksi DB: `php8.3 artisan db:show`
- [ ] Test Redis: `php8.3 artisan tinker --execute="echo Cache::put('t',1)?'ok':'fail';"`

## 4.3 Jalankan Deployment

```bash
chmod +x deploy/deploy.sh
# Full deployment:
bash deploy/deploy.sh

# Atau step by step jika ingin aman:
bash deploy/deploy.sh --skip-migrate  # deploy tanpa migrate dulu
php8.3 artisan migrate --pretend      # preview migration
php8.3 artisan migrate --force        # jalankan migration
```

- [ ] Deploy script berjalan tanpa error
- [ ] `php8.3 artisan up` berhasil (maintenance mode off)

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

- [ ] `public/storage` symlink mengarah ke `../storage/app/public`
- [ ] `ls -la /var/www/smkmuhbligo/.env` → permission 640, owner www-data
- [ ] Apache bisa baca/tulis storage dan bootstrap/cache

## 4.5 .htaccess Check

```bash
ls -la /var/www/smkmuhbligo/public/.htaccess
```

- [ ] File `.htaccess` ada di `public/`
- [ ] `mod_rewrite` aktif (sudah di-enable di fase 2.1)

# ─── FASE 5: VERIFIKASI FUNGSIONAL ───────────────────────────────────────────

## 5.1 Halaman Publik (cek di browser)

- [ ] Homepage: https://smkmuhbligo.sch.id
- [ ] Jurusan: https://smkmuhbligo.sch.id/jurusan
- [ ] Berita: https://smkmuhbligo.sch.id/berita
- [ ] Galeri: https://smkmuhbligo.sch.id/galeri
- [ ] Tentang: https://smkmuhbligo.sch.id/tentang
- [ ] Kontak: https://smkmuhbligo.sch.id/kontak
- [ ] Sitemap: https://smkmuhbligo.sch.id/sitemap.xml
- [ ] Robots: https://smkmuhbligo.sch.id/robots.txt

## 5.2 Admin Panel

- [ ] Login: https://smkmuhbligo.sch.id/admin/login
- [ ] Dashboard admin bisa diakses
- [ ] Buat artikel baru + upload gambar cover (test WebP conversion)
- [ ] Upload galeri foto (> 5MB, harus sukses ≤ 20MB)
- [ ] Logout berfungsi

## 5.3 AI Editor

```bash
# Dapatkan CSRF token dari halaman admin, lalu:
curl -X POST https://smkmuhbligo.sch.id/admin/ai/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: <<session_cookie>>" \
  -H "X-XSRF-TOKEN: <<xsrf_token>>" \
  -d '{"action":"generate","prompt":"Tulis paragraf tentang SMK Muhammadiyah Bligo"}'
```

- [ ] Response berisi `job_id`
- [ ] Polling `GET /admin/ai/jobs/{id}/status` berfungsi
- [ ] Rate limiting aktif — > 10 request/menit dari IP yang sama → HTTP 429
      (ditangani Laravel RateLimiter, bukan Apache mod_ratelimit)

## 5.4 Upload & Media

- [ ] Upload foto ≤ 20MB berhasil (Apache LimitRequestBody aktif)
- [ ] Upload foto > 20MB mendapat error yang benar (413 Request Entity Too Large)
- [ ] Gambar tersimpan di `storage/app/public/` dan accessible via URL
- [ ] WebP conversion berfungsi (cek ekstensi file hasil upload)

## 5.5 Security Headers

Cek di: https://securityheaders.com/?q=smkmuhbligo.sch.id

- [ ] X-Frame-Options: SAMEORIGIN ✓
- [ ] X-Content-Type-Options: nosniff ✓
- [ ] X-XSS-Protection: 1; mode=block ✓
- [ ] Referrer-Policy: strict-origin-when-cross-origin ✓
- [ ] Content-Security-Policy: (ada) ✓
- [ ] Tidak bisa akses `https://smkmuhbligo.sch.id/.env` → 403
- [ ] Tidak ada directory listing

# ─── FASE 6: CRON & MONITORING ───────────────────────────────────────────────

## 6.1 Laravel Scheduler (Cron)

```bash
# Tambahkan ke crontab www-data:
sudo crontab -u www-data -e
# Tambahkan baris berikut:
* * * * * php8.3 /var/www/smkmuhbligo/artisan schedule:run >> /dev/null 2>&1
```

- [ ] Baris cron sudah ditambahkan
- [ ] Verifikasi: `sudo crontab -u www-data -l`
- [ ] Test: `php8.3 /var/www/smkmuhbligo/artisan schedule:list`

## 6.2 Log Check

```bash
sudo tail -f /var/log/apache2/smkmuhbligo-access.log
sudo tail -f /var/log/apache2/smkmuhbligo-error.log
tail -f /var/www/smkmuhbligo/storage/logs/laravel.log
tail -f /var/log/smkmuhbligo-worker.log
```

- [ ] Tidak ada error mencurigakan di semua log

## 6.3 Database Backup (PostgreSQL)

```bash
# Script backup: /home/smgo3811/scripts/backup_db.sh
#!/bin/bash
BACKUP_DIR="/home/smgo3811/backups/db"
mkdir -p "$BACKUP_DIR"
pg_dump -U <<DB_USER>> <<DB_NAME>> | gzip > "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S).sql.gz"
find "$BACKUP_DIR" -mtime +7 -delete

# Cron harian jam 02:00 WIB
# 0 2 * * * /home/smgo3811/scripts/backup_db.sh
```

- [ ] Script backup dibuat
- [ ] Cron backup aktif
- [ ] Test restore dari backup berhasil

# ─── FASE 7: LIGHTHOUSE AUDIT ────────────────────────────────────────────────

## 7.1 Target Skor (via https://web.dev/measure/)

- [ ] Performance : ≥ 85
- [ ] Accessibility : ≥ 90
- [ ] Best Practices : ≥ 90
- [ ] SEO : ≥ 95

## 7.2 Core Web Vitals Target

- [ ] LCP (Largest Contentful Paint) : < 2.5 detik
- [ ] INP (Interaction to Next Paint) : < 200ms
- [ ] CLS (Cumulative Layout Shift) : < 0.1

# ─── TROUBLESHOOTING CEPAT ────────────────────────────────────────────────────

```bash
# 403/404 error setelah deploy
sudo apache2ctl configtest
cat /var/log/apache2/smkmuhbligo-error.log | tail -50
ls -la /var/www/smkmuhbligo/public/

# PHP error / white screen
cat /var/www/smkmuhbligo/storage/logs/laravel.log | tail -100
sudo systemctl status php8.3-fpm

# .htaccess tidak berfungsi
sudo apache2ctl -M | grep rewrite   # harus ada rewrite_module

# Queue worker mati
sudo supervisorctl status
sudo supervisorctl start smkmuhbligo-worker:*

# Permission error
sudo chown -R www-data:www-data /var/www/smkmuhbligo/storage
sudo chmod -R 775 /var/www/smkmuhbligo/storage

# Rollback deployment
cd /var/www/smkmuhbligo
git log --oneline -5
git revert HEAD
bash deploy/deploy.sh --skip-build
```
