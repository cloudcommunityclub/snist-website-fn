# Decisions Log - Cloud Community Club (C³)

This document records the architectural and technology decisions made during the development of the C³ platform.

## 1. Unified Next.js API Routes over Standalone Express Server
- **Context**: The standalone backend (`c3_backend`) was written in Express.js. Maintaining a separate repository added deployment overhead (Render web service configuration) and required dealing with Cross-Origin Resource Sharing (CORS).
- **Decision**: Ported the backend controllers to Next.js API Routes (`src/app/api/`).
- **Rationale**:
  - Unified deployment: Frontend and backend APIs deploy together as a single Next.js project on Vercel.
  - Type sharing: Share TypeScript models and Zod validation schemas (`src/features/join/api/schema.ts`) between the client form and the API route.
  - Zero-config deployment without CORS issues.

## 2. JWT Cookie Session Authorization for Admin Dashboard
- **Context**: The Express backend checked `x-api-key` headers for admin requests, which is inconvenient for a standard web dashboard login flow.
- **Decision**: Implemented JWT authentication using the `jose` library, storing the session token in an HTTP-Only cookie (`c3_admin_session`).
- **Rationale**:
  - Enhanced security: HTTP-Only prevents client-side JavaScript access, shielding the session from Cross-Site Scripting (XSS).
  - Web dashboard compatibility: Browsers automatically include cookies with API calls, simplifying dashboard state tracking.

## 3. Mongoose Upserts for Registration Flow
- **Context**: Under a strict duplicate-check constraint, if a student's registration was saved but their confirmation email failed, they couldn't retry without throwing a validation error.
- **Decision**: Switched from `.save()` to `findOneAndUpdate` with `{ upsert: true }` using the candidate's email as the selector.
- **Rationale**:
  - Resiliency: Allows students to re-submit their form if a transient error occurs or if they need to correct their details, without manual database cleanup.

## 4. Client-side Only / Dynamic Import of Framer Motion and Typing Components
- **Context**: Complex animation modules (Framer Motion, React Three, React Typed) increase the bundle footprint and can cause server-side rendering (SSR) hydration mismatches.
- **Decision**: Configured homepage subsections and terminal forms to load client-side only using Next.js `next/dynamic` imports with `ssr: false`.
- **Rationale**:
  - Improved Page Speed: Reduces the initial server payload size.
  - Hydration safety: Prevents server-vs-client markup mismatches during rendering.

## 5. Explicit Query Operators for NoSQL Injection Prevention
- **Context**: MongoDB query selectors can sometimes be spoofed if user-supplied parameters are passed directly as objects.
- **Decision**: Enforced explicit use of `{ email: { $eq: email } }` operators in lookup queries.
- **Rationale**:
  - Enforces string comparisons, preventing malicious JSON query payloads (e.g., `{ "$gt": "" }`) from bypassing logic checks.

## 6. Responsive Adaptive UI layout Refactoring with GSAP Cleanup
- **Context**: The GSAP horizontal accordion layout is designed for desktop. On tablet and mobile viewports, the side accordion cards remained active and squeezed the active card to a narrow strip, causing massive text wrapping and horizontal overflows.
- **Decision**: Added viewport width detection state and disabled the GSAP horizontal accordion layout on viewport widths < 1024px, clearing GSAP inline styles using `gsap.set(..., { clearProps: "all" })` to let fluid CSS/Tailwind layout handle the mobile/tablet single-column structure and top stepper.
- **Rationale**:
  - Eliminates overlap: Resetting GSAP's inline styles allows media-query classes to function correctly without specificity conflicts.
  - Premium UX: Single column and top horizontal stepper provide a native feel on touch devices.

## 7. Migrating from Gmail API OAuth2 to Traditional SMTP
- **Context**: The existing email utility (`gmail.ts`) connected to Gmail via OAuth2 client IDs, secrets, and refresh tokens. This setup required maintaining GCP credentials, dealing with tokens expiring, and made local development or hosting configuration cumbersome.
- **Decision**: Replaced the Gmail API OAuth2 connector with standard SMTP mailing powered by `nodemailer` (`mail.ts`).
- **Rationale**:
  - Simplicity: Works with standard environment configurations (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) without OAuth2 handshake overhead.
  - Flexibility: Allows swapping email providers (Gmail SMTP, SendGrid, Resend, Amazon SES, etc.) without code modifications.
  - Robustness: Traditional SMTP libraries handle connections, TLS encryption/negotiation, and queue retries reliably inside Next.js serverless functions.

## 8. Multi-Recipient Shortlist Notification Email Dispatch on Acceptance
- **Context**: Previously, when an administrator accepted a team submission from the admin console, only the team leader (the submitter) received the shortlisted email notification, leaving other team members unaware.
- **Decision**: Refactored the accept API route to parse the team size and `teamMembers` collection, sending the shortlisted HTML email to both the team leader and each individual team member.
- **Rationale**:
  - Improved Team Onboarding: Ensures that all participants receive immediate steps (like joining the WhatsApp group and registering for the build phase) without relying on the team leader to forward information.
  - Resilience: Wrapped each individual mail dispatch in a separate try-catch block to guarantee that failure to send to one participant does not halt notifications for the rest of the team.
  - Code Dryness: Extracted the heavy, custom HTML template into a modular helper function (`getAcceptanceEmailHtml`) rather than duplicating it.


