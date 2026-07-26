import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { authRepository } from "../repositories/auth/auth.repository.js";
import { AppError } from "../utils/appError.js";
import { env } from "../config/env.js";
import type { Request, Response } from "express";
import { generateSid, hashToken, signRefreshToken, verifyRefreshToken, signAccessToken } from "../utils/tokens.js";
import { sessionRepository } from "../repositories/auth/session.repository.js";
import { setRefreshCookie, clearRefreshCookie, setCsrfCookie, clearCsrfCookie, refreshTokenMaxAgeMs } from "../utils/cookies.js";
import crypto from "crypto";

const toUserResponse = (user: { id: number; name: string; email: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const authService = {
  async register(name: string, email: string, password: string) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser({
      name,
      email,
      password: passwordHash,
    });

    // Do not issue tokens on register. Client should call /login to receive tokens.
    return { user: toUserResponse(user) };
  
  },

  async login(email: string, password: string, req?: Request, res?: Response) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    // Issue access token (include tokenVersion for revocation checks)
    const accessToken = signAccessToken(user.id, user.email, (user as any).tokenVersion ?? 0);

    // If response is provided, create refresh session and set cookie (moved from controller)
    if (req && res) {
      const sid = generateSid();
      const familyId = uuidv4();
      const refreshRaw = signRefreshToken(user.id, sid);
      const tokenHash = hashToken(refreshRaw);
      const expiresAt = new Date(Date.now() + refreshTokenMaxAgeMs());

      // Suspicious login detection: compare with existing active sessions
      try {
        const active = await sessionRepository.findActiveByUser(user.id);
        const ua = req.headers["user-agent"] as string | undefined;
        const ip = req.ip;
        const seen = active.some((s: any) => s.userAgent === ua && s.ipAddress === ip);
        if (!seen && active.length > 0) {
          // New device or IP not seen before
          console.warn(`Suspicious login for user ${user.id}: new device/IP detected`);
          // TODO: hook into notification system (email/SMS) for user alerting
        }
      } catch (err) {
        console.warn("Failed to check active sessions for suspicious login", err);
      }

      await sessionRepository.createSession({
        userId: user.id,
        sid,
        familyId,
        tokenHash,
        userAgent: req.headers["user-agent"] as string | undefined,
        ipAddress: req.ip,
        expiresAt,
      });

      setRefreshCookie(res, refreshRaw);
      // set CSRF token for double-submit protection
      const csrf = cryptoRandom();
      setCsrfCookie(res, csrf);
    }

    return {
      accessToken,
      user: toUserResponse(user),
    };
  },

  async getProfile(userId: number) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies?.[env.refreshCookieName];
    if (!token) {
      throw new AppError("No refresh token", 401);
    }

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      clearRefreshCookie(res);
      throw new AppError("Invalid refresh token", 401);
    }

    const tokenHash = hashToken(token);
    const session = await sessionRepository.findByTokenHash(tokenHash);

    if (!session || session.status !== "ACTIVE") {
      if (payload && payload.userId) {
        await sessionRepository.revokeAllByUser(payload.userId);
      }
      clearRefreshCookie(res);
      throw new AppError("Refresh token reuse detected or invalid", 401);
    }

    // Rotate: create new refresh token/session and revoke old
    const newSid = generateSid();
    const newRefreshRaw = signRefreshToken(payload.userId, newSid);
    const newHash = hashToken(newRefreshRaw);
    const newExpiresAt = new Date(Date.now() + refreshTokenMaxAgeMs());

    await sessionRepository.markReplaced(session.tokenHash, newHash);
    await sessionRepository.createSession({
      userId: payload.userId,
      sid: newSid,
      familyId: session.familyId,
      tokenHash: newHash,
      userAgent: req.headers["user-agent"] as string | undefined,
      ipAddress: req.ip,
      expiresAt: newExpiresAt,
    });

    // issue new access token (respect user's tokenVersion)
    const user = await authRepository.findById(payload.userId);
    if (!user) throw new AppError("User not found", 401); 
    const tokenVersion = (user as any)?.tokenVersion ?? 0;
    const accessToken = signAccessToken(payload.userId, user?.email ?? "", tokenVersion);

    setRefreshCookie(res, newRefreshRaw);
    const csrf = cryptoRandom();
    setCsrfCookie(res, csrf);
    return accessToken;
  },

  async logout(req: Request, res: Response) {
    const token = req.cookies?.[env.refreshCookieName];
    if (token) {
      const tokenHash = hashToken(token);
      await sessionRepository.revokeByTokenHash(tokenHash);
    }
    clearRefreshCookie(res);
    clearCsrfCookie(res);
  },

  async logoutAll(userId: number, res: Response) {
    // revoke DB sessions and increment tokenVersion to invalidate existing access tokens
    await sessionRepository.revokeAllByUser(userId);
    await authRepository.incrementTokenVersion(userId);
    clearRefreshCookie(res);
    clearCsrfCookie(res);
  },

  async listSessions(userId: number, currentRawToken?: string) {
    const currentHash = currentRawToken ? hashToken(currentRawToken) : null;
    const sessions = await sessionRepository.findActiveByUser(userId);
    return sessions.map((session) => ({
      sid: session.sid,
      userAgent: session.userAgent ?? "Unknown device",
      ipAddress: session.ipAddress ?? "Unknown",
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: currentHash !== null && session.tokenHash === currentHash,
    }));
  },
  async pruneStaleSessions() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await sessionRepository.pruneStaleSessions(thirtyDaysAgo);
    return result.count; // number of rows deleted
  },

  async revokeSession(userId: number, sid: string) {
    const session = await sessionRepository.findBySid(userId, sid);
    if (!session) {
      throw new AppError("Session not found", 404);
    }
    await sessionRepository.revokeBySid(userId, sid);
  },
};

function cryptoRandom() {
  return crypto.randomBytes(32).toString("hex");
}
