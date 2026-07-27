export const env = {
  // Use Next.js proxy to avoid third-party cookie blocks (Safari/Firefox) and CORS issues
  apiUrl: "/api/proxy",
  csrfCookieName: process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME as string ,
  csrfHeaderName: process.env.NEXT_PUBLIC_CSRF_HEADER_NAME as string,
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "NPR",
};
