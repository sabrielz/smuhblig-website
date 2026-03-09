# Panduan Setup Backup SMK Muhammadiyah Bligo

Dokumen ini berisi instruksi dan prosedur untuk melakukan backup dan restore production web aplikasi SMK Muhammadiyah Bligo.

## 1. Database Backup (PostgreSQL)

Karena kita menggunakan PostgreSQL di production, backup harian dapat dilakukan dengan `pg_dump` dan diatur berjalan via Cron Job.

**Contoh shell script (`/backup/scripts/db_backup.sh`):**

```bash
#!/bin/bash
BACKUP_DIR="/backup/db"
DATE=$(date +%Y%m%d)
DB_USER="postgres"
DB_NAME="smuhbligo_db"

# Menjalankan pg_dump dan kompresi
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/$DATE.sql.gz

# Menghapus file backup yang lebih tua dari 30 hari (Retention)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -exec rm {} \;
```

**Konfigurasi Cron Job (`crontab -e`):**
Jalankan setiap hari jam 02:00 pagi.

```cron
0 2 * * * /bin/bash /backup/scripts/db_backup.sh >/dev/null 2>&1
```

_(Catatan: Sesuaikan akses password PostgreSQL pada file `~/.pgpass` jika diperlukan, agar tidak prompt password saat cron berjalan)._

## 2. Storage Backup (Foto, Media, dll)

Folder `storage/app/public` berisi seluruh asset yang di-upload oleh user (gambar galeri, thumbnail berita). Folder ini perlu di-backup ke tempat yang aman (misalkan Offsite Storage seperti AWS S3, Google Drive, atau rsync ke server lain).

**Contoh cron sinkronisasi (Rsync ke Offsite / Another Server):**

```cron
0 3 * * * rsync -avz --delete /var/www/smuhbligo/storage/app/public/ user@backup-server:/backup/smuhbligo/storage/
```

_(Menjalankan rsync setiap jam 03:00 pagi)._

## 3. Prosedur Restore

Jika terjadi data hilang atau insiden pada sistem, berikut adalah langkah restore-nya:

**A. Restore Database:**

1. Hapus (drop) database lama, lalu buat ulang, **atau** kosongkan tabel yang ada.
2. Unzip file backup SQL.
    ```bash
    gunzip -c /backup/db/20260301.sql.gz > /tmp/restore.sql
    ```
3. Lakukan restore menggunakan `psql`.
    ```bash
    psql -U postgres -d smuhbligo_db < /tmp/restore.sql
    ```

**B. Restore Storage:**

1. Salin ulang file dari server backup ke dalam direktori aplikasi.
    ```bash
    rsync -avz user@backup-server:/backup/smuhbligo/storage/ /var/www/smuhbligo/storage/app/public/
    ```
2. Pastikan file ownership benar (misalkan `www-data:www-data`).
    ```bash
    chown -R www-data:www-data /var/www/smuhbligo/storage/app/public/
    ```

## 4. Cara Verifikasi Backup (Test Restore)

Setiap beberapa waktu (misal sebulan sekali), pastikan file backup yang dibuat dapat di-restore dengan valid:

1. Unduh salah satu file `sql.gz` terbaru ke mesin staging / lokal.
2. Lakukan command dekompresi dan restore ke database testing.
3. Cek jumlah data / view data pada tabel utama (`users`, `artikel`, `galeri`) untuk memastikan integritas datanya.
4. Lakukan pengecekan pada storage images, dan verifikasi url public-nya dapat dibuka (misalkan `/storage/galeri/foto.jpg`).
