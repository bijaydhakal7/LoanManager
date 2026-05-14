"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

type AuthGuardProps = {
  children: React.ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isRestoring } = useAuth();

  useEffect(() => {
    if (!isRestoring && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isRestoring, router]);

  if (isRestoring || !isAuthenticated) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};
