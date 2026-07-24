"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useDashboardSummary } from "@/features/dashboard/dashboard-queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoanForm } from "@/features/loans/loan-form";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { ArrowUpRight, ArrowDownRight, Wallet, HandCoins, Calculator, Landmark } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#f59e0b",
  TRANSPORT: "#3b82f6",
  SHOPPING: "#a855f7",
  BILLS: "#ef4444",
  ENTERTAINMENT: "#ec4899",
  HEALTHCARE: "#10b981",
  OTHER: "#64748b",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

export const DashboardView = () => {
  const { data, isLoading } = useDashboardSummary();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<"loan" | "expense">("loan");

  const loanPieData = useMemo(() => {
    if (!data) return [] as Array<{ name: string; value: number; color: string }>;
    return [
      { name: "Given", value: data.totalGiven, color: "#10b981" },
      { name: "Taken", value: data.totalTaken, color: "#ef4444" },
    ];
  }, [data]);

  const expensePieData = useMemo(() => {
    if (!data?.expenseByCategory?.length) return [] as Array<{ name: string; value: number; color: string }>;
    return data.expenseByCategory.map((row) => ({
      name: row.category,
      value: row.total,
      color: CATEGORY_COLORS[row.category] ?? "#64748b",
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Snapshot of your finances" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Snapshot of your finances" />
        <p className="text-sm text-slate-500">No dashboard data yet.</p>
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Total Given",
      value: data.totalGiven,
      icon: ArrowUpRight,
      accent: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Taken",
      value: data.totalTaken,
      icon: ArrowDownRight,
      accent: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Net Position",
      value: data.netPosition,
      icon: Wallet,
      accent: data.netPosition >= 0 ? "text-emerald-600" : "text-rose-600",
      bg: data.netPosition >= 0 ? "bg-emerald-50" : "bg-rose-50",
    },
    {
      label: "This Month's Expenses",
      value: data.monthlyExpenseTotal,
      icon: Landmark,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Dashboard" description="A snapshot of what you owe, what's owed to you, and where your money goes." />
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/interest" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Interest Calculator
            </Link>
          </Button>
          <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
            <DialogTrigger asChild>
              <Button>Quick Add</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Quick Add</DialogTitle>
                <DialogDescription>Record a loan or an expense.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={quickAddType === "loan" ? "default" : "outline"}
                  onClick={() => setQuickAddType("loan")}
                >
                  <HandCoins className="mr-1.5 h-4 w-4" />
                  Loan
                </Button>
                <Button
                  variant={quickAddType === "expense" ? "default" : "outline"}
                  onClick={() => setQuickAddType("expense")}
                >
                  <Wallet className="mr-1.5 h-4 w-4" />
                  Expense
                </Button>
              </div>
              {quickAddType === "loan" ? (
                <LoanForm variant="dialog" onSuccess={() => setQuickAddOpen(false)} />
              ) : null}
              {quickAddType === "expense" ? (
                <ExpenseForm variant="dialog" onSuccess={() => setQuickAddOpen(false)} />
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, i) => (
          <motion.div key={card.label} custom={i} variants={cardVariants} initial="hidden" animate="show">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-0">
                <CardTitle className="text-sm text-slate-500">{card.label}</CardTitle>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.accent}`} />
                </span>
              </CardHeader>
              <CardContent className={`text-2xl font-semibold ${card.accent}`}>
                {formatCurrency(card.value)}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="show">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Interest Receivable</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold text-emerald-600">
              {formatCurrency(data.interestReceivable)}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="show">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Interest Payable</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold text-rose-600">
              {formatCurrency(data.interestPayable)}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div custom={6} variants={cardVariants} initial="hidden" animate="show">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Active Loans</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold text-slate-900">{data.activeLoansCount}</CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Given vs Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={loanPieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                    {loanPieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-center gap-6 text-sm text-slate-600">
              {loanPieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category (this month)</CardTitle>
          </CardHeader>
          <CardContent>
            {expensePieData.length === 0 ? (
              <p className="flex h-64 items-center justify-center text-sm text-slate-500">No expenses recorded this month.</p>
            ) : (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expensePieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {expensePieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600">
                  {expensePieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Payments (next 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcomingPayments.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming payments.</p>
              ) : (
                data.upcomingPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{payment.counterpartyName}</p>
                      <p className="text-xs text-slate-500">Due {formatDate(payment.dueDate ?? "")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(payment.amount)}</p>
                      <Badge variant={payment.type === "GIVEN" ? "success" : "warning"}>{payment.type}</Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentExpenses.length === 0 ? (
                <p className="text-sm text-slate-500">No expenses yet.</p>
              ) : (
                data.recentExpenses.slice(0, 5).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{expense.description || expense.category}</p>
                      <p className="text-xs text-slate-500">{formatDate(expense.expenseDate)}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(expense.amount)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
