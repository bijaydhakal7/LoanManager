import type { Request, Response } from "express";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok } from "../../utils/response.js";
import { loanService } from "../../services/loan/loan.service.js";
import { dashboardService } from "../../services/dashboard/dashboard.service.js";

export const createLoan = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.createLoan({
    userId: req.user.userId,
    ...req.body,
  });

  created(res, result, "Loan created successfully");
});

export const listLoans = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.listLoans(req.user.userId, {
    type: req.query.type as "GIVEN" | "TAKEN" | undefined,
    status: req.query.status as "ACTIVE" | "CLOSED" | "OVERDUE" | undefined,
  });

  ok(res, result);
});

export const getLoanById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.getLoanById(req.user.userId, Number(req.params.id));
  ok(res, result);
});

export const updateLoan = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.updateLoan(req.user.userId, Number(req.params.id), req.body);
  ok(res, result, "Loan updated");
});

export const closeLoan = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.closeLoan(req.user.userId, Number(req.params.id));
  ok(res, result, "Loan closed");
});

export const createRepayment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.createRepayment(req.user.userId, Number(req.params.id), req.body);
  created(res, result, "Repayment recorded");
});

export const listRepayments = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await loanService.listRepayments(req.user.userId, Number(req.params.id));
  ok(res, result);
});

export const getLoansDashboard = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await dashboardService.getSummary(req.user.userId);
  ok(res, result);
});
