export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL  ,
  csrfCookieName: process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME as string ,
  csrfHeaderName: process.env.NEXT_PUBLIC_CSRF_HEADER_NAME as string,
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "NPR",
};
