#!/usr/bin/env bash
# =============================================================================
# Automated MySQL Database Backup Script — SMK Muhammadiyah Bligo
# =============================================================================
set -euo pipefail

# Configuration via environment or defaults
BACKUP_DIR="${BACKUP_DIR:-/var/backups/smkmuhbligo/db}"
MYSQL_OPTS="${MYSQL_OPTS:-$HOME/.my.cnf}"
DB_NAME="${DB_NAME:-smkmuhbligo}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
TARGET_FILE="${BACKUP_DIR}/${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

if [ ! -f "${MYSQL_OPTS}" ]; then
    echo "ERROR: MySQL options file '${MYSQL_OPTS}' not found." >&2
    echo "Please create ~/.my.cnf with [client] section and permission 600." >&2
    exit 1
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting MySQL backup for database '${DB_NAME}'..."

mysqldump --defaults-extra-file="${MYSQL_OPTS}" \
    --single-transaction \
    --routines \
    --triggers \
    --default-character-set=utf8mb4 \
    "${DB_NAME}" | gzip > "${TARGET_FILE}"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup created: ${TARGET_FILE} ($(du -h "${TARGET_FILE}" | cut -f1))"

# Retention cleanup
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Cleaning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -type f -name "*.sql.gz" -mtime +"${RETENTION_DAYS}" -delete

echo "[$(date +'%Y-%m-%d %H:%M:%S')] MySQL backup completed successfully."
