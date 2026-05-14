import { env } from "@/lib/config";

export const getCsrfToken = () => {
  if (typeof document === "undefined") return null;
  const name = `${env.csrfCookieName}=`;
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(name))
    ?.slice(name.length);

  return value ? decodeURIComponent(value) : null;
};
