# Backend Migration Investigation: c3_backend → c3 (Monorepo)

## Executive Summary

The **c3** frontend repo already has significant backend functionality via **Next.js API Routes**, but the standalone **c3_backend** (Express.js) contains several items that are **missing, divergent, or incomplete** in the frontend repo. This document catalogs every gap.

---

## 1. Architecture Comparison

| Aspect | c3 (Frontend Repo) | c3_backend (Standalone) |
|--------|-------------------|------------------------|
| Framework | Next.js 16 API Routes | Express.js 5 |
| Language | TypeScript | JavaScript (ESM) |
| Auth | JWT (jose + HttpOnly cookies) | API Key (x-api-key header) |
| Validation | Zod | Manual typeof checks |
| Rate Limiting | None | express-rate-limit (per-endpoint) |
| Security Headers | Next.js config | Helmet (fine-tuned CSP, HSTS) |
| Request Logging | None | Custom with PII redaction |
| Tests | None for API | Jest + Supertest + in-memory Mongo |
| Deployment | Docker + Vercel | Render (render.yaml) |

---

## 2. Missing API Endpoints

### 2.1 GET /api/register/check (Email Existence Check)

**Status:** MISSING from frontend repo

The backend has a dedicated endpoint to check if an email is already registered, with aggressive rate limiting (10/hour per IP). This is used client-side to give instant feedback before form submission.

```javascript
// c3_backend: routes/register.js
router.get('/check', async (req, res) => {
  const { email } = req.query;
  // checks Registration2026 collection for existing email
  // rate limited: 10 requests/hour per IP
});
```

**Impact:** Without this, users only discover duplicate emails after submitting the full form.

---

### 2.2 GET /api/register (Registration Info Endpoint)

**Status:** MISSING from frontend repo

The backend has a root info endpoint that returns API documentation and usage instructions. While not critical for functionality, it serves as API self-documentation.

---

### 2.3 GET /api/recruitment (Recruitment Info Endpoint)

**Status:** MISSING from frontend repo

Same as above — returns recruitment API documentation and instructions.

---

### 2.4 GET /health (Health Check)

**Status:** MISSING from frontend repo

```javascript
// c3_backend: server.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

**Impact:** No health check endpoint for monitoring/uptime verification. Critical for production deployments.

---

## 3. Missing Database Models

### 3.1 NewMembers Model (Legacy)

**File:** `c3_backend/models/newMembers.js`
**Status:** MISSING from frontend repo

```javascript
// Collection: newmembers
{
  name, email, mobile, rollNumber,
  department, year, interests[],
  experience, expectations, referral
}
```

This is the **legacy** member schema. It's referenced in the backend's `server.js` as a fallback collection. While legacy, it may contain historical data that needs migration.

---

### 3.2 Registration Model (Legacy/Ticketing)

**File:** `c3_backend/models/registration.js`
**Status:** MISSING from frontend repo

```javascript
// Collection: registration
{
  name, mobile, email, department,
  interests[], expectations,
  registrationID  // ticket-style ID
}
```

This is a different schema from `Registration2026` — it has a `registrationID` field and lacks `rollNumber`, `year`, `experience`, `referral`. Used for an older ticketing/event registration flow.

---

## 4. Missing Middleware & Security Features

### 4.1 Rate Limiting (CRITICAL)

**Status:** MISSING from frontend repo

The backend has **three tiers** of rate limiting that are entirely absent:

| Limiter | Window | Max | Applied To |
|---------|--------|-----|-----------|
| General API | 15 min | 100/IP | POST /register, POST /recruitment/unlock |
| Email Check | 1 hour | 10/IP | GET /register/check |
| Auth Failure | 15 min | 5 failed/IP | Failed x-api-key attempts |

```javascript
// c3_backend: route-level rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' }
});
```

**Impact:** All API routes in the frontend repo are completely unprotected from abuse/brute-force.

**Next.js Equivalent Needed:** Use `@upstash/ratelimit`, `next-rate-limit`, or custom middleware in API route handlers.

---

### 4.2 Request Logging with PII Redaction

**Status:** MISSING from frontend repo

The backend has comprehensive request logging that:
- Logs timestamp, method, URL for every request
- **Redacts sensitive fields** (email, mobile, password, token, rollNumber)
- **Redacts API key** from headers

```javascript
// c3_backend: server.js
const SENSITIVE_FIELDS = ['email', 'mobile', 'password', 'token', 'rollNumber'];
const redactBody = (body) => {
  const redacted = { ...body };
  SENSITIVE_FIELDS.forEach(field => {
    if (redacted[field]) redacted[field] = '[REDACTED]';
  });
  return redacted;
};
```

**Impact:** No request-level observability. Debugging production issues will be significantly harder.

---

### 4.3 Auth Failure Rate Limiting

**Status:** MISSING from frontend repo

The backend tracks failed authentication attempts per IP and rate-limits after 5 failures in 15 minutes. The frontend's JWT auth has no such protection.

**Impact:** Admin login endpoint is vulnerable to brute-force attacks.

---

### 4.4 Helmet Security Headers (Fine-Tuned)

**Status:** PARTIAL — frontend has CSP via next.config.js but missing several headers

The backend configures Helmet with:
- **HSTS** with 1-year max-age, includeSubDomains, preload
- **Cross-Origin Embedder Policy**
- **Cross-Origin Opener Policy**
- **Cross-Origin Resource Policy**

The frontend repo has CSP headers in `next.config.js` but is missing the HSTS and cross-origin policies.

---

## 5. Authentication Divergence

### Current State: Two Different Auth Systems

| Feature | c3 (JWT) | c3_backend (API Key) |
|---------|----------|---------------------|
| Mechanism | JWT token in HttpOnly cookie | API key in x-api-key header |
| Library | jose | crypto.timingSafeEqual |
| Session | 8-hour expiry | Stateless per-request |
| Storage | Cookie | Header |
| Timing-safe | No (JWT verification) | Yes (timingSafeEqual) |

### What's Missing from Frontend Auth:

1. **Timing-safe comparison** — The backend uses `crypto.timingSafeEqual()` to prevent timing attacks. JWT verification via jose handles this internally, so this is acceptable.
2. **Auth failure tracking** — Backend tracks failed attempts per IP; frontend does not.
3. **Admin password auth** — Frontend uses a single `ADMIN_PASSWORD` env var checked directly; backend uses `API_KEY` header. The frontend approach is actually more suitable for a web dashboard.

**Recommendation:** The JWT approach in the frontend is arguably better for a web dashboard. Keep it, but add rate limiting on the login endpoint.

---

## 6. Missing Input Validation Patterns

### 6.1 NoSQL Injection Prevention

**Backend approach (explicit type checking):**

```javascript
// c3_backend: routes/register.js
if (typeof name !== 'string' || typeof email !== 'string') {
  return res.status(400).json({ error: 'Invalid field types' });
}
// Uses explicit $eq operator in queries
const existing = await Registration2026.findOne({ email: { $eq: email } });
```

**Frontend approach:** Uses Zod schemas which inherently validate types. However, need to verify that MongoDB queries use safe patterns.

**Verdict:** Frontend's Zod validation is actually stronger for type safety. Verify all queries use parameterized patterns.

---

### 6.2 Input Length Limits

**Backend:** Enforces explicit length limits on all string inputs (e.g., name max 100 chars, email max 254 chars).

**Frontend:** Zod schema should define these — need to verify `src/features/join/api/schema.ts` has `.max()` constraints.

---

### 6.3 Regex Escaping for Search

**Backend:** Has explicit regex escaping for search queries.

**Frontend:** The admin members/recruitment API routes do regex search — need to verify escaping is applied.

---

## 7. Missing Tests

**Status:** Frontend repo has NO API/backend tests

The backend has a test suite with:
- Health check test
- Registration API info test
- Registration validation test (missing required fields)
- Successful registration flow test
- In-memory MongoDB for test isolation

**Missing test coverage in frontend:**
- No API route tests
- No authentication tests
- No rate limiting tests
- No database model tests
- No security/injection tests
- No email service tests

---

## 8. Missing Documentation

| Document | Backend | Frontend |
|----------|---------|----------|
| ARCHITECTURE.md | Yes | No |
| DECISIONS.md | Yes | No |
| QUICK_START.md | Yes | No |
| SECURITY_AUDIT_REPORT.md | Yes (738 lines) | No (only SECURITY.md policy) |

These backend documents contain valuable architectural decisions and security analysis that should be consolidated into the monorepo.

---

## 9. Missing Deployment Configuration

### Render Configuration (render.yaml)

**Status:** Not applicable — frontend uses Docker + Vercel

The backend's `render.yaml` specifies:
- Node.js web service
- `npm ci` build command
- `node server.js` start command
- Auto-deploy enabled

**For the monorepo:** This needs to be replaced with a combined deployment strategy. Options:
1. Deploy Next.js frontend + API routes together on Vercel
2. Deploy via Docker (frontend already has Dockerfile)
3. Separate deployments with shared env vars

---

## 10. Feature Parity Checklist

| Feature | Backend | Frontend | Gap |
|---------|---------|----------|-----|
| Member registration | POST /api/register | POST /api/join | Route name differs |
| Email check | GET /api/register/check | — | **MISSING** |
| Recruitment unlock | POST /api/recruitment/unlock | POST /api/recruitment/unlock | Match |
| Recruitment submit | POST /api/recruitment/submit | POST /api/recruitment/submit | Match |
| Admin stats | GET /api/admin/stats | GET /api/admin/stats | Match |
| Admin members list | GET /api/admin/members | GET /api/admin/members | Match |
| Admin members CSV | GET /api/admin/members/export | GET /api/admin/members/export | Match |
| Admin recruitment | GET /api/admin/recruitment | GET /api/admin/recruitment | Match |
| Admin recruitment CSV | GET /api/admin/recruitment/export | GET /api/admin/recruitment/export | Match |
| Admin login | API key auth | POST /api/admin/login (JWT) | Different auth |
| Admin logout | — | POST /api/admin/logout | Frontend has more |
| Health check | GET /health | — | **MISSING** |
| Rate limiting | 3 tiers | — | **MISSING** |
| Request logging | With PII redaction | — | **MISSING** |
| Security headers | Helmet (comprehensive) | next.config.js (partial) | **GAP** |
| Legacy models | newMembers, registration | — | **MISSING** (may be intentional) |
| API tests | Jest + Supertest | — | **MISSING** |
| Email sending | Gmail API | Gmail API | Match |
| CSV export | csv utility | csv utility | Match |

---

## 11. Priority Matrix for Monorepo Migration

### P0 — Must Have (Security/Functionality)

1. **Rate limiting** on all API routes (especially auth and registration)
2. **Request logging** with PII redaction
3. **Auth failure rate limiting** on admin login
4. **Health check endpoint** (/api/health)
5. **HSTS and cross-origin security headers**
6. **API tests** for all routes

### P1 — Should Have (Feature Completeness)

7. **Email existence check endpoint** (GET /api/join/check)
8. **Input length limits** in Zod schemas
9. **Regex escaping audit** for admin search queries
10. **Consolidate documentation** (ARCHITECTURE.md, DECISIONS.md, SECURITY_AUDIT_REPORT.md)

### P2 — Nice to Have (Data/Legacy)

11. **Legacy model migration** strategy (newMembers, registration collections)
12. **API info endpoints** (self-documentation)
13. **Monorepo tooling** (turborepo/nx workspace config, shared configs)

---

## 12. Monorepo Setup Recommendations

### Target Structure

```
c3/
├── apps/
│   ├── web/              # Next.js frontend (current src/)
│   └── api/              # OR keep API routes in Next.js
├── packages/
│   ├── shared/           # Shared types, constants, schemas
│   ├── db/               # MongoDB models + connection
│   ├── email/            # Gmail service
│   └── auth/             # Authentication logic
├── package.json          # Workspace root
├── turbo.json            # Turborepo config
└── ...
```

### Decision Point: Keep Next.js API Routes or Separate Express Backend?

**Option A: Keep API Routes in Next.js (Recommended)**
- Simpler deployment (single service)
- Already mostly implemented
- Vercel-optimized
- Missing: rate limiting, logging (can be added as middleware)

**Option B: Separate Express Backend**
- Backend already written and tested
- More flexible for scaling
- Independent deployment lifecycle
- Requires CORS configuration between frontend and backend

---

## 13. Summary

| Category | Missing Items | Severity |
|----------|--------------|----------|
| API Endpoints | 4 (health, email check, 2 info) | Medium |
| Database Models | 2 (legacy) | Low |
| Security Middleware | 3 (rate limiting, logging, headers) | **Critical** |
| Tests | All API tests | **High** |
| Documentation | 4 files | Medium |
| Deployment Config | Render → combined strategy | Medium |

**Total unique backend items missing from frontend repo: 15+**

The most critical gaps are around **security middleware** (rate limiting, auth failure tracking, comprehensive security headers) and **testing**. The core business logic (registration, recruitment, admin, email) is already ported to the Next.js API routes — the gaps are primarily in the protective layers around that logic.
