#!/bin/sh
set -e
cd /app

# Jalankan migrasi basis data jika diaktifkan
if [ "${RUN_MIGRATIONS:-false}" = "true" ] || [ "${RUN_MIGRATION:-false}" = "true" ]; then
    echo "[entrypoint] Menjalankan artisan migrate --force..."
    php artisan migrate --force --no-interaction
fi

# Pastikan symlink storage terhubung
if [ ! -L /app/public/storage ]; then
    echo "[entrypoint] Membuat storage link..."
    php artisan storage:link --no-interaction || true
fi

# Restart antrean jika kontainer adalah queue worker
echo "[entrypoint] Restart queue..."
php artisan queue:restart || true

# Optimasi cache konfigurasi, route, dan view
if [ "${APP_OPTIMIZE:-true}" = "true" ]; then
    echo "[entrypoint] Menjalankan artisan optimize..."
    php artisan optimize --no-interaction || echo "[entrypoint] Optimize gagal, lanjut tanpa cache"
fi

exec "$@"
