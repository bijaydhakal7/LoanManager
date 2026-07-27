import { env } from "@/lib/config";

const CSRF_STORAGE_KEY = `${env.csrfCookieName}_local`;

/** Store the CSRF token returned in the response body into localStorage. */
export const saveCsrfToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CSRF_STORAGE_KEY, token);
};

/** Clear the locally-stored CSRF token (on logout). */
export const clearCsrfToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CSRF_STORAGE_KEY);
};

/**
 * Read the CSRF token from localStorage.
 * In cross-origin production deployments (frontend on a different domain than the backend),
 * document.cookie cannot read cookies set by the backend domain. Instead, we store
 * the CSRF token returned in login/refresh response bodies into localStorage.
 */
export const getCsrfToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CSRF_STORAGE_KEY);
};
