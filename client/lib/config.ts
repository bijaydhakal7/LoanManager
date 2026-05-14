export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  csrfCookieName: process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME ?? "csrfToken",
  csrfHeaderName: process.env.NEXT_PUBLIC_CSRF_HEADER_NAME ?? "x-csrf-token",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "NPR",
};
