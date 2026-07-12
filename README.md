# TransitOps

TransitOps is a role-based transport operations platform for managing vehicles, drivers, trips, maintenance, fuel and expenses, and reporting.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, Prisma, Zod, React Hook Form, and TanStack Query.

---

## Prerequisites

- Node.js 20 or later
- npm 10 or later
- Docker (for local PostgreSQL via `docker compose`)

---

## Quick start (for reviewers)

```bash
# 1. Install dependencies
npm install

# 2. Create local .env from example
cp .env.example .env    # macOS / Linux / WSL
# copy .env.example .env  # Windows CMD

# 3. Start PostgreSQL
npm run db:up

# 4. Apply Prisma schema to the database
npm run db:push
#    (Optional) or run migrations instead:
#    npx prisma migrate dev

# 5. Seed the database with the full demo dataset
#    (100 vehicles, 100 drivers, users, trips, maintenance,
#     fuel logs, expenses, and app settings)
npm run db:seed

# 6. Run the app in development
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

Copy `.env.example` to `.env` and adjust as needed. Required variables:

| Key | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | JWT signing secret (32+ chars) |
| `JWT_EXPIRES_IN` | JWT expiry (e.g. `12h`) |
| `JWT_ISSUER` | JWT issuer claim |
| `JWT_AUDIENCE` | JWT audience claim |
| `NEXTAUTH_URL` | Public origin of the app |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowlist |
| `AUTH_COOKIE_SAMESITE` | `lax`, `strict`, or `none` |
| `AUTH_COOKIE_SECURE` | `true` in production over HTTPS |
| `SUPER_ADMIN_EMAIL` | Seeded admin email |
| `SUPER_ADMIN_PASSWORD` | Seeded admin password |
| `SUPER_ADMIN_FULL_NAME` | Seeded admin display name |

---

## Demo credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@transitops.dev` | `password123` |
| Fleet Manager | `fleet@transitops.dev` | `demo123` |
| Dispatcher (Fleet Manager) | `dispatcher@transitops.dev` | `demo123` |
| Safety Officer | `safety@transitops.dev` | `demo123` |
| Financial Analyst | `finance@transitops.dev` | `demo123` |
| Driver | `driver@transitops.dev` | `demo123` |

---

## RBAC matrix

Access is enforced both on the server (per endpoint) and on the client (per route via `RequireAccess`).

| Role | Fleet | Drivers | Trips | Maintenance | Fuel/Exp | Analytics | Settings |
|---|---|---|---|---|---|---|---|
| Super Admin | Manage | Manage | Manage | Manage | Manage | Manage | Manage |
| Fleet Manager | Manage | Manage | View | View | View | View | Manage |
| Safety Officer | – | Manage | View | – | – | View | View |
| Financial Analyst | View | – | – | – | Manage | Manage | View |
| Driver | – | – | View | – | – | – | View |

If a user visits a page they can't access, a clear "Access restricted" card is shown with a link back to the dashboard.

---

## Useful scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (runs `prisma generate`) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run db:up` | Start Postgres via Docker |
| `npm run db:down` | Stop Postgres |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:migrate` | Run Prisma migrations (`prisma migrate dev`) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Reset demo data and reseed |
| `npm run db:studio` | Open Prisma Studio |

---

## Reseeding

`npm run db:seed` is idempotent for reference data (roles, users, app settings) and fully replaces operational data (vehicles, drivers, trips, maintenance logs, fuel logs, expenses) so you always start from the same 100 vehicles / 100 drivers dataset. Run it any time to reset the demo.

---

## Architecture (high level)

- Backend layering: `Route Handler → controller → service → reader/writer → repository → Prisma`
- Route handlers stay thin, controllers validate and orchestrate.
- Cross-module logic goes through `<module>.service.ts` — no cross-repository imports.
- Zod schemas in `server/modules/<x>/*.validators.ts` are re-exported to the frontend for a single source of truth.
- Central RBAC map lives in `src/server/shared/rbac/permissions.ts` and is mirrored client-side at `src/lib/rbac.ts`.
- Feature UI lives under `src/features/<domain>/{components,hooks,services,schemas,types}`.

See `docs/architecture.md` for the full layering description.

---

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:5432`**: PostgreSQL container is not running. Run `npm run db:up`.
- **`Drift detected` on `prisma migrate dev`**: your local DB is out of sync with migrations. For a hackathon-style reset, run `npx prisma migrate reset --force` then `npm run db:seed`.
- **401 on API calls even after login**: your cookie may be stale from an older `JWT_SECRET`. Delete the `auth-token` cookie or hit `POST /api/auth/logout` and sign in again.
- **CORS errors from a different frontend origin**: set `CORS_ALLOWED_ORIGINS`, `AUTH_COOKIE_SAMESITE=none`, and `AUTH_COOKIE_SECURE=true` in `.env`.
