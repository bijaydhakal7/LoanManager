import jwt, { type Secret } from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  userId: number;
  email: string;
  tokenVersion?: number;
}

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const signAccessToken = (userId: number, email: string, tokenVersion?: number) => {
  const secret = env.jwtSecret as Secret;
  const payload: any = { userId, email };
  if (typeof tokenVersion === "number") payload.tokenVersion = tokenVersion;
  return jwt.sign(payload, secret, {
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const secret = env.jwtSecret as Secret;
  return jwt.verify(token, secret) as unknown as AccessTokenPayload;
};

export const signRefreshToken = (userId: number, sid: string) => {
  const secret = env.refreshTokenSecret as Secret;
  return jwt.sign({ userId, sid }, secret, {
    expiresIn: env.refreshTokenExpiresIn,
    algorithm: "HS256",
  } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string) => {
  const secret = env.refreshTokenSecret as Secret;
  return jwt.verify(token, secret) as { userId: number; sid: string };
};

export const generateSid = () => uuidv4();
