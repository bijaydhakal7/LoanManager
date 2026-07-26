I have used node-cron in my server to prune stale sessions. Render or Railway will not start server if the app is not listening to any port. Sleep time will affect this now. so we should use this instead
-----------------------------------------------------------------------------------------------------------------------------------
Option B — An external free scheduler that hits an HTTP endpoint (this is the one I'd actually recommend for you)

You'd expose a protected route instead of a script:


// e.g. Server/src/routes/internal.routes.ts
router.post("/internal/prune-sessions", async (req, res) => {
  if (req.headers["x-internal-secret"] !== process.env.INTERNAL_SECRET) {
    return res.status(401).end();
  }
  const count = await authService.pruneStaleSessions();
  res.json({ deleted: count });
});

Then something outside your app calls that URL on a schedule, for free:

cron-job.org — free, no-signup web service that just pings a URL on whatever schedule you set. Simplest option.
GitHub Actions scheduled workflow — completely free on GitHub, a .yml file with a schedule: cron: trigger that runs curl -X POST https://your-app.onrender.com/internal/prune-sessions -H "x-internal-secret: ...".

Bonus side-effect worth knowing: this same ping also solves the other free-tier problem people run into on Render/Railway — the 15-minute sleep. If your scheduled ping fires every so often, it doubles as a keep-alive, which is why you'll see people using this exact pattern for both purposes at once.

-----------------------------------------------------------------------------------------------------------------------------------

*** Tier 3 — Observability (currently: none)

Right now, errors just go to console.log/console.error, which disappears once you're not tailing logs live. Before real users touch this:

Error tracking: Sentry has a free tier, catches unhandled exceptions on both frontend and backend, tells you when something breaks in production instead of finding out from a user complaint.
Uptime monitoring: something like UptimeRobot (free) pinging /health — you already have that endpoint, just nothing watching it yet.
Tier 4 — Testing (currently: none)

Not blocking for a small launch, but worth being honest about: there are zero automated tests in this codebase. Given how much subtle logic we've walked through in this conversation alone (reuse detection, rotation, CSRF, tokenVersion interactions), these are exactly the kind of flows that are easy to accidentally break with a future change and hard to notice you broke, since they only misbehave under specific attack-like conditions rather than everyday use. At minimum, a handful of integration tests around the auth flows (login → refresh → rotation → reuse-detection → logout-all) would catch regressions here specifically.

Tier 5 — CI/CD (optional but nice)

A GitHub Actions workflow that runs tsc --noEmit (and tests, once you have them) on every push/PR — cheap insurance, and you're already going to have a GitHub Actions file anyway for the cron job we discussed. ***