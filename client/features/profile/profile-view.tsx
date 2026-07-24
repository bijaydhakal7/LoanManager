"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Laptop, Smartphone, ShieldCheck, LogOut } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth/auth-store";
import { authApi } from "@/features/auth/auth-api";
import { formatDate } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api/errors";

export const ProfileView = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [revokingSid, setRevokingSid] = useState<string | null>(null);

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: authApi.listSessions,
  });

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

  const handleRevoke = async (sid: string) => {
    setRevokingSid(sid);
    try {
      await authApi.revokeSession(sid);
      toast.success("Session revoked");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to revoke session"));
    } finally {
      setRevokingSid(null);
    }
  };

  const deviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return Smartphone;
    }
    return Laptop;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your account details and active sessions" />

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-sm text-slate-500">No active sessions found.</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {sessions.map((session) => {
                  const Icon = deviceIcon(session.userAgent);
                  return (
                    <motion.div
                      key={session.sid}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                          <Icon className="h-4 w-4 text-blue-600" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-slate-900">{session.userAgent}</p>
                            {session.isCurrent ? <Badge variant="success">This device</Badge> : null}
                          </div>
                          <p className="text-xs text-slate-500">
                            {session.ipAddress} · Signed in {formatDate(session.createdAt)}
                          </p>
                        </div>
                      </div>
                      {!session.isCurrent ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRevoke(session.sid)}
                          disabled={revokingSid === session.sid}
                        >
                          <LogOut className="mr-1.5 h-3.5 w-3.5" />
                          {revokingSid === session.sid ? "Revoking..." : "Revoke"}
                        </Button>
                      ) : null}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
