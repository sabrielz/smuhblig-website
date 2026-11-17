# Panduan Setup Backup & Restore — SMK Muhammadiyah Bligo

Dokumen ini berisi instruksi dan prosedur resmi untuk melakukan backup otomatis dan pemulihan (restore) database MySQL 8 serta penyimpanan berkas aplikasi SMK Muhammadiyah Bligo.

---

## 1. Keamanan Kredensial MySQL (`~/.my.cnf`)

Untuk mencegah adanya password literal dalam skrip shell atau crontab, gunakan file opsi bawaan MySQL client.

Buat atau sunting file `~/.my.cnf` pada user server (misalnya user `www-data` atau user deployment):

```ini
[client]
user=smkuser
password="PASSWORD_DATABASE_ANDA"
host=localhost
```

Pastikan hak akses file dikunci ke permission `600`:
```bash
chmod 600 ~/.my.cnf
```

---

## 2. Backup Otomatis Database (MySQL 8)

Skrip backup berada di `deploy/backup/backup_db.sh`. Skrip ini melakukan:
1. `mysqldump` dengan `--defaults-extra-file="$MYSQL_OPTS"` (tanpa password di command line).
2. Opsi `--single-transaction --routines --triggers --default-character-set=utf8mb4` agar transaksi data konsisten tanpa locking berlebih.
3. Kompresi output langsung ke format `.sql.gz`.
4. Rotasi retensi otomatis: menghapus backup yang berumur lebih dari 30 hari.

**Menjadwalkan Cron Job (`crontab -e`):**
Jalankan setiap hari pukul 02:00 WIB:

```cron
0 2 * * * /bin/bash /var/www/smkmuhbligo/deploy/backup/backup_db.sh >> /var/log/smk-backup-db.log 2>&1
```

---

## 3. Backup Penyimpanan Berkas (Public & Private Storage)

Aplikasi memiliki dua direktori penyimpanan berkas utama di bawah `storage/app/`:
1. `storage/app/public/`: Berkas media publik (foto galeri, cover artikel, avatar, logo).
2. `storage/app/private/`: Berkas dokumen unduhan non-publik yang diamankan oleh autentikasi/controller.

Skrip sinkronisasi berada di `deploy/backup/backup_storage.sh` menggunakan `rsync -az --delete` ke remote target offsite.

**Menjadwalkan Cron Job (`crontab -e`):**
Jalankan setiap hari pukul 03:00 WIB:

```cron
0 3 * * * BACKUP_REMOTE_TARGET="user@backup-host:/var/backups/smkmuhbligo/storage" /bin/bash /var/www/smkmuhbligo/deploy/backup/backup_storage.sh >> /var/log/smk-backup-storage.log 2>&1
```

---

## 4. Prosedur Pemulihan (Restore)

Jika terjadi insiden data hilang atau server failure, lakukan langkah berikut:

### A. Restore Database MySQL
1. Pastikan database target tersedia:
   ```bash
   mysql --defaults-extra-file=~/.my.cnf -e "CREATE DATABASE IF NOT EXISTS smkmuhbligo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```
2. Dekompresi dan alirkan dump backup ke MySQL:
   ```bash
   gunzip -c /var/backups/smkmuhbligo/db/YYYYMMDD_HHMMSS.sql.gz | mysql --defaults-extra-file=~/.my.cnf smkmuhbligo
   ```
3. Verifikasi integritas tabel:
   ```bash
   mysql --defaults-extra-file=~/.my.cnf smkmuhbligo -e "SHOW TABLES; SELECT COUNT(*) FROM articles; SELECT COUNT(*) FROM users;"
   ```

### B. Restore Storage
1. Sinkronkan kembali direktori dari backup offsite ke server:
   ```bash
   rsync -az user@backup-host:/var/backups/smkmuhbligo/storage/public/ /var/www/smkmuhbligo/storage/app/public/
   rsync -az user@backup-host:/var/backups/smkmuhbligo/storage/private/ /var/www/smkmuhbligo/storage/app/private/
   ```
2. Pastikan kepemilikan dan permission berkas benar:
   ```bash
   chown -R www-data:www-data /var/www/smkmuhbligo/storage
   chmod -R 775 /var/www/smkmuhbligo/storage
   php /var/www/smkmuhbligo/artisan storage:link
   ```

---

## 5. Verifikasi Berkala (Uji Coba Bulanan)

Setiap satu bulan sekali pada hari kerja pertama:
1. Salin satu file `sql.gz` terbaru ke server staging.
2. Lakukan pemulihan data sesuai prosedur di atas ke database staging.
3. Cocokkan jumlah record tabel utama (`users`, `articles`, `categories`, `jurusans`, `galeris`).
4. Uji buka 5 URL berkas media acak untuk memastikan berkas storage terhubung sempurna.
