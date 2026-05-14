import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/lib/config";
import { refreshSession } from "@/lib/auth/session";
import { useAuthStore } from "@/lib/auth/auth-store";

export const baseClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (!refreshPromise) {
      refreshPromise = refreshSession().finally(() => {
        refreshPromise = null;
      });
    }

    const newToken = await refreshPromise;
    if (!newToken) {
      return Promise.reject(error);
    }

    original.headers = original.headers ?? {};
    original.headers.Authorization = `Bearer ${newToken}`;
    return apiClient.request(original);
  },
);
