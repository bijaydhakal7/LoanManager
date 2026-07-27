import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { created, ok } from "../utils/response.js";
import { AppError } from "../utils/appError.js";
import { env } from "../config/env.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.register(name, email, password);
  created(res, result, "User registered successfully");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password, req, res);
  // Include csrfToken in the body so the frontend can store it in localStorage.
  // document.cookie cannot read cross-origin cookies, so the cookie alone is insufficient.
  ok(res, { accessToken: result.accessToken, user: result.user, csrfToken: result.csrfToken }, "Login successful");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken, csrfToken } = await authService.refresh(req, res);
  // Return the new csrfToken in the body so the frontend can update its localStorage copy.
  ok(res, { accessToken, csrfToken }, "Token rotated");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req, res);
  ok(res, null, "Logged out");
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }
  await authService.logoutAll(req.user.userId, res);
  ok(res, null, "Logged out from all devices");
});

export const profile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const result = await authService.getProfile(req.user.userId);
  ok(res, result);
});

export const listSessions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const currentToken = req.cookies?.[env.refreshCookieName];
  const result = await authService.listSessions(req.user.userId, currentToken);
  ok(res, result);
});

export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await authService.revokeSession(req.user.userId, String(req.params.sid));
  ok(res, null, "Session revoked");
});
