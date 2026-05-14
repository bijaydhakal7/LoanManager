import { Router } from "express";
import { getDashboardSummary } from "../../controllers/dashboard/dashboard.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get("/", authMiddleware, getDashboardSummary);

export default dashboardRouter;
