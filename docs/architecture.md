# Architecture

This project uses a layered, feature-based architecture optimized for hackathon speed and clarity.

## Request flow

`Route Handler` → `controller` → `service` → `reader/writer` → `repository` → `Prisma`

## Rules

- Route handlers only parse input and delegate to controllers.
- Business logic lives in services, not React components or route handlers.
- Repositories contain Prisma queries only.
- New domain modules should copy the `auth` module file structure.
- Frontend validation re-exports Zod schemas from the server validators to avoid drift.

## Frontend

- `features/` — UI logic grouped by domain (components, hooks, services, schemas).
- `providers/` — app-wide React context (TanStack Query, auth).
- `components/ui/` — shadcn/ui primitives.

## Backend

- `server/modules/` — vertical slices per domain.
- `server/shared/` — errors, middleware, response builders, utilities.
