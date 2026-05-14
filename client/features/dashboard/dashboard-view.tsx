"use client";

import { useMemo, useState } from "react";
import { useDashboardSummary } from "@/features/dashboard/dashboard-queries";
import { formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LoanForm } from "@/features/loans/loan-form";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { BillForm } from "@/features/bills/bill-form";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const DashboardView = () => {
  const { data, isLoading } = useDashboardSummary();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<"loan" | "expense" | "bill">("loan");

  const loanPieData = useMemo(() => {
    if (!data) return [] as Array<{ name: string; value: number; color: string }>;
    return [
      { name: "Given", value: data.totalGiven, color: "var(--brand-600)" },
      { name: "Taken", value: data.totalTaken, color: "var(--danger-text)" },
    ];
  }, [data]);

  const recentExpenseSeries = useMemo(() => {
    if (!data?.recentExpenses?.length) return [] as Array<{ label: string; amount: number }>;

    const expenses = [...data.recentExpenses].reverse();
    return expenses.map((expense) => ({
      label: formatDate(expense.expenseDate),
      amount: expense.amount,
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Dashboard" description="Snapshot of your finances" />
        <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
          <DialogTrigger asChild>
            <Button>Quick Add</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Quick Add</DialogTitle>
              <DialogDescription>Create a loan, expense, or bill.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={quickAddType === "loan" ? "default" : "outline"}
                onClick={() => setQuickAddType("loan")}
              >
                Loan
              </Button>
              <Button
                variant={quickAddType === "expense" ? "default" : "outline"}
                onClick={() => setQuickAddType("expense")}
              >
                Expense
              </Button>
              <Button
                variant={quickAddType === "bill" ? "default" : "outline"}
                onClick={() => setQuickAddType("bill")}
              >
                Bill
              </Button>
            </div>
            {quickAddType === "loan" ? (
              <LoanForm variant="dialog" onSuccess={() => setQuickAddOpen(false)} />
            ) : null}
            {quickAddType === "expense" ? (
              <ExpenseForm variant="dialog" onSuccess={() => setQuickAddOpen(false)} />
            ) : null}
            {quickAddType === "bill" ? (
              <BillForm variant="dialog" onSuccess={() => setQuickAddOpen(false)} />
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Total Given</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-blue-700">
            {formatCurrency(data.totalGiven)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Total Taken</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-red-600">
            {formatCurrency(data.totalTaken)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Net Position</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-600">
            {formatCurrency(data.netPosition)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Active Loans</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">
            {data.activeLoansCount}
          </CardContent>
        </Card>
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
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {recentExpenseSeries.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentExpenseSeries} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                    <XAxis dataKey="label" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} hide />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} width={60} tickFormatter={(v) => String(v)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="amount" stroke="var(--brand-600)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
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
            <CardTitle>Overdue Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.overdueBills.length === 0 ? (
                <p className="text-sm text-slate-500">No overdue bills.</p>
              ) : (
                data.overdueBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{bill.name}</p>
                      <p className="text-xs text-slate-500">Due {formatDate(bill.dueDate)}</p>
                    </div>
                    <Badge variant="danger">Overdue</Badge>
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
