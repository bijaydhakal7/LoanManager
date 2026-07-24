"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateExpense, useUpdateExpense } from "@/features/expenses/expense-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ExpenseCategory } from "@/lib/types";

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount is required"),
  category: z.enum(["FOOD", "TRANSPORT", "SHOPPING", "BILLS", "ENTERTAINMENT", "HEALTHCARE", "OTHER"]),
  expenseDate: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

type ExpenseValues = z.infer<typeof expenseSchema>;

type ExpenseFormProps = {
  variant?: "inline" | "dialog";
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialValues?: Partial<ExpenseValues> & { id?: number };
};

const categories: Array<{ label: string; value: ExpenseCategory }> = [
  { label: "Food", value: "FOOD" },
  { label: "Transport", value: "TRANSPORT" },
  { label: "Shopping", value: "SHOPPING" },
  { label: "Bills", value: "BILLS" },
  { label: "Entertainment", value: "ENTERTAINMENT" },
  { label: "Healthcare", value: "HEALTHCARE" },
  { label: "Other", value: "OTHER" },
];

export const ExpenseForm = ({
  variant = "inline",
  onSuccess,
  mode = "create",
  initialValues,
}: ExpenseFormProps) => {
  const createExpense = useCreateExpense();
  const updateExpense = useUpdateExpense();
  const form = useForm<ExpenseValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: initialValues?.amount ?? 0,
      category: initialValues?.category ?? "FOOD",
      expenseDate: initialValues?.expenseDate ?? new Date().toISOString().slice(0, 10),
      description: initialValues?.description ?? "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.reset({
      amount: initialValues.amount ?? 0,
      category: initialValues.category ?? "FOOD",
      expenseDate: initialValues.expenseDate ?? new Date().toISOString().slice(0, 10),
      description: initialValues.description ?? "",
    });
  }, [form, initialValues]);

  const onSubmit = async (values: ExpenseValues) => {
    try {
      if (mode === "edit" && initialValues?.id) {
        await updateExpense.mutateAsync({ id: initialValues.id, payload: values });
        toast.success("Expense updated");
      } else {
        await createExpense.mutateAsync(values);
        toast.success("Expense added");
        form.reset({
          amount: 0,
          category: values.category,
          expenseDate: new Date().toISOString().slice(0, 10),
          description: "",
        });
      }
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, mode === "edit" ? "Failed to update expense" : "Failed to add expense"));
    }
  };

  const containerClassName =
    variant === "dialog"
      ? "grid gap-4 md:grid-cols-4"
      : "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={containerClassName}>
      <div className="space-y-2">
        <Label htmlFor="expense-amount">Amount</Label>
        <Input id="expense-amount" type="number" step="0.01" {...form.register("amount")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expense-category">Category</Label>
        <Select id="expense-category" {...form.register("category")}>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expense-date">Date</Label>
        <Input id="expense-date" type="date" {...form.register("expenseDate")} />
      </div>
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="expense-description">Description</Label>
        <Textarea id="expense-description" placeholder="Add a note" {...form.register("description")} />
      </div>
      <div className="md:col-span-4">
        <Button type="submit" disabled={createExpense.isPending || updateExpense.isPending}>
          {createExpense.isPending || updateExpense.isPending
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};
