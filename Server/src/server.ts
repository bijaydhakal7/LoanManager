import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import { env } from "./config/env.js";
import prisma from "./lib/prisma.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
import cron from "node-cron";
import { authService } from "./services/auth.service.js";

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: env.corsOrigin === "*" ? true : env.corsOrigin,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF protection for stateful endpoints that rely on cookies (refresh, logout)
const csrfProtection = csurf({ cookie: true });

app.use(
    "/api",
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    }),
);

app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
});

app.use("/api", apiRouter);
app.get("/api/auth/csrf-token", (req, res) => {
    // provide CSRF token to client for including in state-changing requests
    try {
        const token = (req as any).csrfToken ? (req as any).csrfToken() : null;
        res.json({ success: true, csrfToken: token });
    } catch {
        res.json({ success: true, csrfToken: null });
    }
});
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
});

const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
        process.exit(0);
    });
};

process.on("SIGINT", () => {
    void shutdown();
});

process.on("SIGTERM", () => {
    void shutdown();
});

cron.schedule("0 3 * * *", () => {   // every day at 3am
  authService.pruneStaleSessions().then((count) =>
    console.log(`[cron] Pruned ${count} stale session(s).`)
  );
});