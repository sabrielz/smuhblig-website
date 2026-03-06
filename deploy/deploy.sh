#!/bin/bash
# =============================================================================
# Deployment Script — SMK Muhammadiyah Bligo
# Server  : VPS Ubuntu 22.04+
# Web     : Apache2 + PHP-FPM 8.3
# App dir : /var/www/smkmuhbligo
# Usage   : bash deploy.sh [--skip-build] [--skip-migrate]
# Updated : 2026-03-06
# =============================================================================

set -e          # Hentikan jika ada error
set -o pipefail # Tangkap error dari pipe

# ─── Variabel ─────────────────────────────────────────────────────────────────
APP_DIR="/var/www/smkmuhbligo"
BRANCH="main"
PHP_BIN="php8.3"
COMPOSER_BIN="composer"
SKIP_BUILD=false
SKIP_MIGRATE=false
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# ─── Parse argument ───────────────────────────────────────────────────────────
for arg in "$@"; do
    case $arg in
        --skip-build)   SKIP_BUILD=true   ;;
        --skip-migrate) SKIP_MIGRATE=true ;;
    esac
done

# ─── Color output ─────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC}   $1"; }
fail() { echo -e "${RED}[ERROR]${NC}  $1"; exit 1; }
info() { echo -e "${CYAN}[INFO]${NC}   $1"; }

# ─── Validasi environment ─────────────────────────────────────────────────────
log "=== SMK Muhammadiyah Bligo — Deployment (${TIMESTAMP}) ==="

[ ! -d "$APP_DIR" ] && fail "Directory tidak ditemukan: $APP_DIR"
[ ! -f "$APP_DIR/.env" ] && fail ".env tidak ditemukan. Copy dari deploy/.env.production!"

# ─── 1. Masuk ke direktori project ───────────────────────────────────────────
cd "$APP_DIR"
info "Working dir: $(pwd)"

# ─── 2. Maintenance mode ON ──────────────────────────────────────────────────
log "Mengaktifkan maintenance mode..."
$PHP_BIN artisan down --render="errors::503" || warn "Gagal aktifkan maintenance mode"

# ─── 3. Git pull ─────────────────────────────────────────────────────────────
log "Menarik kode terbaru dari branch '${BRANCH}'..."
git fetch --all
git checkout $BRANCH
git pull origin $BRANCH

# ─── 4. PHP Dependencies ─────────────────────────────────────────────────────
log "Menginstall PHP dependencies (no-dev, optimized)..."
$COMPOSER_BIN install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# ─── 5. Node Dependencies + Build ────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
    log "Menginstall Node dependencies..."
    npm ci --omit=dev

    log "Membangun frontend (Vite + React)..."
    npm run build

    log "Membersihkan node_modules (hemat disk)..."
    rm -rf node_modules
else
    warn "Build frontend DILEWATI (--skip-build)"
fi

# ─── 6. Artisan Caching ──────────────────────────────────────────────────────
log "Caching konfigurasi, route, view, dan event..."
$PHP_BIN artisan config:cache
$PHP_BIN artisan route:cache
$PHP_BIN artisan view:cache
$PHP_BIN artisan event:cache

# ─── 7. Database Migrations ──────────────────────────────────────────────────
if [ "$SKIP_MIGRATE" = false ]; then
    log "Menjalankan database migration..."
    $PHP_BIN artisan migrate --force
else
    warn "Migration DILEWATI (--skip-migrate)"
fi

# ─── 8. Clear Application Cache ──────────────────────────────────────────────
log "Membersihkan application cache (Redis)..."
$PHP_BIN artisan cache:clear

# ─── 9. Storage Symlink ──────────────────────────────────────────────────────
log "Memastikan storage symlink tersedia..."
$PHP_BIN artisan storage:link --quiet || warn "Storage symlink sudah ada"

# ─── 10. File Permissions ────────────────────────────────────────────────────
log "Mengatur file permissions..."
sudo chown -R www-data:www-data /var/www/smkmuhbligo
sudo chmod -R 755 /var/www/smkmuhbligo
sudo chmod -R 775 /var/www/smkmuhbligo/storage
sudo chmod -R 775 /var/www/smkmuhbligo/bootstrap/cache

# ─── 11. Queue Workers Restart ───────────────────────────────────────────────
log "Merestart queue workers (graceful — menunggu job selesai)..."
$PHP_BIN artisan queue:restart

# ─── 12. Reload PHP-FPM ──────────────────────────────────────────────────────
log "Mereload PHP-FPM (php8.3-fpm)..."
sudo systemctl reload php8.3-fpm

# ─── 13. Validate & Reload Apache ────────────────────────────────────────────
log "Memvalidasi dan mereload Apache2..."
sudo apachectl configtest && sudo systemctl reload apache2

# ─── 14. Maintenance mode OFF ────────────────────────────────────────────────
log "Menonaktifkan maintenance mode..."
$PHP_BIN artisan up

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
log "============================================================"
log " Deployment SELESAI — $(date +"%Y-%m-%d %H:%M:%S")"
log "============================================================"
info " URL    : https://smkmuhbligo.sch.id"
info " Worker : sudo supervisorctl status smkmuhbligo-worker:*"
info " Apache : sudo systemctl status apache2"
info " FPM    : sudo systemctl status php8.3-fpm"
echo ""
