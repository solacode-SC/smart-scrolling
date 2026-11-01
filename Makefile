# ==============================================================================
# SocialHub — Master Makefile for Local Development & VPS Production
# ==============================================================================

SHELL := /usr/bin/env bash

# Colors for terminal output
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RED    := \033[31m
RESET  := \033[0m
BOLD   := \033[1m

# Compose files for production vs local
COMPOSE_BASE := docker-compose.yml
COMPOSE_PROD := docker-compose.prod.yml
COMPOSE_PROD_CMD := docker compose -f $(COMPOSE_BASE) -f $(COMPOSE_PROD)

.PHONY: help
help: ## Show this help menu
	@echo -e "$(BOLD)$(CYAN)SocialHub Management Commands$(RESET)"
	@echo -e "======================================================="
	@echo -e "$(BOLD)Local Development:$(RESET)"
	@echo -e "  $(GREEN)make setup$(RESET)            Complete first-time setup (env, install, services, migrate, seed)"
	@echo -e "  $(GREEN)make dev$(RESET)              Run Next.js web (9900) and NestJS API (9901) locally"
	@echo -e "  $(GREEN)make services$(RESET)         Start local PostgreSQL (9910) and Redis (9911) containers"
	@echo -e "  $(GREEN)make services-down$(RESET)    Stop local development containers"
	@echo -e "  $(GREEN)make local-migrate$(RESET)    Apply Prisma database migrations locally"
	@echo -e "  $(GREEN)make local-seed$(RESET)       Seed platform registry data into local database"
	@echo -e ""
	@echo -e "$(BOLD)VPS Production (Docker):$(RESET)"
	@echo -e "  $(GREEN)make prod-setup$(RESET)       Prepare production env and initial deployment"
	@echo -e "  $(GREEN)make build$(RESET)            Build all production Docker images"
	@echo -e "  $(GREEN)make up$(RESET)               Start all production containers in background"
	@echo -e "  $(GREEN)make down$(RESET)             Stop production containers gracefully"
	@echo -e "  $(GREEN)make restart$(RESET)          Restart production stack"
	@echo -e "  $(GREEN)make ps$(RESET)               Show running containers and status"
	@echo -e "  $(GREEN)make logs$(RESET)             Follow container logs in real time"
	@echo -e "  $(GREEN)make migrate$(RESET)          Run controlled Prisma migration inside API container"
	@echo -e "  $(GREEN)make seed$(RESET)             Seed platform capabilities inside API container"
	@echo -e ""
	@echo -e "$(BOLD)Testing & Code Quality:$(RESET)"
	@echo -e "  $(GREEN)make test$(RESET)             Run all unit and integration tests"
	@echo -e "  $(GREEN)make typecheck$(RESET)        Verify TypeScript types across the monorepo"
	@echo -e "  $(GREEN)make format$(RESET)           Auto-format code with Prettier"
	@echo -e "  $(GREEN)make lint$(RESET)             Run linter checks"
	@echo -e ""
	@echo -e "$(BOLD)Backups & Disaster Recovery:$(RESET)"
	@echo -e "  $(GREEN)make backup$(RESET)           Create compressed PostgreSQL backup in ./backups"
	@echo -e "  $(GREEN)make restore BACKUP_FILE=path$(RESET) Restore database from backup archive"
	@echo -e "======================================================="

# ------------------------------------------------------------------------------
# 1. LOCAL DEVELOPMENT TARGETS
# ------------------------------------------------------------------------------

.PHONY: setup
setup: ## First-time setup: install, .env, docker services, migrations, seed
	@echo -e "$(CYAN)--> Setting up SocialHub for local development...$(RESET)"
	@if [ ! -f .env ]; then \
		echo -e "$(YELLOW)--> Creating .env from .env.example$(RESET)"; \
		cp .env.example .env; \
	fi
	@echo -e "$(CYAN)--> Installing pnpm dependencies...$(RESET)"
	pnpm install
	@echo -e "$(CYAN)--> Starting PostgreSQL and Redis containers...$(RESET)"
	docker compose up -d postgres redis
	@echo -e "$(CYAN)--> Waiting for database to become healthy...$(RESET)"
	@until docker compose exec -T postgres pg_isready -U socialhub -d socialhub > /dev/null 2>&1; do \
		echo -n "."; sleep 1; \
	done
	@echo -e "\n$(GREEN)--> Database is ready!$(RESET)"
	@echo -e "$(CYAN)--> Generating Prisma Client...$(RESET)"
	pnpm db:generate
	@echo -e "$(CYAN)--> Running database migrations...$(RESET)"
	pnpm db:migrate
	@echo -e "$(CYAN)--> Seeding platform registry...$(RESET)"
	pnpm db:seed
	@echo -e "$(BOLD)$(GREEN)=== SocialHub Local Setup Complete! ===$(RESET)"
	@echo -e "Run $(BOLD)make dev$(RESET) to start the web and api servers."

.PHONY: services
services: ## Start local PostgreSQL and Redis containers
	@echo -e "$(CYAN)--> Starting local PostgreSQL (9910) and Redis (9911)...$(RESET)"
	docker compose up -d postgres redis

.PHONY: services-down
services-down: ## Stop local PostgreSQL and Redis containers
	@echo -e "$(YELLOW)--> Stopping local PostgreSQL and Redis...$(RESET)"
	docker compose down

.PHONY: local-migrate
local-migrate: ## Run migrations against local database
	pnpm db:migrate

.PHONY: local-seed
local-seed: ## Seed platform metadata into local database
	pnpm db:seed

.PHONY: dev
dev: ## Start Next.js (port 9900) and NestJS API (port 9901) locally
	@echo -e "$(GREEN)--> Starting SocialHub development servers...$(RESET)"
	@echo -e "    Web UI:  $(CYAN)http://localhost:9900$(RESET)"
	@echo -e "    API:     $(CYAN)http://localhost:9901/api/v1$(RESET)"
	@echo -e "    Swagger: $(CYAN)http://localhost:9901/api/docs$(RESET)"
	pnpm dev

# ------------------------------------------------------------------------------
# 2. VPS PRODUCTION (DOCKER) TARGETS
# ------------------------------------------------------------------------------

.PHONY: prod-setup
prod-setup: ## Prepare production environment on VPS
	@if [ ! -f .env ]; then \
		echo -e "$(RED)Error: .env file missing.$(RESET)"; \
		echo -e "Please create .env from .env.example and set strong passwords before deploying:"; \
		echo -e "  cp .env.example .env && nano .env"; \
		exit 1; \
	fi
	@echo -e "$(GREEN)--> .env is present. Building production images...$(RESET)"
	$(COMPOSE_PROD_CMD) build

.PHONY: build
build: ## Build production Docker containers
	@echo -e "$(CYAN)--> Building production Docker containers...$(RESET)"
	$(COMPOSE_PROD_CMD) build

.PHONY: up
up: ## Start production Docker stack in background
	@echo -e "$(GREEN)--> Starting production SocialHub stack...$(RESET)"
	$(COMPOSE_PROD_CMD) up -d
	@echo -e "$(CYAN)--> Checking service status:$(RESET)"
	$(COMPOSE_PROD_CMD) ps

.PHONY: down
down: ## Stop production Docker stack
	@echo -e "$(YELLOW)--> Stopping production SocialHub stack...$(RESET)"
	$(COMPOSE_PROD_CMD) down

.PHONY: restart
restart: ## Restart production Docker stack
	@echo -e "$(YELLOW)--> Restarting production stack...$(RESET)"
	$(COMPOSE_PROD_CMD) restart

.PHONY: ps
ps: ## List running production containers
	$(COMPOSE_PROD_CMD) ps

.PHONY: logs
logs: ## Tail production container logs
	$(COMPOSE_PROD_CMD) logs -f

.PHONY: migrate
migrate: ## Controlled production database migration
	@echo -e "$(CYAN)--> Deploying database migrations inside API container...$(RESET)"
	docker compose exec -T api pnpm prisma migrate deploy

.PHONY: seed
seed: ## Seed platform data inside API container
	@echo -e "$(CYAN)--> Seeding platform registry inside API container...$(RESET)"
	docker compose exec -T api pnpm prisma db seed

# ------------------------------------------------------------------------------
# 3. CODE QUALITY & TESTING
# ------------------------------------------------------------------------------

.PHONY: test
test: ## Run unit and integration tests across monorepo
	pnpm test

.PHONY: typecheck
typecheck: ## Typecheck all packages and applications
	pnpm typecheck

.PHONY: format
format: ## Format codebase with Prettier
	pnpm format

.PHONY: lint
lint: ## Run ESLint checks
	pnpm lint

# ------------------------------------------------------------------------------
# 4. BACKUP & RESTORE
# ------------------------------------------------------------------------------

.PHONY: backup
backup: ## Create a compressed database backup in ./backups
	@./infrastructure/scripts/backup.sh

.PHONY: restore
restore: ## Restore database from backup: make restore BACKUP_FILE=./backups/xxx.sql.gz
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo -e "$(RED)Error: BACKUP_FILE is required.$(RESET)"; \
		echo -e "Usage: $(BOLD)make restore BACKUP_FILE=./backups/socialhub_db_YYYYMMDD_HHMMSS.sql.gz$(RESET)"; \
		exit 1; \
	fi
	@./infrastructure/scripts/restore.sh "$(BACKUP_FILE)"

# ------------------------------------------------------------------------------
# 5. CLEANUP
# ------------------------------------------------------------------------------

.PHONY: clean
clean: ## Clean build artifacts and caches (preserves Docker data)
	rm -rf dist build .next apps/*/dist apps/*/.next workers/*/dist packages/*/dist
	@echo -e "$(GREEN)--> Cleaned build outputs.$(RESET)"
