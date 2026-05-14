import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/appError.js";
import { env } from "../config/env.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      success: false,
      error: "Database request failed",
      details: err.message,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      error: "Invalid database input",
      details: err.message,
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Unexpected server error";

  res.status(500).json({
    success: false,
    error: message,
    ...(env.nodeEnv !== "production" && { stack: err instanceof Error ? err.stack : undefined }),
  });
};
