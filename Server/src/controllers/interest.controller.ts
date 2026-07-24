import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { interestService } from "../services/interest.service.js";

export const calculateInterestController = asyncHandler(async (req: Request, res: Response) => {
  const { principal, ratePercent, time, timeUnit, mode, compoundingFrequency } = req.body;
  const result = interestService.calculate({
    principal,
    ratePercent,
    time,
    timeUnit,
    mode,
    compoundingFrequency,
  });
  ok(res, result);
});
