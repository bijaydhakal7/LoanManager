"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";

type GuestGuardProps = {
  children: React.ReactNode;
};

export const GuestGuard = ({ children }: GuestGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isRestoring } = useAuth();

  useEffect(() => {
    if (!isRestoring && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isRestoring, router]);

  if (isRestoring || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
