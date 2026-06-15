# Architecture Overview

This project follows a **layered architecture** that separates UI from business
logic and data access. The layers are:

```
┌─────────────────────────────────────────────────┐
│  Client Components (React)                      │
│  pages, forms, nav, dialogs                     │
├─────────────────────────────────────────────────┤
│  Server Components / API Routes / Server Actions │
│  (Next.js App Router)                           │
├─────────────────────────────────────────────────┤
│  Action Layer  (lib/actions/)                   │
│  session validation, orchestration              │
├─────────────────────────────────────────────────┤
│  Service Layer  (lib/services/)                 │
│  business rules, validation, workflows          │
├─────────────────────────────────────────────────┤
│  Repository Layer  (lib/repositories/)          │
│  Prisma database access                         │
├─────────────────────────────────────────────────┤
│  Database (PostgreSQL)                          │
└─────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Repository Layer (`lib/repositories/`)

Direct database access via Prisma. Each repository file corresponds to a domain
entity (e.g. `user.repository.js`). Functions follow a consistent pattern:

- Accept plain data, query the database
- Return `GeneralResponse { success, message, data }`
- Wrap every operation in try/catch for predictable error handling

### 2. Service Layer (`lib/services/`)

Business logic and validation. Services:

- Validate input against Zod schemas (server-side, independent of client)
- Check business rules (duplicates, permissions, password policies)
- Call repository functions to persist/read data
- Return `{ success, message, data?, errors? }` — never throw

Services do **not** know about HTTP, sessions, or components.

### 3. Action Layer (`lib/actions/`)

Server Actions (`"use server"`). Actions:

- Validate the session (who is the current user?)
- Call the appropriate service
- Transform service responses for the calling component
- Handle edge cases like missing sessions

### 4. UI Layer (`components/` + `app/`)

React components split into:

- **Page components** (`app/`) — Next.js App Router pages, layouts
- **Domain components** (`components/auth/`, `components/admin/`) — feature
  specific UI
- **Common components** (`components/common/`) — shared layout, headers
- **Design system** (`components/ui/`) — primitive UI elements (button, card,
  dialog, toast)

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| `GeneralResponse` wrapper | Predictable return shape; never throw. Every layer knows what to expect. |
| Zod validation at both client & service | Immediate UX feedback + guaranteed server-side integrity. |
| JWT sessions (NextAuth) | Stateless, no DB lookup on every request. |
| Prisma migrations | Version-controlled schema changes; deploy via `prisma migrate deploy`. |
| Server Actions for mutations | Progressive enhancement, no separate API boilerplate for internal calls. |
| API route for registration | Externally callable (mobile apps, third parties) via the same code path. |
