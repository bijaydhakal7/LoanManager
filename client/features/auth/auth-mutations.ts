import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/auth-api";

export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
  });
};
