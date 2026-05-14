"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/auth-store";
import { refreshSession } from "@/lib/auth/session";
import { authApi } from "@/features/auth/auth-api";
import { LoadingScreen } from "@/components/loading-screen";

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const startRestoring = useAuthStore((state) => state.startRestoring);
  const finishRestoring = useAuthStore((state) => state.finishRestoring);

  useEffect(() => {
    let active = true;

    const restore = async () => {
      startRestoring();
      const token = await refreshSession();
      if (!active) return;

      if (token) {
        try {
          const user = await authApi.me();
          if (!active) return;
          setAuth(token, user);
        } catch {
          if (!active) return;
          clearAuth();
        }
      } else {
        clearAuth();
      }

      finishRestoring();
    };

    void restore();

    return () => {
      active = false;
    };
  }, [clearAuth, finishRestoring, setAuth, startRestoring]);

  if (isRestoring) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
