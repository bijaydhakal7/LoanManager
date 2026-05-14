import { useAuthStore } from "@/lib/auth/auth-store";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isRestoring = useAuthStore((state) => state.isRestoring);

  return {
    user,
    accessToken,
    isRestoring,
    isAuthenticated: Boolean(user && accessToken),
  };
};
