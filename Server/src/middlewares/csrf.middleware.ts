import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";

export const csrfMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const header = (req.headers[env.csrfHeaderName] as string) || req.headers[env.csrfHeaderName.toLowerCase()] as string;
  const cookie = req.cookies?.[env.csrfCookieName];

  if (!cookie || !header || cookie !== header) {
    next(new AppError("CSRF token missing or invalid", 403));
    return;
  }

  next();
};
