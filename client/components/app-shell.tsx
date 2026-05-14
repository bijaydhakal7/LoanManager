"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("lm.sidebarCollapsed") === "1";
  });

  useEffect(() => {
    window.localStorage.setItem("lm.sidebarCollapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-slate-50 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
};
