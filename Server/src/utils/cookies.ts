import type { Response } from "express";
import { env } from "../config/env.js";

const isSecure = env.cookieSecure;

export const refreshTokenMaxAgeMs = (): number => {
  // parse simple duration like '7d' or '15m'
  if (env.refreshTokenExpiresIn.endsWith("d")) {
    const days = Number(env.refreshTokenExpiresIn.slice(0, -1));
    return days * 24 * 60 * 60 * 1000;
  }
  if (env.refreshTokenExpiresIn.endsWith("m")) {
    const mins = Number(env.refreshTokenExpiresIn.slice(0, -1));
    return mins * 60 * 1000;
  }
  return 7 * 24 * 60 * 60 * 1000;
};

export const setRefreshCookie = (res: Response, token: string) => {
  const maxAge = refreshTokenMaxAgeMs();

  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
    path: "/api/auth",
    maxAge,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie(env.refreshCookieName, { path: "/api/auth" });
};

export const setCsrfCookie = (res: Response, csrfToken: string) => {
  // Non-HttpOnly cookie so frontend can read and send as header for double-submit CSRF
  res.cookie(env.csrfCookieName, csrfToken, {
    httpOnly: false,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

export const clearCsrfCookie = (res: Response) => {
  res.clearCookie(env.csrfCookieName, { path: "/" });
};
