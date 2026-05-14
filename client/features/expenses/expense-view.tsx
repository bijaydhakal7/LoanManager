"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/features/expenses/expense-queries";
import { DataTable } from "@/components/data-table";
import { createExpenseColumns } from "@/features/expenses/expense-columns";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDeleteExpense } from "@/features/expenses/expense-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { toast } from "react-toastify";
import type { Expense } from "@/lib/types";
import type { ExpenseCategory } from "@/lib/types";

type RangeOption = "ALL" | "TODAY" | "WEEK" | "MONTH" | "YEAR";

const rangeToDates = (range: RangeOption) => {
  if (range === "ALL") return {};
  const now = new Date();
  const endDate = now.toISOString();
  const start = new Date(now);

  if (range === "TODAY") {
    start.setHours(0, 0, 0, 0);
  } else if (range === "WEEK") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
  } else if (range === "MONTH") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else if (range === "YEAR") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }

  return { startDate: start.toISOString(), endDate };
};

export const ExpenseView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);
  const [range, setRange] = useState<RangeOption>("MONTH");
  const [category, setCategory] = useState<ExpenseCategory | "ALL">("ALL");
  const filterDates = useMemo(() => rangeToDates(range), [range]);
  const deleteMutation = useDeleteExpense();

  const { data, isLoading } = useExpenses({
    ...filterDates,
    category: category === "ALL" ? undefined : category,
  });

  const columns = useMemo(
    () =>
      createExpenseColumns(
        (expense) => setEditExpense(expense),
        (expense) => setDeleteExpense(expense),
      ),
    [],
  );

  const handleDelete = async () => {
    if (!deleteExpense) return;
    try {
      await deleteMutation.mutateAsync(deleteExpense.id);
      toast.success("Expense deleted");
      setDeleteExpense(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete expense"));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Monitor daily, weekly, monthly, and yearly spending across categories."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Daily Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-900">
              {formatCurrency(data?.totals.dailyTotal ?? 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Weekly Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-blue-700">
              {formatCurrency(data?.totals.weeklyTotal ?? 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">Monthly Total</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-emerald-600">
              {formatCurrency(data?.totals.monthlyTotal ?? 0)}
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center justify-start md:justify-end">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add expense</DialogTitle>
                <DialogDescription>Log a new expense entry.</DialogDescription>
              </DialogHeader>
              <ExpenseForm variant="dialog" onSuccess={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <Select value={range} onChange={(event) => setRange(event.target.value as RangeOption)}>
          <option value="ALL">All time</option>
          <option value="TODAY">Today</option>
          <option value="WEEK">This week</option>
          <option value="MONTH">This month</option>
          <option value="YEAR">This year</option>
        </Select>
        <Select value={category} onChange={(event) => setCategory(event.target.value as ExpenseCategory | "ALL")}>
          <option value="ALL">All categories</option>
          <option value="FOOD">Food</option>
          <option value="TRANSPORT">Transport</option>
          <option value="SHOPPING">Shopping</option>
          <option value="BILLS">Bills</option>
          <option value="ENTERTAINMENT">Entertainment</option>
          <option value="HEALTHCARE">Healthcare</option>
          <option value="OTHER">Other</option>
        </Select>
      </div>

      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} emptyMessage="No expenses recorded yet." />

      <Dialog open={Boolean(editExpense)} onOpenChange={(open) => !open && setEditExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit expense</DialogTitle>
            <DialogDescription>Update the selected expense.</DialogDescription>
          </DialogHeader>
          {editExpense ? (
            <ExpenseForm
              variant="dialog"
              mode="edit"
              initialValues={{
                id: editExpense.id,
                amount: editExpense.amount,
                category: editExpense.category,
                expenseDate: editExpense.expenseDate,
                description: editExpense.description ?? "",
              }}
              onSuccess={() => setEditExpense(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteExpense)} onOpenChange={(open) => !open && setDeleteExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete expense</DialogTitle>
            <DialogDescription>
              This will permanently remove the expense entry. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteExpense(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
