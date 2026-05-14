"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LayoutDashboard, HandCoins, Receipt, CreditCard, Calculator, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/loans", label: "Loans", icon: HandCoins },
  { href: "/emi", label: "EMI", icon: Calculator },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/bills", label: "Bills", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
};

export const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapsed }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-slate-200 bg-white p-6 transition-transform md:static md:translate-x-0 md:w-64",
        isOpen && "translate-x-0",
        collapsed && "md:w-20",
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn("min-w-0", collapsed && "md:flex md:w-full md:items-center md:justify-center")}>
          <p className={cn("text-lg font-semibold text-slate-900", collapsed && "md:hidden")}>Loan Manager</p>
          <p className={cn("text-xs text-slate-500", collapsed && "md:hidden")}>Smart finance workspace</p>
          <p className={cn("hidden text-lg font-semibold text-slate-900", collapsed && "md:block")}>LM</p>
        </div>
        {onClose ? (
          <button className="text-sm text-slate-400 md:hidden" onClick={onClose}>
            Close
          </button>
        ) : null}
        {onToggleCollapsed ? (
          <button
            type="button"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 md:flex"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
      <nav className="mt-10 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                collapsed && "md:justify-center md:px-2",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
              onClick={onClose}
            >
              <Icon className="h-4 w-4" />
              <span className={cn(collapsed && "md:hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
