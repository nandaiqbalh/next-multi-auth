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
  the service layer, typically used by client actions in Next.js.

These layers operate independently from the UI; you may remove or replace
components without touching the data logic.

## Project Structure

The repository is organized roughly as follows:

```
app/                   # Next.js app routes and layouts
  (auth)/             # login/register helpers
  (main)/             # client-facing pages (account, product, etc.)
  admin/              # administrative pages
components/           # reusable UI components grouped by domain
  auth/               # inputs, buttons, forms for authentication
  common/             # header, footer, dialogs, layout helpers
  ui/                 # base design system (card, dialog, etc.)
lib/                  # utility functions, font definitions, services
prisma/               # Prisma schema and migrations
public/               # static assets (images, fonts)
docker/               # Dockerfiles and configuration for containers

```

**Note:** business logic layers such as repositories, services, and validations
live under `lib/` and are not modified by the UI template changes.

## Running the Project

### Prerequisites

- Node.js 18+ (or use `nvm`/`volta` to install)
- PostgreSQL database (see environment variables below)
- `npm`, `yarn`, or `pnpm` package manager

### Environment Variables

Create a `.env` file in the project root with values similar to:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/next-multi-auth"
NEXTAUTH_SECRET="some-random-secret"
# add other variables used by the app (SMTP settings, etc.)
```

### Local Development (without Docker)

1. Install dependencies:
   ```bash
   npm install
   # or yarn install
   ```
2. Prepare the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

### Using Docker

A `docker-compose.dev.yml` is provided for development; services include
PostgreSQL and the Next.js app. To start everything:

```bash
# build and start containers
docker compose -f docker-compose.dev.yml up --build
```

The app will be available at `http://localhost:3000`. To apply migrations
inside the container, run:

```bash
docker compose exec app npx prisma migrate dev
```

For production, `docker-compose.prod.yml` references a prebuilt image and
can be used with your own registry.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
