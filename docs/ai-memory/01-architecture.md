# System Architecture - Cloud Community Club (C³)

This document describes the design patterns, technology choices, and data flow architecture of the C³ platform.

```mermaid
graph TD
    Client[Next.js 16 Web Client / React 19 / Tailwind 4]
    FN[Next.js Route Handlers]
    BN[Express.js API Server]
    DB[(MongoDB Atlas / Mongoose)]
    SMTP[SMTP Mailer / nodemailer]
    Disk[(Local Disk Storage)]

    Client -->|Form Submissions / JWT Session Auth| FN
    FN -->|Write Registrations & Submissions| DB
    FN -->|Relay Multipart Form Data (Ideathon)| BN
    BN -->|Upload + Optimize Screenshots| Disk
    BN -->|Send Confirmation Emails| SMTP
    BN -->|Serve Screenshots via Proxy| FN
```

## 1. Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Runtime & Deployment**: Node.js, Vercel Serverless environment
- **Frontend Layer**: React 19, Tailwind CSS 4 (with `@tailwindcss/postcss`), Framer Motion (for transitions), Lucide React, and React Icons.
- **Interactivity & Gamification**: React Typed (typewriter effect), Canvas Confetti, and Use Sound (UX sound effects).
- **Form Management**: React Hook Form with Zod Resolvers.
- **Database & ODM**: MongoDB & Mongoose.

## 2. Database Models (`src/models/`)
All database schemas are built on top of Mongoose with appropriate indexing for queries and dev HMR safeguard checks to prevent model recompilation.

- **Registration2026** (`Registration2026.ts`):
  - Collection: `registrations-2026`
  - Purpose: Captures full member applications.
  - Keys: `name`, `email` (unique, lowercase), `mobile`, `rollNumber`, `department`, `year`, `interests` (defaults to 'Cloud Computing'), `experience` (motivation), `expectations`, `referral`, `emailSent`, `emailSentAt`.
  
- **Recruitment** (`Recruitment.ts`):
  - Collection: `recruitment`
  - Purpose: Tracks coding recruitment assignments and challenge submissions.
  - Keys: `name`, `email` (restricted validator: must end with `sreenidhi.edu.in` or `shu.edu.in`), `mobile`, `passingOutYear`, `problemUnlocked`, `submittedSolution`, `prUrl`, `source`.

- **DigitalIndiaSubmission** (`DigitalIndiaSubmission.ts`) & **DigitalIndiaAccepted** (`DigitalIndiaAccepted.ts`):
  - Collections: `digital_india_ideathon_submissions`, `digital_india_ideathon_accepted`
  - Purpose: Captures details, payment UTR numbers, screenshot URLs, and validation states for the Digital India Ideathon entries.

## 3. Storage & Integration Layers
- **File Storage**: All user-uploaded files (payment screenshots) are handled by the backend (BN) using multer for receipt, Sharp for optimization/thumbnail generation, and `file-type` for magic-byte validation. Files are stored on local disk with date-partitioned directories and UUID filenames. The admin dashboard proxies file access through authenticated API endpoints. Old Cloudflare R2 URLs from before the migration are still supported with a fallback lookup.
- **Email Service** (`src/lib/mail.ts`): Integrated with the `nodemailer` library to establish traditional SMTP connections (using `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`), enabling high-quality HTML email templates to be dispatched dynamically during registration, onboarding, and shortlisting states.
- **Authentication**: JWT-based session security using the `jose` library. Authentication uses an HTTP-Only cookie (`c3_admin_session`) with a life cycle of 8 hours, strict same-site configuration, and SSL enforcement.

## 4. Input Validation & Security
- **Schema Validation**: Shared Zod schemas (`src/features/join/api/schema.ts`) are used in both client forms and Next.js route handlers to validate data structure and format.
- **Query Security**: Database queries sanitize inputs utilizing Mongoose query operators (e.g., using `$eq` on queries) to prevent NoSQL injection vectors.
