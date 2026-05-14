"use client";

import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/lib/auth/auth-store";
import { authApi } from "@/features/auth/auth-api";
import { Button } from "@/components/ui/button";

type TopbarProps = {
  onMenuClick?: () => void;
};

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    await authApi.logout();
    clearAuth();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">Welcome back</p>
          <p className="text-xs text-slate-500">{user?.email ?? ""}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 md:inline">{user?.name ?? ""}</span>
        <Button variant="outline" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}