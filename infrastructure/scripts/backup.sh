#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/socialhub_db_$TIMESTAMP.sql.gz"

echo "Creating database backup: $FILENAME"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER:-socialhub}" "${POSTGRES_DB:-socialhub}" | gzip > "$FILENAME"

echo "Backup created successfully: $FILENAME"
