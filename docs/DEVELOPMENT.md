# SocialHub Local Development Guide

## 1. Prerequisites

- Node.js >= 20 (tested on v24)
- pnpm >= 9 (tested on v12)
- Docker & Docker Compose

---

## 2. Quick Setup

```bash
# 1. Install dependencies across all monorepo workspaces
pnpm install

# 2. Copy and customize development environment variables
cp .env.example .env

# 3. Start local PostgreSQL and Redis containers (dedicated dev ports 9910, 9911)
docker compose up -d postgres redis

# 4. Generate Prisma Client and apply migrations
pnpm db:generate
pnpm db:migrate

# 5. Seed initial platform registry
pnpm db:seed

# 6. Start full development environment in parallel
pnpm dev
```

The services will become available at:

- **Web Frontend:** `http://localhost:9900`
- **REST API:** `http://localhost:9901/api/v1`
- **Swagger Documentation:** `http://localhost:9901/api/docs`

---

## 3. Monorepo Quality Commands

```bash
# Run all unit and integration tests
pnpm test

# Check TypeScript types across all projects
pnpm typecheck

# Format code with Prettier
pnpm format

# Check formatting without writing
pnpm format:check
```
