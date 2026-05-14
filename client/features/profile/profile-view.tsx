"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth/auth-store";
import { authApi } from "@/features/auth/auth-api";

export const ProfileView = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    try {
      await authApi.logoutAll();
    } finally {
      clearAuth();
      router.replace("/login");
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details" />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm font-semibold text-slate-900">{user?.name ?? ""}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm font-semibold text-slate-900">{user?.email ?? ""}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="destructive" onClick={handleLogoutAll} disabled={isLoggingOutAll}>
              {isLoggingOutAll ? "Logging out..." : "Log out all sessions"}
            </Button>
            <p className="text-xs text-slate-500">Logs you out on all devices.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
