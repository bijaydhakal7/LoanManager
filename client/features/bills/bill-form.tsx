"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useCreateBill } from "@/features/bills/bill-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { BillCategory, BillRecurrence } from "@/lib/types";

const billSchema = z.object({
  name: z.string().min(2, "Name is required"),
  amount: z.coerce.number().positive("Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  recurrence: z.enum(["ONE_TIME", "MONTHLY", "YEARLY"]).optional(),
  category: z.enum(["UTILITIES", "RENT", "SUBSCRIPTIONS", "INSURANCE", "OTHER"]).optional(),
});

type BillValues = z.infer<typeof billSchema>;

type BillFormProps = {
  variant?: "inline" | "dialog";
  onSuccess?: () => void;
};

const categories: Array<{ label: string; value: BillCategory }> = [
  { label: "Utilities", value: "UTILITIES" },
  { label: "Rent", value: "RENT" },
  { label: "Subscriptions", value: "SUBSCRIPTIONS" },
  { label: "Insurance", value: "INSURANCE" },
  { label: "Other", value: "OTHER" },
];

const recurrences: Array<{ label: string; value: BillRecurrence }> = [
  { label: "One time", value: "ONE_TIME" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

export const BillForm = ({ variant = "inline", onSuccess }: BillFormProps) => {
  const createBill = useCreateBill();
  const form = useForm<BillValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      name: "",
      amount: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      recurrence: "ONE_TIME",
      category: "OTHER",
    },
  });

  const onSubmit = async (values: BillValues) => {
    try {
      await createBill.mutateAsync(values);
      toast.success("Bill created");
      form.reset({
        name: "",
        amount: 0,
        dueDate: new Date().toISOString().slice(0, 10),
        recurrence: values.recurrence ?? "ONE_TIME",
        category: values.category ?? "OTHER",
      });
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create bill"));
    }
  };

  const containerClassName =
    variant === "dialog"
      ? "grid gap-4 md:grid-cols-4"
      : "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={containerClassName}>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="bill-name">Bill name</Label>
        <Input id="bill-name" placeholder="Internet" {...form.register("name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bill-amount">Amount</Label>
        <Input id="bill-amount" type="number" step="0.01" {...form.register("amount")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bill-date">Due date</Label>
        <Input id="bill-date" type="date" {...form.register("dueDate")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bill-category">Category</Label>
        <Select id="bill-category" {...form.register("category")}>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bill-recurrence">Recurrence</Label>
        <Select id="bill-recurrence" {...form.register("recurrence")}>
          {recurrences.map((recurrence) => (
            <option key={recurrence.value} value={recurrence.value}>
              {recurrence.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="md:col-span-4">
        <Button type="submit" disabled={createBill.isPending}>
          {createBill.isPending ? "Saving..." : "Add Bill"}
        </Button>
      </div>
    </form>
  );
};
