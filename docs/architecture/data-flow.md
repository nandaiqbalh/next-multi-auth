# Data & Code Flow

This document traces how data moves through the system for key operations,
and how the layered architecture connects at the code level.

---

## Pattern: Request Through All Layers

Every mutation follows this entry-to-database path:

```
HTTP / Server Action
       │
       ▼
  ┌─────────────┐
  │ Action Layer │  Session validation, orchestration
  │ (server)    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Service Layer│  Zod validation, business rules, workflows
  │ (server)    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Repository  │  Prisma query, try/catch, GeneralResponse
  │ (server)    │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ PostgreSQL  │  Database
  └─────────────┘
```

All layers return `GeneralResponse { success, message, data? }` — never throw.

---

## Flow 1: User Registration

### Call chain (code-level):

```
app/api/auth/register/route.js       ← HTTP POST
  ├── POST(req)
  │   body = await req.json()
  │
  ├── lib/actions/auth.actions.js
  │   ├── registerAction(formData)
  │   │   └── lib/services/auth.service.js
  │   │       └── registerUser(payload)
  │   │           ├── registerServiceSchema.safeParse(payload)   ← Zod server validation
  │   │           ├── findUserByEmail(email)                    ← Duplicate check
  │   │           ├── findUserByUsername(username)
  │   │           ├── findUserByPhone(phone)
  │   │           ├── bcrypt.hash(password, 12)                 ← Password hashing
  │   │           └── lib/repositories/user.repository.js
  │   │               └── createUser(data)
  │   │                   └── prisma.user.create({ data })      ← DB write
  │   │
  │   └── return { success, message, user }
  │
  └── NextResponse.json(result, { status: 201 })
```

### Response shape (every layer):

| Layer | Returns |
|-------|---------|
| Repository | `GeneralResponse { success, message, data }` |
| Service | `{ success, message, data?, errors? }` |
| Action | `{ success, message, user?, errors? }` |
| API Route | `NextResponse.json(...)` |

---

## Flow 2: Login via Credentials

```
components/auth/LoginForm.jsx        ← Client component
  ├── signIn("credentials", { redirect: false, identifier, password })
  │
  ├── NextAuth (app/api/auth/[...nextauth]/route.js)
  │   ├── providers → CredentialsProvider
  │   │   └── authorize(credentials)
  │   │       └── lib/services/auth.service.js
  │   │           └── validateCredentials({ identifier, password })
  │   │               ├── loginSchema.safeParse()               ← Zod
  │   │               ├── findUserByEmail() or findUserByUsername()
  │   │               ├── bcrypt.compare(password, user.password)
  │   │               └── return user object or null
  │   │
  │   ├── callbacks.jwt({ token, user })   ← Inject id + role
  │   └── callbacks.session({ session, token }) ← Read into session
  │
  ├── On success:
  │   ├── fetch("/api/auth/session")       ← Get current session
  │   ├── Check session.user.role
  │   ├── ADMIN → router.push("/admin/dashboard?toast=welcome")
  │   └── USER  → router.push("/?toast=welcome")
  │
  └── On error:
      ├── setDialog({ open: true, ... })   ← Error dialog
      └── toast.error(message)             ← Sonner toast
```

---

## Flow 3: Profile Update (Server Action)

```
Client Component                     Server Action               Service            Repository
    │                                    │                        │                   │
    │  updateProfileAction(data)          │                        │                   │
    ├───────────────────────────────────►│                        │                   │
    │                                    │  validateSession()     │                   │
    │                                    ├── getServerSession()   │                   │
    │                                    │  (check auth)          │                   │
    │                                    │                        │                   │
    │                                    │  updateUserProfile()   │                   │
    │                                    ├───────────────────────►│                   │
    │                                    │                        │ profileSchema     │
    │                                    │                        │ .safeParse(data)  │
    │                                    │                        │                   │
    │                                    │                        │ findUserById()    │
    │                                    │                        ├──────────────────►│
    │                                    │                        │◄──────────────────┤
    │                                    │                        │                   │
    │                                    │                        │ Check dups        │
    │                                    │                        │ (username/phone)  │
    │                                    │                        │                   │
    │                                    │                        │ updateUser()      │
    │                                    │                        ├──────────────────►│
    │                                    │                        │◄──────────────────┤
    │                                    │◄───────────────────────┤                   │
    │                                    │                        │                   │
    │  { success, message }              │                        │                   │
    │◄───────────────────────────────────┤                        │                   │
```

---

## Flow 4: Page Render with Auth

```
Browser Request
       │
       ▼
app/admin/layout.jsx                    ← Server Component
  ├── getServerSession(authOptions)      ← Reads JWT from cookie
  │   └── If no session or !ADMIN       ← Auth guard
  │       └── redirect("/login")
  │
  ├── <AdminNav />                       ← Client Component
  │   ├── Desktop sidebar (hidden < lg)
  │   └── Mobile drawer (SideDialog)
  │
  └── {children}
      └── app/admin/dashboard/page.js   ← Server Component
          ├── <ToastClient />           ← Client Component
          │   └── useEffect → toast     ← Imperative toast
          └── Dashboard content
```

---

## Validation Strategy

Validation happens at **two levels** for every input:

### Client-side (immediate UX feedback)

```js
// components/auth/RegisterForm.jsx
useForm({
  resolver: zodResolver(registerSchema),  ← Zod on every keystroke
});
```

- Real-time field validation via `react-hook-form` + `@hookform/resolvers`
- Shows inline errors under each field
- Prevents submission when schema is invalid

### Server-side (security & integrity)

```js
// lib/services/auth.service.js
const parsed = registerServiceSchema.safeParse(payload);  ← No confirmPassword here
if (!parsed.success) {
  return { success: false, message: firstMessage, errors };
}
```

- Re-validates ALL input on the server
- Uses a separate schema without `confirmPassword` (already validated client-side)
- Returns user-friendly error messages mapped to specific fields

### Why both?

| Client-side | Server-side |
|-------------|-------------|
| Instant feedback | Cannot be bypassed (curl, Postman) |
| Reduces server load | Catches tampered requests |
| Better UX | Defends against malformed data |

---

## Error Handling Pattern

### Repository -> Service -> Action -> UI

```
Repository:  try { ... } catch(e) { return new GeneralResponse(false, msg) }
Service:     const res = await repo(); if (!res.success) return { success: false, message }
Action:      const res = await service(); return { success: res.success, message: res.message }
UI:          if (!res.success) { setDialog({...}); toast.error(res.message) }
```

Errors are never thrown across layers — they're returned as structured
responses. The UI decides how to present them (toast, dialog, inline error).

---

## Key File Dependencies

```
auth.schema.js ───────────────────┬───── RegisterForm (client)
                                  ├───── LoginForm (client)
                                  ├───── auth.service.js (server)
                                  └───── auth.actions.js (server)

user.repository.js ───────────────┬───── auth.service.js
                                  └───── profile.service.js

auth.service.js ──────────────────┬───── auth.actions.js
                                  ├───── authOptions.js (NextAuth authorize)
                                  └───── api/auth/register/route.js

profile.service.js ───────────────┴───── profile.actions.js

validate-session.js ──────────────┬───── auth.actions.js
                                  └───── profile.actions.js
```
