# Main Event — Odoo Hackathon Starter

Production-grade Next.js starter for the hackathon. Unzip, install, and run.

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (for local PostgreSQL)

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Environment variables
# Windows:
copy .env.example .env
# macOS/Linux:
# cp .env.example .env

# 3. Start PostgreSQL
npm run db:up

# 4. Sync database schema (fastest for first run)
npm run db:push
# Or with migrations: npx prisma migrate dev --name init

# 5. (Optional) Seed demo user
npm run db:seed

# 6. Start the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see **main event is running**.

## Demo credentials (after seed)

- Email: `demo@mainevent.dev`
- Password: `password123`

## Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui · PostgreSQL · Prisma · Zod · TanStack Query · React Hook Form

## Project structure

See [docs/architecture.md](./docs/architecture.md) for layering and conventions.

## Useful scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:up` | Start Postgres via Docker |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |

## Adding a new domain module

Copy the `src/server/modules/auth/` file structure and rename. Re-export Zod schemas in `src/features/<domain>/schemas/`.
