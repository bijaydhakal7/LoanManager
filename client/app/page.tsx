"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isRestoring } = useAuth();

  useEffect(() => {
    if (!isRestoring) {
      router.replace(isAuthenticated ? "/dashboard" : "/login");
    }
  }, [isAuthenticated, isRestoring, router]);

  return <LoadingScreen />;
}
