import type { Request, Response } from "express";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok } from "../../utils/response.js";
import { expenseService } from "../../services/expense/expense.service.js";

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await expenseService.createExpense({
    userId: req.user.userId,
    ...req.body,
  });

  created(res, result, "Expense created");
});

export const listExpenses = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await expenseService.listExpenses({
    userId: req.user.userId,
    category: req.query.category as never,
    startDate: req.query.startDate as string | undefined,
    endDate: req.query.endDate as string | undefined,
  });

  ok(res, result);
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await expenseService.updateExpense(req.user.userId, Number(req.params.id), req.body);
  ok(res, result, "Expense updated");
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await expenseService.deleteExpense(req.user.userId, Number(req.params.id));
  ok(res, result, "Expense deleted");
});
