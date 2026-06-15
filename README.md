# Multi‑Auth Template

This repository is a customizable Next.js starter focused on authentication and
role-based access. It includes a basic multi-auth UI along with a layered
back-end structure. You can modify the front-end components freely; the
business logic lives under `lib/` and is unaffected by UI changes.

## Architectural Layers

- **Repository layer** (`lib/repositories`) handles direct database access via
  Prisma.
- **Service layer** (`lib/services`) encapsulates business rules and workflows
  like registration, login validation, profile updates, etc.
- **Action layer** (`lib/actions`) bridges between server components/pages and
  the service layer, typically used by server actions in Next.js.

These layers operate independently from the UI; you may remove or replace
components without touching the data logic.

**Full architecture documentation** can be found in
[`docs/architecture/`](docs/architecture/).

## Project Structure

```
app/                   # Next.js app routes and layouts
  (auth)/             # login/register pages (grouped)
  admin/              # admin dashboard, users, layout with auth guard
  api/auth/           # NextAuth route handler + register API
components/           # reusable UI components grouped by domain
  auth/               # inputs, buttons, forms for authentication
  admin/              # admin navigation, side drawers
  common/             # header, layout helpers, slide dialogs
  ui/                 # base design system (card, dialog, sonner, etc.)
lib/                  # utility functions, fonts, business logic
  actions/            # server actions (register, profile, password)
  model/              # response data structures
  repositories/       # Prisma data access (user.repository)
  services/           # business rules (auth.service, profile.service)
  validations/        # Zod schemas and session validation
prisma/               # Prisma schema and SQL migrations
docker/               # Dockerfiles, nginx config, init scripts
public/               # static assets (images, fonts)
docs/                 # architecture documentation & patterns
```

## Running the Project

### Prerequisites

- Node.js 18+ (or use `nvm`/`volta`)
- PostgreSQL database
- `npm`, `yarn`, or `pnpm`

### Environment Variables

Create a `.env` file in the project root. Key variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/next-multi-auth"
DB_PORT=5432           # host port for Postgres (Docker only)

# Authentication
NEXTAUTH_SECRET="some-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# App port (Docker only)
APP_PORT=3000          # host port for the Next.js app

# Google OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### Local Development (without Docker)

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run dev
# Opens at http://localhost:3000
```

### Using Docker (Development)

```bash
docker compose -f docker-compose.dev.yml up --build
```

The container runs **migrations automatically** on startup, then starts the
Next.js dev server with live reload.

The app is available at `http://localhost:${APP_PORT:-3000}`.

| Service | Internal Port | Host Port (default) |
|---------|--------------|---------------------|
| app     | 3000         | `${APP_PORT:-3000}` |
| db      | 5432         | `${DB_PORT:-5432}`  |
| nginx   | 80           | 80                  |

### Using Docker (Production)

```bash
# Build image first
docker compose -f docker-compose.prod.yml build

# Run
docker compose -f docker-compose.prod.yml up -d
```

The production entrypoint runs `prisma migrate deploy` then starts the
optimized production server via `next start`.

## Feature Summary

| Feature | Details |
|---------|---------|
| Sign-up | Name, username, phone, email, password (Zod validated) |
| Sign-in | Email or username + password, or Google OAuth |
| Roles | USER / ADMIN / SUPERADMIN (enforced at API + layout level) |
| Profile | Edit name, username, phone, gender, birthdate |
| Password | Change password with validation (old ≠ new, 8+ chars) |
| Admin | Dashboard + user management (auth-gated layout) |
| Notifications | Sonner toasts, error dialogs, success banners |
| Docker | Dev (hot-reload) and production compose files |

## Architecture Docs

Detailed patterns, data flows, and code flows are documented under
[`docs/architecture/`](docs/architecture/):

- [Overview & Layer Design](docs/architecture/overview.md)
- [Project Structure](docs/architecture/project-structure.md)
- [Authentication Pipeline](docs/architecture/auth-pipeline.md)
- [Data & Code Flow](docs/architecture/data-flow.md)
