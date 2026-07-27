import { baseClient } from "@/lib/api/client";
import { saveCsrfToken } from "@/lib/auth/csrf";
import { useAuthStore } from "@/lib/auth/auth-store";
import type { ApiResponse } from "@/lib/types";

export const refreshSession = async (): Promise<string | null> => {
  // No CSRF header needed on /auth/refresh — the endpoint is protected by the
  // httpOnly refresh cookie + token rotation, making CSRF attacks impossible.
  try {
    const { data } = await baseClient.post<ApiResponse<{ accessToken: string; csrfToken: string }>>(
      "/auth/refresh",
      null,
    );

    const token = data.data.accessToken;
    const newCsrf = data.data.csrfToken;

    // Persist the rotated CSRF token for use on other protected endpoints
    if (newCsrf) saveCsrfToken(newCsrf);

    useAuthStore.getState().setAccessToken(token);
    return token;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
};
