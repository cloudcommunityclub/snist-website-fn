# C3 Monorepo Migration Plan

## Context

The C3 project currently has two separate repos:

- **`c3`** — Next.js 16 frontend + API routes (TypeScript)
- **`c3_backend`** — Express.js backend (JavaScript, ~1200 lines)

The frontend already duplicates most backend logic in Next.js API routes. This plan consolidates everything into a single monorepo with proper package boundaries.

**Decisions:**
- Backend: Next.js API Routes (no separate Express server)
- Tooling: npm workspaces (no Turborepo)

---

## Target Structure

```
c3/
├── package.json                     # npm workspaces root
├── tsconfig.base.json               # Shared TS config
├── .gitignore, .prettierrc, eslint.config.mjs
├── Dockerfile, .env.example
├── README.md, ARCHITECTURE.md, SECURITY.md, GUIDE.md
├── LICENSE, CREDITS.md
├── .github/workflows/
│
├── apps/
│   └── web/                         # Next.js app (frontend + API routes)
│       ├── package.json             # @c3/web
│       ├── next.config.js
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       ├── tsconfig.json            # extends root base
│       ├── public/                  # Static assets (77MB)
│       ├── src/
│       │   ├── middleware.ts        # From proxy.ts + rate limiting
│       │   ├── app/
│       │   │   ├── api/
│       │   │   │   ├── health/route.ts              # NEW
│       │   │   │   ├── join/
│       │   │   │   │   ├── route.ts                 # Updated imports
│       │   │   │   │   └── check/route.ts           # NEW
│       │   │   │   ├── recruitment/
│       │   │   │   │   ├── submit/route.ts
│       │   │   │   │   └── unlock/route.ts
│       │   │   │   └── admin/
│       │   │   │       ├── login/route.ts
│       │   │   │       ├── logout/route.ts
│       │   │   │       ├── stats/route.ts
│       │   │   │       ├── members/{route,export}/route.ts
│       │   │   │       └── recruitment/{route,export}/route.ts
│       │   │   ├── admin/, blogs/, events/, internships/
│       │   │   ├── join/, projects/, recruitment/
│       │   │   ├── layout.tsx, page.tsx, globals.css
│       │   │   └── error.tsx, not-found.tsx
│       │   ├── components/          # 20+ React components
│       │   ├── config/constants.ts
│       │   ├── dispositions/        # Data files
│       │   └── lib/
│       │       ├── csv.ts           # Stays (only used by admin export)
│       │       ├── rate-limit.ts    # NEW
│       │       └── logger.ts       # NEW
│       └── tests/                   # NEW
│           └── api/
│               ├── health.test.ts
│               ├── join.test.ts
│               ├── join-check.test.ts
│               ├── recruitment.test.ts
│               └── admin.test.ts
│
├── packages/
│   ├── types/                       # @c3/types — Pure TS interfaces
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts             # Activity, Project, ResearchArea
│   │       └── recruitment.ts       # Candidate, ProblemStatement
│   │
│   ├── db/                          # @c3/db — MongoDB + models
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts             # Re-exports
│   │       ├── connect.ts           # dbConnect singleton
│   │       └── models/
│   │           ├── registration2026.ts
│   │           └── recruitment.ts
│   │
│   ├── email/                       # @c3/email — Gmail service
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts             # Re-exports
│   │       ├── client.ts            # OAuth2 + sendEmail + escHtml + makeBody
│       │       └── templates/
│       │           └── welcome.ts   # Extracted from join/route.ts
│   │
│   └── schemas/                     # @c3/schemas — Zod validation
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── join.ts              # joinClubSchema + DEPARTMENTS
```

---

## File Mapping — What Moves Where

### Extract to `packages/`

| From (c3) | To | Reason |
|---|---|---|
| `src/types/index.ts` | `packages/types/src/index.ts` | Shared by components + API |
| `src/types/recruitment.ts` | `packages/types/src/recruitment.ts` | Shared by components + API |
| `src/lib/db.ts` | `packages/db/src/connect.ts` | Used by all API routes |
| `src/models/Registration2026.ts` | `packages/db/src/models/registration2026.ts` | Used by join + admin routes |
| `src/models/Recruitment.ts` | `packages/db/src/models/recruitment.ts` | Used by recruitment + admin routes |
| `src/lib/gmail.ts` | `packages/email/src/client.ts` | Used by join route |
| (inline HTML in `join/route.ts`) | `packages/email/src/templates/welcome.ts` | Deduplicate ~130 line email template |
| `src/features/join/api/schema.ts` | `packages/schemas/src/join.ts` | Shared by form + API validation |

### Move to `apps/web/`

| From (c3) | To | Notes |
|---|---|---|
| `src/app/**` | `apps/web/src/app/**` | All pages + API routes |
| `src/components/**` | `apps/web/src/components/**` | All React components |
| `src/config/**` | `apps/web/src/config/**` | Constants |
| `src/dispositions/**` | `apps/web/src/dispositions/**` | Data files |
| `src/lib/csv.ts` | `apps/web/src/lib/csv.ts` | Stays in app (admin-only) |
| `src/proxy.ts` | `apps/web/src/middleware.ts` | Renamed for Next.js convention |
| `public/**` | `apps/web/public/**` | Static assets |
| `next.config.js` | `apps/web/next.config.js` | |
| `tailwind.config.js` | `apps/web/tailwind.config.js` | |
| `postcss.config.js` | `apps/web/postcss.config.js` | |

### Stay at Root

`.gitignore`, `.prettierrc`, `.prettierignore`, `eslint.config.mjs`, `Dockerfile`, `.env.example`, `.github/`, `LICENSE`, `CREDITS.md`, documentation files

---

## npm Workspace Configuration

### Root `package.json`

```json
{
  "name": "c3-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev -w apps/web",
    "build": "npm run build -w apps/web",
    "start": "npm run start -w apps/web",
    "lint": "npm run lint -w apps/web",
    "test": "npm run test -w apps/web"
  }
}
```

### Package Naming

| Package | Name | Dependencies |
|---|---|---|
| `packages/types` | `@c3/types` | None |
| `packages/schemas` | `@c3/schemas` | zod |
| `packages/db` | `@c3/db` | mongoose |
| `packages/email` | `@c3/email` | googleapis |
| `apps/web` | `@c3/web` | All above + next, react, etc. |

### Import Pattern

Each package uses `"main": "./src/index.ts"` — no build step needed. Next.js bundler resolves via `tsconfig.json` paths:

```jsonc
// apps/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@c3/types": ["../../packages/types/src"],
      "@c3/db": ["../../packages/db/src"],
      "@c3/email": ["../../packages/email/src"],
      "@c3/schemas": ["../../packages/schemas/src"]
    }
  }
}
```

Usage in API routes and components:

```typescript
import { dbConnect, Registration2026 } from '@c3/db'
import { sendEmail } from '@c3/email'
import { joinClubSchema } from '@c3/schemas'
import type { Project } from '@c3/types'
```

---

## Missing Backend Features to Add

These items from `c3_backend` are absent from the frontend and must be built into `apps/web/`:

| # | Feature | Priority | Action |
|---|---------|----------|--------|
| 1 | **Rate limiting** (3 tiers: API 100/15min, email check 10/hr, auth failure 5/15min) | P0 | Create `lib/rate-limit.ts` using `rate-limiter-flexible` |
| 2 | **Request logging** with PII redaction (email, mobile, token, rollNumber) | P0 | Create `lib/logger.ts` |
| 3 | **Health check** endpoint (`GET /api/health`) | P0 | Create `api/health/route.ts` |
| 4 | **Auth failure rate limiting** on admin login | P0 | Update `admin/login/route.ts` |
| 5 | **Email existence check** (`GET /api/join/check?email=...`) | P1 | Create `api/join/check/route.ts` |
| 6 | **API route tests** | P0 | Create `tests/api/*.test.ts` with vitest + mongodb-memory-server |
| 7 | **HSTS + cross-origin headers** | P1 | Update `next.config.js` security headers |

### Rate Limiting Design

```typescript
// apps/web/src/lib/rate-limit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible'

export const apiLimiter = new RateLimiterMemory({
  points: 100,
  duration: 15 * 60, // 100 req / 15 min
})

export const emailCheckLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60, // 10 req / hour
})

export const authFailureLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60, // 5 failed attempts / 15 min
})

// Helper to apply in route handlers
export async function withRateLimit(
  request: Request,
  limiter: RateLimiterMemory,
): Promise<{ limited: boolean; response?: NextResponse }>
```

> **Note:** `RateLimiterMemory` works for Docker deployment (persistent server). For Vercel serverless, switch to `@upstash/ratelimit` with Redis.

### Request Logging Design

```typescript
// apps/web/src/lib/logger.ts
const SENSITIVE_FIELDS = ['email', 'mobile', 'password', 'token', 'rollNumber', 'phone']

function redact(obj: Record<string, unknown>): Record<string, unknown> { ... }

export function logRequest(method: string, url: string, body?: unknown) {
  console.log(`[${new Date().toISOString()}] ${method} ${url}`)
  // Logs redacted body if present
}
```

---

## What NOT to Bring from `c3_backend`

| Item | Reason |
|---|---|
| Legacy models (`newMembers.js`, `registration.js`) | Deprecated. Handle as one-time data migration if needed. |
| Express.js server | Replaced by Next.js API routes. |
| API key auth (`x-api-key` header) | JWT auth in frontend is better for web dashboards. |
| `render.yaml` | Deployment is Docker/Vercel, not Render. |
| `bun.lock` | Using npm exclusively. |

---

## Migration Phases

### Phase 1: Scaffold (no code changes)

1. Create `packages/{types,db,email,schemas}` with `package.json` + `tsconfig.json`
2. Create `apps/web/` directory
3. Create root `package.json` with workspaces
4. Create `tsconfig.base.json`
5. Run `npm install` — verify workspace resolution

### Phase 2: Extract Packages (bottom-up)

6. Extract `@c3/types` — move `src/types/*`, zero dependencies
7. Extract `@c3/schemas` — move `features/join/api/schema.ts`
8. Extract `@c3/db` — move `lib/db.ts` + `models/*`
9. Extract `@c3/email` — move `lib/gmail.ts`, extract welcome template from `join/route.ts`

### Phase 3: Move App

10. Move `src/` → `apps/web/src/`
11. Move config files → `apps/web/`
12. Move `public/` → `apps/web/public/`
13. Update `apps/web/tsconfig.json` with workspace paths
14. Update `apps/web/package.json` with workspace deps

### Phase 4: Update Imports

15. Replace all `@/lib/db` → `@c3/db`, `@/models/*` → `@c3/db`, `@/lib/gmail` → `@c3/email`, `@/types` → `@c3/types`, `@/features/join/api/schema` → `@c3/schemas`
16. Remove duplicated Zod schema from `join/route.ts`
17. Replace ~130-line inline email HTML with template from `@c3/email`
18. Rename `proxy.ts` → `middleware.ts`

### Phase 5: Add Missing Features

19. Create `lib/rate-limit.ts` and `lib/logger.ts`
20. Create `api/health/route.ts` and `api/join/check/route.ts`
21. Apply rate limiting to all API routes
22. Add HSTS + cross-origin headers to `next.config.js`

### Phase 6: Tests

23. Add `vitest` + `mongodb-memory-server` to devDependencies
24. Create test helpers and infrastructure
25. Write tests for all API routes

### Phase 7: Cleanup

26. Delete old root `src/`, `bun.lock`
27. Update `Dockerfile` for monorepo paths
28. Update `.gitignore`, consolidate documentation
29. Update `README.md`

---

## Verification Checklist

### After Phase 1 (Scaffold)
- [ ] `npm install` succeeds without errors
- [ ] `npm ls --all` shows all workspace packages

### After Phase 2 (Packages)
- [ ] Each package resolves correctly
- [ ] No circular dependencies between packages

### After Phase 3 (App Moved)
- [ ] `npm run dev` starts Next.js dev server
- [ ] Homepage (`/`) loads correctly
- [ ] All pages render: `/blogs`, `/events`, `/join`, `/projects`, `/recruitment`, `/admin`

### After Phase 4 (Imports Updated)
- [ ] `npm run build` succeeds (no unresolved imports)
- [ ] `npm run lint` passes with no new errors

### After Phase 5 (Missing Features)
- [ ] `GET /api/health` returns `{ status: 'ok' }`
- [ ] `POST /api/join` validates and creates a member
- [ ] `GET /api/join/check?email=...` returns existence status
- [ ] `POST /api/recruitment/unlock` works
- [ ] `POST /api/admin/login` issues JWT cookie
- [ ] Rate limiting: 101st request to `/api/join` in 15 min returns 429
- [ ] Rate limiting: 6th failed login in 15 min returns 429
- [ ] Console logs show redacted PII

### After Phase 6 (Tests)
- [ ] `npm test` runs all tests and passes

### After Phase 7 (Cleanup)
- [ ] `docker build .` succeeds
- [ ] Deployed instance passes same verification as Phase 4

---

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Next.js standalone output with workspace packages | Next.js traces and bundles workspace deps. Verify during Phase 3. Fallback: use npm symlinks without `paths` aliases. |
| `RateLimiterMemory` resets on serverless cold starts | Only use with Docker deployment. For Vercel, use `@upstash/ratelimit`. Document in deployment guide. |
| Middleware file detection by Next.js | Ensure file is named `middleware.ts` inside `apps/web/src/`. Verify `config.matcher` still works. |
| Mixed lock files (`bun.lock` + `package-lock.json`) | Delete `bun.lock`, use only `package-lock.json` with npm. |

---

## Dependency Graph

```
@c3/types (leaf)        @c3/schemas (zod)
       \                    /
        \                  /
         apps/web (Next.js)
        /                  \
       /                    \
@c3/db (mongoose)      @c3/email (googleapis)
```

No package depends on another package — all are leaf dependencies consumed only by `apps/web`. This keeps the monorepo simple and avoids circular dependency issues.
