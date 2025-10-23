Short, targeted instructions for AI coding assistants working on this repo.

Overview
- Monorepo-like layout with two main folders: `Backend/` (NestJS + TypeScript + Prisma) and `frontend/` (React + Vite + TypeScript).
- Backend is a NestJS server using Prisma (`prisma/schema.prisma`) and many modules under `src/Modules/` (users, products, orders, admin, etc.). Frontend is a Vite React SPA under `frontend/src`.

Quick commands
- Backend (powerShell):
  - Install: cd Backend; npm install
  - Dev: npm run start:dev (uses `nest start --watch`)
  - Build: npm run build
  - Tests: npm run test (unit), npm run test:e2e (e2e)
- Frontend (powerShell):
  - Install: cd frontend; npm install
  - Dev server: npm run dev (Vite)
  - Build: npm run build

What to know about the Backend
- Structure: `src/Modules/*` contains feature modules. `src/Prisma/` contains a Prisma service wrapper used across the app. `src/common` holds decorators, utils and webhook helpers.
- Auth & Guards: Guards like `AdminAuth.guard.ts`, `purchasing-user-auth.guard.ts` and `roles.guard.ts` enforce route protections; many admin endpoints assume cookie-based auth and an `AdminAuthGuard` (see README admin API docs in Backend/README.md).
- Prisma: Prisma client files are generated in `generated/prisma/`. Changes to `prisma/schema.prisma` require `npx prisma generate` and possibly running migrations in `Backend/prisma/migrations`.
- Patterns: Controllers delegate to Services. DTOs and class-validator are used; follow existing DTO patterns when adding endpoints.

What to know about the Frontend
- Structure: `frontend/src/` holds React components, pages and a context folder with `AuthContext.tsx`/`PurchasingUserAuthContext.tsx` patterns. Keep hooks and context patterns consistent.
- API calls: `frontend/src/api/api.ts` centralizes axios configuration; use the existing api instance for network requests so interceptors/cookies stay consistent.
- Styling: TailwindCSS is used (see `tailwind.config.ts`) - use utility classes rather than custom CSS where possible.

Integration points and external deps
- Payments: Backend uses Stripe and PayPal SDKs. Checkout and webhook handlers live in `src/Modules/payment-management`.
- File uploads: Multer + serve-static used for uploads saved under `public/uploads/` and served from `public/`.
- Realtime: Socket.IO on backend and `socket.io-client` on frontend for real-time features.

Developer conventions & tips
- Keep TypeScript types strict and reuse types from `frontend/src/types` and backend DTOs when possible.
- When editing Prisma models: update `prisma/schema.prisma`, run migrations (or `prisma migrate dev`) and `npx prisma generate`. Generated client lives under `Backend/generated/prisma` in this repo.
- Tests: backend uses Jest with `ts-jest`. E2E tests use `test/jest-e2e.json`.
- Environment: The repo uses `.env` patterns (not tracked here). Expect secrets for Stripe, PayPal, Google APIs, and SMTP.

Examples (copyable patterns)
- Use existing service pattern for new endpoints:
  - Controller method should call a service in `src/Modules/<feature>/<feature>.service.ts` and return DTOs.
- Update profile flow (frontend example): see `frontend/src/components/user-dashboard/PurchasingProfileSettings.tsx` which calls a context `updateProfile` and shows SweetAlert2 success/failure.

What NOT to change without review
- `generated/prisma/*` files are generated; do not edit them manually.
- `prisma/migrations/*` snapshots: only change via `prisma migrate` commands.

If you need clarification
- Ask for the preferred environment variables or seed data before running migrations or integration tests.

Please confirm any major API or schema changes with a human reviewer and add/update tests for backend changes.
