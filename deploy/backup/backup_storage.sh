#!/usr/bin/env bash
# =============================================================================
# Automated Storage Backup Script (Public & Private) — SMK Muhammadiyah Bligo
# =============================================================================
set -euo pipefail

# Configuration via environment
APP_DIR="${APP_DIR:-/var/www/smkmuhbligo}"
BACKUP_REMOTE_TARGET="${BACKUP_REMOTE_TARGET:-}" # e.g. user@backup-server:/var/backups/smkmuhbligo/storage

PUBLIC_STORAGE="${APP_DIR}/storage/app/public/"
PRIVATE_STORAGE="${APP_DIR}/storage/app/private/"

if [ -z "${BACKUP_REMOTE_TARGET}" ]; then
    echo "ERROR: BACKUP_REMOTE_TARGET environment variable is required." >&2
    echo "Example: export BACKUP_REMOTE_TARGET=user@backup-host:/backups/storage" >&2
    exit 1
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting storage backup to '${BACKUP_REMOTE_TARGET}'..."

# Sync public media
if [ -d "${PUBLIC_STORAGE}" ]; then
    echo "Syncing public storage (${PUBLIC_STORAGE})..."
    rsync -az --delete "${PUBLIC_STORAGE}" "${BACKUP_REMOTE_TARGET}/public/"
fi

# Sync private downloads/files (Sesi unduhan disk private)
if [ -d "${PRIVATE_STORAGE}" ]; then
    echo "Syncing private storage (${PRIVATE_STORAGE})..."
    rsync -az --delete "${PRIVATE_STORAGE}" "${BACKUP_REMOTE_TARGET}/private/"
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Storage backup completed successfully."
