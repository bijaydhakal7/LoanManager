import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? process.env.JWT_SECRET ?? "dev_refresh_secret_change_this",
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "1d",
  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "refreshToken",
  cookieSecure: (process.env.COOKIE_SECURE ?? "false") === "true",
  corsOrigin: process.env.CORS_ORIGIN ,
  csrfCookieName: process.env.CSRF_COOKIE_NAME ?? "csrfToken",
  csrfHeaderName: process.env.CSRF_HEADER_NAME ?? "x-csrf-token",
};
