# NovaLoom Digital — Full Website Starter

A responsive digital agency website built with Next.js 14, React, PostgreSQL and Prisma. It includes a premium homepage, all 10 service categories, concept demo showcase, project request wizard, WhatsApp CTAs, client registration/login, client portal with invoices, support tickets and notifications, admin finance/support/project/analytics/consultation modules, SSLCommerz payment initiation and server-side validation, public journal, policy pages, and protected APIs.

> **Important:** Demo gallery entries are explicitly concept demonstrations, not claims of completed client work. Public pricing is intentionally omitted. Quotes are private and custom-prepared.

## Requirements

- Node.js 20 LTS
- npm
- PostgreSQL database (Neon works)

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL`: PostgreSQL connection string (Neon direct connection is recommended for Prisma migrations)
- `AUTH_SECRET`: a long random secret
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp business number with country code, digits only
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: initial admin account for seeding

Example secret generation:

```bash
openssl rand -base64 32
```

## 3. Set up the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

The seed creates the 10 service categories and initial concept demo entries. If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are configured, it also creates the first administrator.

## 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Main routes

- `/` — homepage
- `/services` — all services
- `/services/[slug]` — service details
- `/work` — filterable concept showcase
- `/work/[slug]` — concept demo detail
- `/request` — multi-step project request form
- `/contact` — consultation request form
- `/register`, `/login` — authentication
- `/dashboard` — client portal starting point
- `/admin` — protected admin request inbox and module shortcuts
- `/admin/quotations` — create and send private custom quotations
- `/admin/blog` — publish journal articles
- `/admin/team` — manage client/staff roles
- `/admin/finance` — private invoice creation and payment review
- `/admin/projects` — project status overview
- `/admin/support` — support ticket management
- `/admin/consultations` — consultation request management
- `/admin/analytics` — operational analytics
- `/blog` and `/blog/[slug]` — published journal articles
- `/privacy`, `/terms` — policy template pages

## Included API routes

- `POST /api/requests` — save project requests
- `POST /api/consultations` — save consultation requests
- `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST /api/admin/services` — admin-only service management endpoints
- `GET/POST /api/admin/demos` — admin-only demo management endpoints
- `GET/PATCH /api/admin/requests` — admin-only project request inbox and status updates
- `GET/POST /api/admin/invoices`, `GET /api/client/invoices` — invoice workflow
- `POST /api/payments/initiate`, `POST /api/payments/sslcommerz/callback` — SSLCommerz checkout and server-side transaction validation
- `GET/POST/PATCH /api/support/tickets` — client tickets and admin status updates
- `GET/POST /api/messages` — project-scoped messages with internal-note access control
- `GET/PATCH /api/notifications` — client notifications
- `GET/POST/PATCH /api/admin/projects` and `/api/admin/tasks` — project/task foundations
- `GET/PATCH /api/admin/consultations` — consultation management
- `GET /api/blog`, `GET /api/blog/[slug]`, `GET/POST/PATCH/DELETE /api/admin/blog` — public journal and admin publishing API
- `GET /api/admin/analytics` — admin-only business counts
- `GET /api/admin/activity` — admin-only recent audit trail
- `GET/PATCH /api/admin/users` — admin user and role management

## Deployment (Vercel + Neon)

1. Push this project to GitHub.
2. Create a PostgreSQL database in Neon and copy its connection string.
3. Import the GitHub repository into Vercel.
4. Add all `.env.example` variables in Vercel Project Settings → Environment Variables.
5. Run `npx prisma db push` locally against the production `DATABASE_URL` (or add a controlled migration workflow).
6. Deploy from Vercel.
7. Set `NEXT_PUBLIC_SITE_URL` to the deployed URL and confirm the WhatsApp number.

For a production deployment, use a separate migration workflow (`prisma migrate dev` locally, then `prisma migrate deploy` in CI) rather than relying on `db push` for ongoing schema changes.

## Important implementation boundaries

This v1.1 ZIP adds working database/API foundations and interface screens for quotations, invoices, payment initiation, support, notifications, project chat, milestones/tasks, blog publishing, role assignment and analytics. A few larger production capabilities still need external services or further UI work:

- Persistent client file uploads are not enabled yet. Configure private S3/R2-compatible storage and signed upload/download URLs before allowing customer files; Vercel local disk is not persistent.
- The UI is primarily English. A complete Bangla/English localization pass across all public pages, forms, emails and dashboards remains to be done.
- Staff role values and account assignment are available, but fine-grained per-module permissions and project-assignment enforcement need a security pass.
- Email is sent only when a valid Resend API key and verified sender are configured. Otherwise requests still save normally and email delivery is skipped.
- SSLCommerz checkout requires merchant credentials and sandbox testing. The callback validates transaction ID, amount and currency with the provider before marking a payment paid. Test success, failure, cancel, IPN, partial payments and duplicate callbacks before live mode.
- Project messaging API and client chat are included; richer staff inboxes, attachment sharing and real-time WebSocket delivery are not enabled.
- Service/demo CRUD APIs exist, but a full visual admin editor for every field still needs completing.
- The privacy and terms pages are starter templates and must be customized and reviewed for your company.

## Before accepting real customers

This is a substantial project foundation, not a substitute for a final production security review. Before launch:

- Replace the placeholder WhatsApp number and email address.
- Add rate limiting and bot protection to public forms and authentication endpoints.
- Add email delivery for request confirmations and admin notifications.
- Add secure private object storage (S3/R2 or equivalent) for client file uploads; do not use local disk on Vercel for persistent files.
- Add a complete project chat interface and richer milestone/task editing screens. The project-scoped messaging API is included as a foundation.
- Admin blog editor and public journal pages are included.
- Optional email confirmations use Resend when `RESEND_API_KEY` and a verified `EMAIL_FROM` are configured.
- Add admin CRUD screens for service and demo management (protected APIs are included).
- Extend staff permissions beyond the current admin-only management screens.
- Add rate limiting, CAPTCHA/bot protection, and CSRF/origin checks where applicable.
- Test SSLCommerz sandbox callbacks, IPN behavior, refunds and partial payments with merchant credentials before enabling live mode.
- Add automated tests, production build verification, monitoring and scheduled database backups.
- Add privacy policy, terms, cookie notice and data retention controls.
- Replace concept demo images/content with your own work or licensed assets before representing them as portfolio projects.

## Added business modules

- Private invoices are created against a project request in `/admin/finance`.
- Clients can see invoices, submit support tickets, read notifications and start SSLCommerz checkout from `/dashboard`.
- SSLCommerz callbacks are verified against the provider validation endpoint before marking a payment as paid. Configure real merchant credentials before testing.
- Accepting a quotation for a signed-in client creates a project workspace.
- Support tickets, project-scoped messages, notifications, tasks, activity logs, blog posts and testimonials have database models.
- Public journal and privacy/terms template pages are included. Replace template legal copy with reviewed company policies.

## Images

The starter uses remote Unsplash image URLs for visual placeholders. Internet access is required for those images to load. Replace them with your own optimized images before production. The Next.js image configuration already allows `images.unsplash.com`.
