# SocialHub

> **One place to follow everything. Your feed, your sources, your experience.**

SocialHub is a production-quality, self-hosted, multi-user social media aggregation platform. Users follow creators, publications, subreddits, and open feeds across platforms (YouTube, Reddit, RSS, X, TikTok, Instagram, Facebook, LinkedIn) and read everything in one distraction-free, customizable editorial interface.

---

## Key Principles & Architectural Guarantees

1. **Content-First, Zero Video Hosting:**
   Under no circumstances does SocialHub download, transcode, mirror, or store external video binaries. All video playback uses official sandboxed iframe embeds or direct fallbacks.
2. **Normalized Domain Model:**
   Feed generation, ranking, filtering, bookmarking, and discovery interact exclusively with a platform-independent normalized model (`NormalizedPost`).
3. **Strict Multi-Tenant Isolation:**
   Tenant boundaries are enforced at the database query layer and backend API authorization guards. User credentials, private feeds, bookmarks, and viewing histories are partitioned by user ID and never leak across tenants or into shared feeds.
4. **Autonomous, Resilient Sync Worker:**
   Independent BullMQ worker processes perform deterministic feed synchronization with jittered exponential backoff and persistent cursor checkpoints.
5. **No Forced AI:**
   The core system operates entirely deterministically without external LLM dependencies.

---

## Tech Stack

- **Frontend:** Next.js 15+ App Router, React 19, Tailwind CSS, Lucide icons, TanStack Query, React Hook Form, Zod.
- **Backend:** NestJS 11, Prisma 6, PostgreSQL 16, Redis 7, BullMQ, Swagger/OpenAPI, Argon2id.
- **Testing:** Vitest, Supertest, Playwright.
- **Infra:** Docker, Docker Compose, Makefile, host-level Nginx + Certbot.

---

## Monorepo Layout

```
socialhub/
├── apps/
│   ├── web/                    # Next.js 15 App Router frontend (Port 9900)
│   └── api/                    # NestJS REST API server (Port 9901, Swagger: /api/docs)
├── workers/
│   └── sync-worker/            # Independent BullMQ synchronization worker
├── packages/
│   ├── database/               # Prisma schema, migrations, seed scripts, client
│   ├── connectors/             # Unified connector contract, registry & platform adapters
│   ├── shared/                 # Shared TypeScript models, enums, DTOs, Zod schemas
│   └── config/                 # Shared TypeScript, ESLint, Prettier configs
├── infrastructure/
│   ├── docker/                 # Multi-stage production Dockerfiles
│   └── scripts/                # Database backup and restore shell scripts
├── docs/                       # Architecture, Database, API, Connectors, Security, Deployment
├── docker-compose.yml          # Base development composition (dedicated loopback ports)
├── docker-compose.prod.yml     # Production overrides (non-root, internal DB/Redis)
├── pnpm-workspace.yaml         # Monorepo workspace configuration
├── Makefile                    # Operational tasks (dev, build, up, down, test, backup, restore)
└── .env.example                # Canonical environment variable specification
```

---

## Quickstart (Local Development)

```bash
# 1. Clone & install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env

# 3. Start PostgreSQL (port 9910) and Redis (port 9911)
docker compose up -d postgres redis

# 4. Run database migrations & seed platform registry
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Run tests
pnpm test

# 6. Start development server
pnpm dev
```

- Web UI: [http://localhost:9900](http://localhost:9900)
- API: [http://localhost:9901/api/v1](http://localhost:9901/api/v1)
- Swagger API Docs: [http://localhost:9901/api/docs](http://localhost:9901/api/docs)

---

## Production Deployment (VPS)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment instructions, host-level Nginx reverse-proxy configuration, and Certbot SSL setup.

```bash
# Build and run containers
make build
make up

# Run production database migrations
make migrate
make seed
```

---

## Documentation Index

- [Architecture & Design Decisions](docs/ARCHITECTURE.md)
- [Database Models & Migration Runbook](docs/DATABASE.md)
- [REST API Reference](docs/API.md)
- [Connector Capabilities & Platform Limits](docs/CONNECTORS.md)
- [Security, Sessions & SSRF Guard](docs/SECURITY.md)
- [VPS Host Deployment & Nginx](docs/DEPLOYMENT.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Development Workflow](docs/DEVELOPMENT.md)
