# Features Log - Cloud Community Club (C³)

This log tracks all active user-facing and backend features implemented in the C³ application repository.

## 1. Landing & Marketing Experience (`/`)
- **Dynamic Hero Banner**: Heartbeat logo animation, typewriter keyword cycling using `react-typed`, smooth-scrolling call to action (CTA), and composite overlay backdrop.
- **Interactive About Cards**: Floating perspective cards with sound effects (`use-sound`) playing on hover.
- **Activity Timeline**: Interactive, step-by-step description of community domains (development, open source, research, networking).
- **Infinite Logo Marquee**: Infinite marquee carousel displaying cloud technologies using Framer Motion loop logic.
- **Recruitment Widget**: Live Discord Server Widget integration.

## 2. Interactive Developer Join Form (`/join`)
- **Terminal Simulator Component**: Full-screen developer terminal styled interface (`TerminalJoinForm.tsx`) mapping progress segment paths (`~/identity`, `~/contact`, `~/academics`, `~/motivation`).
- **Interactive Blinking Cursor**: Custom coordinate-calculated blinking cursor that tracks real-time focus and line offsets in textareas and input boxes.
- **Realistic CLI Deployment Output**: A Git mock execution animation showing sequence commands (`git add`, `git commit`, `git push`) while running the API server request in parallel.
- **Zod Client Validation**: On-the-fly syntax validation with compiler-style error traces printed directly beneath form fields.

## 3. Onboarding & Event Email Automations
- **Traditional SMTP Mailer Service**: Migrated the email engine from legacy Gmail OAuth2 APIs to standard SMTP via `nodemailer`. Highly configurable across environments using standard host, port, user, and password variables.
- **Dynamic Membership Pass**: Sends rich HTML email template immediately upon membership registration. Includes a personalized CSS membership badge containing the applicant's name, roll number, and department.
- **Email Delivery Verification**: Tracks email delivery status in the database (`emailSent`, `emailSentAt`).
- **Digital India Ideathon Communication Pipeline**:
  - **Submission Confirmation Template**: Sends a beautiful dark/indigo themed email directly to applicants confirming receipt of their idea details, college info, and payment UTR reference ID.
  - **Shortlisted Notification Template**: Celebratory selection template with prominent WhatsApp group integration and secondary final hackathon registration call-to-actions.

## 4. Secure Admin Console Portal (`/admin`)
- **Cookie Session Authorization**: Password-protected login flow (`/admin/login`) verifying credentials on the server and generating HTTP-only JWT cookies.
- **Dynamic Metrics Charts**: Overview of registrations, department ratios, and year-wise breakdown on the dashboard.
- **CSV Data Exporter**: Administrative routes to export membership logs, ideathon registrations, and coding challenges as clean `.csv` tables.
- **Search & Filter Control**: Interactive administrative filters to query registrations by department, email, or submission status.

## 5. GSAP-Animated Digital India Registration (`/events/digitalindia`)
- **Luxury Light-Silver Card Layout**: Apple-style horizontal slider form cards (`DigitalIndiaGSAPForm.tsx`) with vertical completed tabs showing checked profiles.
- **GSAP Width Animations**: Ref-based GSAP tweens mapping page widths and content fades when progressing/reverting form cards.
- **Ideathon Submission Pipeline**: Links details, domains, and payment screenshots with `/api/digital-india/submit` backend endpoint.
- **Responsive Adaptive Interface**: Automatically shifts to a single-column layout on viewport widths < 1024px, hiding side vertical tabs and rendering a clean top progress stepper.
- **Hackathon Info Header & Selection Metrics**: Integrated a sleek intro header with selection process details (highlighting that the top 100 problem statements will be shortlisted).
- **Comprehensive Error UI & Dynamic Input Clearing**: Added in-card text validation errors below profile/college input fields with auto-clearing onChange hooks when the user types.
- **Flexible Alphanumeric UTR Validation**: Implemented a flexible 10-35 character alphanumeric regex (`^[A-Za-z0-9]{10,35}$`) to support all major UPI payment providers and custom bank reference ID formats.
