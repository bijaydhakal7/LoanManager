import { baseClient } from "@/lib/api/client";
import { env } from "@/lib/config";
import { getCsrfToken } from "@/lib/auth/csrf";
import { useAuthStore } from "@/lib/auth/auth-store";
import type { ApiResponse } from "@/lib/types";

export const refreshSession = async (): Promise<string | null> => {
  const csrf = getCsrfToken();
  if (!csrf) {
    useAuthStore.getState().clearAuth();
    return null;
  }

  try {
    const { data } = await baseClient.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      null,
      {
        headers: {
          [env.csrfHeaderName]: csrf,
        },
      },
    );

    const token = data.data.accessToken;
    useAuthStore.getState().setAccessToken(token);
    return token;
  } catch {
    useAuthStore.getState().clearAuth();
    return null;
  }
};
