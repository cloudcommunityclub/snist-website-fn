# Current State - Cloud Community Club (C³)

This document provides a live summary of the repository status, active components, dependencies, and identified pending tasks.

## 1. Directory Structure
- `src/app`: Page Router paths including registration (`join`), admin console, and integrated backend routes (`api/`).
- `src/components`: UI modules including the core terminal interface (`TerminalJoinForm.tsx`).
- `src/models`: Mongoose database schemas defining database structures.
- `src/lib`: Core utility helper integrations (Traditional SMTP Mailer, Cloudflare R2 bucket connection, CSV helpers, database connections).

## 2. Component Health Matrix
| Page / Module | Status | Notes |
|---|---|---|
| Homepage (`/`) | **Completed** | Full scroll page with animations, sound effects, and asset preloads. |
| Onboarding Form (`/join`) | **Completed** | Terminal interactive form with Zod schema checking and Git commit simulations. |
| Admin Session Auth (`/admin/login`) | **Completed** | Secure password check producing JWT cookie credentials. |
| Admin Console (`/admin/dashboard`) | **Completed** | Statistics view, CSV export split by members, all-field search, and interactive Reject action with customizable reasons. |
| Ideathon & Recruitment APIs | **Completed** | APIs to submit ideas, record payments, lock/unlock tasks, and accept/reject submissions. Rejecting or accepting a submission cleans up referral tables and sends SMTP emails to all members. |
| GSAP Ideathon Form (`/events/digitalindia`) | **Completed** | Apple-style light silver horizontal accordion form with GSAP width animations. Fully responsive for tablet/mobile. Includes hackathon info header, text error feedback, and flexible 10-35 character UTR validation. |
| Digital India Countdown (`/events/digitalindia/countdown`) | **Completed** | Real-time countdown clock in luxury dark theme with mount-hydration safeties. |


## 3. Identified Gaps & Technical Debt (P0-P1 Priorities)
Based on comparative analysis of the standalone backend migration plan:

- **Rate Limiting (P0)**: `POST /api/join` and `POST /api/digital-india/submit` have rate limiting implemented. `POST /api/admin/login` still needs it.
- **Request & PII Logging (P0)**: BN has PII redaction and request logging. FN relies on Vercel platform logs.
- **Health Check Endpoint**: BN has `GET /health`. FN has no health check endpoint.
- **Security Headers (P1)**: `next.config.js` is missing strict HTTP Strict Transport Security (HSTS) settings and Cross-Origin Resource Policy configurations.
- **Email Pre-flight checks (P1)**: The client form cannot pre-flight check if an email already exists because the `GET /api/join/check` route is missing.
