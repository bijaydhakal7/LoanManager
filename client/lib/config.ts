export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ,
  csrfCookieName: process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME ,
  csrfHeaderName: process.env.NEXT_PUBLIC_CSRF_HEADER_NAME ,
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "NPR",
};
