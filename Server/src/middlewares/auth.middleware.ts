import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";
import { authRepository } from "../repositories/auth/auth.repository.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);

    // Check tokenVersion against user record to support access token revocation
    if (typeof payload.tokenVersion === "number") {
      const user = await authRepository.findById(payload.userId);
      if (!user) throw new Error("User not found");
      if ((user as any).tokenVersion !== payload.tokenVersion) {
        throw new Error("Token revoked");
      }
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};
