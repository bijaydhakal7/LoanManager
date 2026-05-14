import type { Request, Response } from "express";
import { AppError } from "../../utils/appError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { created, ok } from "../../utils/response.js";
import { billService } from "../../services/bill/bill.service.js";

export const createBill = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await billService.createBill({
    userId: req.user.userId,
    ...req.body,
  });

  created(res, result, "Bill created");
});

export const listBills = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await billService.listBills(req.user.userId);
  ok(res, result);
});

export const payBill = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await billService.payBill(req.user.userId, Number(req.params.id));
  ok(res, result, "Bill marked as paid");
});

export const deleteBill = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await billService.deleteBill(req.user.userId, Number(req.params.id));
  ok(res, result, "Bill deleted");
});

export const updateBill = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  } 
  const result = await billService.updateBill(req.user.userId, Number(req.params.id), req.body);
  ok(res, result, "Bill updated");
});
  
