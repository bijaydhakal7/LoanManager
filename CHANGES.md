# Loan Manager — Rebuild Notes

## What changed

**Removed**
- Bill tracking feature (schema, backend, frontend) — entirely removed per your request.
- EMI amortization feature — replaced by the Interest Calculator.

**Added**
- **Interest Calculator** (`/interest`): simple interest `(P × R × T) / 100` and compound
  interest, with a live, animated result panel. Backed by a real endpoint
  (`POST /api/interest/calculate`) so the math happens server-side.
- **Session management**: Profile page now lists your active login sessions (device,
  IP, sign-in date) with the ability to revoke any session individually, on top of the
  existing "log out everywhere" button. New endpoints: `GET /api/auth/sessions`,
  `DELETE /api/auth/sessions/:sid`.
- **Richer dashboard**: total given/taken, net position, monthly expenses, interest
  receivable/payable, expense-by-category pie chart, upcoming payments, recent expenses —
  all animated in with framer-motion.
- **Toasts**: switched from `react-toastify` to `sonner` (the shadcn-standard toast),
  styled to match the app theme.
- Two new shadcn-style UI primitives: `Tabs` (used for Given/Taken and Simple/Compound
  toggles) and `Progress`.
- A shared `PageTransition` wrapper so every route fades/slides in consistently.

**Fixed**
- Your backend `controllers/`, `services/`, and `routes/` files were importing from
  nested paths (e.g. `services/loan/loan.service.js`) that didn't actually exist on disk
  — the app would not have compiled. All imports are now corrected to match your actual
  (flat) file layout.
- Refresh-token cookie expiry was hardcoded to 7 days regardless of your `.env` config;
  now it correctly reads `REFRESH_TOKEN_EXPIRES_IN`.

**Untouched (already solid)**
- Access/refresh token issuance, rotation on every refresh, reuse detection, and the
  `AuthSession` table — this was already implemented correctly and didn't need a rebuild.
- Loan model (given/taken, name, principal, rate, tenure) and expense tracker.

## Before you run it

```bash
# Server
cd Server
npm install
npx prisma generate
npx prisma migrate dev   # picks up the new migration that drops Bill + emiAmount
npm run dev

# Client
cd client
npm install
npm run dev
```

I validated everything with `tsc --noEmit` on both the server and client (zero errors)
and a Next.js production build (only failure was Google Fonts being unreachable in my
sandboxed environment — will work fine for you locally).

One thing worth double-checking on your end: I couldn't run `prisma generate` in this
sandbox (no network access to Prisma's binary host), so the generated client types
weren't regenerated here — running the setup commands above will take care of that.
