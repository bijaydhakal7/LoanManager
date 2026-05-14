import type { Request, Response } from "express";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ok } from "../../utils/response.js";
import { emiService } from "../../services/emi/emi.service.js";
import { loanService } from "../../services/loan/loan.service.js";

export const calculateEmiController = asyncHandler(async (req: Request, res: Response) => {
  const { principal, interestRate, tenureMonths } = req.body;
  const result = emiService.calculate(principal, interestRate, tenureMonths);
  ok(res, result);
});

export const myEmisController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.listEmis(req.user.userId);
  ok(res, result);
});

export const upcomingEmisController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.listUpcomingEmis(req.user.userId);
  ok(res, result);
});
