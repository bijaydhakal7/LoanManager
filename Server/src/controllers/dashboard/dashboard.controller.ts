import type { Request, Response } from "express";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/response.js";
import { dashboardService } from "../../services/dashboard/dashboard.service.js";

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const summary = await dashboardService.getSummary(req.user.userId);
  ok(res, summary);
});
