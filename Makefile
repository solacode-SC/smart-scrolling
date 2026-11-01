.PHONY: dev build up down logs migrate seed test backup restore format lint typecheck

dev:
	pnpm dev

build:
	pnpm build

up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

logs:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

migrate:
	docker compose exec api pnpm prisma migrate deploy

seed:
	docker compose exec api pnpm prisma db seed

test:
	pnpm test

format:
	pnpm format

lint:
	pnpm lint

typecheck:
	pnpm typecheck

backup:
	./infrastructure/scripts/backup.sh

restore:
	@if [ -z "$(BACKUP_FILE)" ]; then echo "Usage: make restore BACKUP_FILE=./backups/filename.sql.gz"; exit 1; fi
	./infrastructure/scripts/restore.sh $(BACKUP_FILE)
