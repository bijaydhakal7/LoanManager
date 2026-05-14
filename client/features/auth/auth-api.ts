import { apiClient, baseClient } from "@/lib/api/client";
import { env } from "@/lib/config";
import { getCsrfToken } from "@/lib/auth/csrf";
import type { ApiResponse, User } from "@/lib/types";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const authApi = {
  async login(payload: LoginPayload) {
    const { data } = await baseClient.post<ApiResponse<{ accessToken: string; user: User }>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await baseClient.post<ApiResponse<{ user: User }>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  async me() {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data;
  },

  async logout() {
    const csrf = getCsrfToken();
    if (!csrf) return;
    await baseClient.post(
      "/auth/logout",
      null,
      {
        headers: {
          [env.csrfHeaderName]: csrf,
        },
      },
    );
  },

  async logoutAll() {
    const csrf = getCsrfToken();
    if (!csrf) return;
    await apiClient.post(
      "/auth/logout-all",
      null,
      {
        headers: {
          [env.csrfHeaderName]: csrf,
        },
      },
    );
  },
};
