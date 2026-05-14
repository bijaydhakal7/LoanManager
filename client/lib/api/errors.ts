import type { AxiosError } from "axios";

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError?.response?.data?.message ?? fallback;
};
