# Project Structure

```
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: public auth pages
│   │   ├── login/
│   │   │   ├── page.js           # Login page (server)
│   │   │   └── redirect-if-auth.js
│   │   └── register/
│   │       └── page.js           # Registration page (server)
│   ├── admin/                    # Route group: admin section
│   │   ├── layout.jsx            # Admin layout (auth guard + sidebar)
│   │   ├── page.js               # Redirects to /admin/dashboard
│   │   ├── dashboard/
│   │   │   └── page.js           # Dashboard page
│   │   └── users/
│   │       └── page.js           # User management stub
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.js      # NextAuth handler
│   │       └── register/
│   │           └── route.js      # Registration API
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js                 # Root layout
│   ├── not-found.jsx             # Custom 404 page
│   └── page.js                   # Home / landing page
│
├── components/                   # Reusable React components
│   ├── admin/
│   │   └── AdminNav.jsx          # Admin sidebar + mobile drawer
│   ├── auth/
│   │   ├── AuthButton.jsx        # Styled submit button
│   │   ├── AuthDivider.jsx       # "or" divider
│   │   ├── AuthInput.jsx         # Validation-aware input wrapper
│   │   ├── GoogleButton.jsx      # Google OAuth button
│   │   ├── LoginForm.jsx         # Login form (client)
│   │   └── RegisterForm.jsx      # Register form (client)
│   ├── common/
│   │   ├── ClientLayout.jsx      # SessionProvider + Toaster
│   │   ├── SideDialog.jsx        # Slide-in drawer component
│   │   └── header/
│   │       ├── ConditionalHeader.jsx
│   │       └── Header.jsx
│   └── ui/                       # Design system primitives
│       ├── alert.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── checkbox.jsx
│       ├── confirm-dialog.jsx
│       ├── dialog.jsx            # Radix UI dialog
│       ├── error-dialog.jsx
│       ├── input.jsx
│       ├── pagination.jsx
│       ├── sonner.jsx            # Toast provider + toast export
│       ├── success-banner.jsx
│       ├── success-dialog.jsx
│       ├── ToastClient.jsx       # Toast trigger component
│       └── ...                   # badge, textarea, strength-bar, etc.
│
├── lib/                          # Application logic
│   ├── actions/
│   │   ├── auth.actions.js       # Server actions for auth
│   │   └── profile.actions.js    # Server actions for profile
│   ├── model/
│   │   └── response.js           # GeneralResponse class
│   ├── repositories/
│   │   └── user.repository.js    # User DB access
│   ├── services/
│   │   ├── auth.service.js       # Registration, login, password change
│   │   └── profile.service.js    # Profile read/update
│   ├── validations/
│   │   ├── auth.schema.js        # Zod schemas (register, login, password)
│   │   ├── profile.schema.js     # Zod schemas (profile update)
│   │   └── validate-session.js   # Server-side session validator
│   ├── authOptions.js            # NextAuth configuration
│   ├── fonts.js                  # Font definitions
│   ├── prisma.js                 # Prisma client singleton
│   ├── styles.js                 # Reusable style classes
│   └── utils.js                  # cn() utility
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Versioned SQL migrations
│
├── docker/
│   ├── nextjs/
│   │   ├── Dockerfile            # Multi-stage build
│   │   └── entrypoint.sh         # Production entrypoint (migrate + start)
│   ├── nginx/
│   │   └── nginx.conf            # Reverse proxy config
│   └── postgres/
│       └── init.sql              # DB init script
│
├── docker-compose.dev.yml        # Dev Docker services
├── docker-compose.prod.yml       # Production Docker services
├── public/                       # Static assets
└── docs/architecture/            # This documentation
```

## Naming Conventions

| Extension | Usage |
|-----------|-------|
| `.js` | Server Components (no client hooks needed) |
| `.jsx` | Client Components (`"use client"`) or files with JSX |
| `.service.js` | Business logic in `lib/services/` |
| `.repository.js` | Data access in `lib/repositories/` |
| `.actions.js` | Server Actions in `lib/actions/` |
| `.schema.js` | Zod validation schemas |
