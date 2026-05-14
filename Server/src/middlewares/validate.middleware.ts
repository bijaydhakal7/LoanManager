import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../utils/appError.js";

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body ?? {},
      query: req.query ?? {},
      params: req.params ?? {},
    });

    if (!result.success) {
      next(new AppError("Validation failed", 422, result.error.flatten()));
      return;
    }

    const parsed = result.data as {
      body: Request["body"];
      query: Request["query"];
      params: Request["params"];
    };

    req.body = parsed.body;
    Object.assign(req.query as Record<string, unknown>, parsed.query as Record<string, unknown>);
    Object.assign(req.params as Record<string, string>, parsed.params as Record<string, string>);
    next();
  };
};
