# Authentication Pipeline

The app supports two authentication methods:

1. **Credentials** (email/username + password)
2. **Google OAuth**

Both are handled by NextAuth v4 with a Prisma adapter and JWT sessions.

---

## Registration Flow

```
RegisterForm           API Route             Action           Service          Repository
 (client)              (server)              (server)         (server)         (server)
    │                     │                     │                │                │
    │  POST /api/auth/register                  │                │                │
    ├────────────────────►│                     │                │                │
    │                     │  registerAction()   │                │                │
    │                     ├────────────────────►│                │                │
    │                     │                     │ registerUser() │                │
    │                     │                     ├───────────────►│                │
    │                     │                     │                │ Zod validate   │
    │                     │                     │                │ Check dups     │
    │                     │                     │                │ Hash password  │
    │                     │                     │                │ createUser()   │
    │                     │                     │                ├──────────────►│
    │                     │                     │                │ GeneralResponse│
    │                     │                     │                │◄──────────────┤
    │                     │                     │ {success, msg} │                │
    │                     │                     │◄───────────────┤                │
    │                     │   { success, user } │                │                │
    │                     │◄────────────────────┤                │                │
    │  { success, user }  │                     │                │                │
    │◄────────────────────┤                     │                │                │
    │                     │                     │                │                │
    │  router.push("/login?registered=1")       │                │                │
    ├───── (client nav) ──► LoginPage           │                │                │
    │                                         ToastClient shows  │                │
    │                                         "Account created"  │                │
```

**Flow details:**

1. User submits `RegisterForm` → client-side `fetch()` to `POST /api/auth/register`
2. API route calls `registerAction()` (server action)
3. Action calls `registerUser()` in service layer
4. Service validates with Zod, checks duplicates (email/username/phone), hashes
   password with bcrypt (12 rounds), calls `createUser()` in repository
5. Repository writes to PostgreSQL via Prisma
6. On success, client navigates to `/login?registered=1`
7. Login page reads `searchParams.registered` and renders `ToastClient` which
   fires a success toast

---

## Login Flow (Credentials)

```
LoginForm              NextAuth                Service           Repository
 (client)              (server)                (server)          (server)
    │                     │                       │                  │
    │ signIn("credentials", { redirect: false })  │                  │
    ├────────────────────►│                       │                  │
    │                     │ authorize()           │                  │
    │                     │     ├────────────────►│                  │
    │                     │     │  validateCredentials()             │
    │                     │     │  (Zod + bcrypt) │                  │
    │                     │     │                 │ findUserByEmail  │
    │                     │     │                 │ or ByUsername    │
    │                     │     │                 ├─────────────────►│
    │                     │     │                 │◄─────────────────┤
    │                     │     │◄────────────────┤                  │
    │                     │   JWT callback        │                  │
    │                     │   (inject id, role)   │                  │
    │                     │◄────── (user obj) ────┤                  │
    │   { ok, user? }     │                       │                  │
    │◄────────────────────┤                       │                  │
    │                     │                       │                  │
    │ fetch("/api/auth/session")                  │                  │
    │   check role ──► ADMIN? redirect /admin/dashboard              │
    │                  USER?  redirect /                              │
```

### JWT Callback

The `jwt` callback injects `id` and `role` into the JWT token. The `session`
callback reads them back into `session.user`, making them available in both
server (`getServerSession`) and client (`useSession`).

```js
// authOptions.js
jwt({ token, user }) {
  if (user) {
    token.id   = user.id;
    token.role = user.role;
  }
  return token;
}

session({ session, token }) {
  session.user.id   = token.id;
  session.user.role = token.role;
  return session;
}
```

---

## Google OAuth Flow

```
GoogleButton          NextAuth              Google              Repository
 (client)             (server)              (OAuth)             (server)
    │                    │                     │                   │
    │ signIn("google")   │                     │                   │
    ├───────────────────►│                     │                   │
    │                    │ Redirect to Google  │                   │
    │                    │────────────────────►│                   │
    │                    │     Authorization   │                   │
    │                    │◄────────────────────┤                   │
    │                    │                     │                   │
    │                    │ PrismaAdapter       │                   │
    │                    │ (create account     │                   │
    │                    │  if new, link if    │                   │
    │                    │  email exists via   │                   │
    │                    │  allowDangerous...  │                   │
    │                    │────────────────────────────────────────►│
    │                    │◄────────────────────────────────────────┤
    │                    │                     │                   │
    │  redirect to       │                     │                   │
│  callbackUrl           │                     │                   │
│◄───────────────────────┤                     │                   │
```

- `allowDangerousEmailAccountLinking: true` lets Google logins link to existing
  credential accounts when the email matches.
- The Google `profile()` callback strips extra properties from the profile so
  that `prisma.user.create` doesn't fail with "Unknown arg" errors.

---

## Role-Based Access

### Admin Guard (Server-Side)

```js
// app/admin/layout.jsx
const session = await getServerSession(authOptions);
if (!session || session.user?.role !== "ADMIN") {
  redirect("/login");
}
```

The admin layout checks the session on every request. Non-admin users are
redirected to `/login`. This is enforced at the layout level — all routes under
`/admin/*` inherit it.

### Session Validation (Server Actions)

```js
// lib/validations/validate-session.js
export async function validateSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new GeneralResponse(false, "Session not found.", null);
  }
  return new GeneralResponse(true, "Session valid", { user, userId });
}
```

Server actions call `validateSession()` before performing any mutation. This
ensures the user is authenticated even if they bypass the UI.

---

## Session Strategy

| Setting | Value | Reason |
|---------|-------|--------|
| Strategy | `jwt` | Stateless — no DB query on every page load |
| Secret | `NEXTAUTH_SECRET` | Environment variable |
| Pages | signIn: `/login` | Custom login page instead of NextAuth default |
| Debug | `true` in development | Troubleshoot OAuth issues |
