"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useCreateLoan, useUpdateLoan } from "@/features/loans/loan-mutations";
import type { LoanStatus, LoanType } from "@/lib/types";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const loanSchema = z.object({
  type: z.enum(["GIVEN", "TAKEN"]),
  counterpartyName: z.string().min(1, "Counterparty is required").max(120),
  amount: z.coerce.number().positive("Amount is required"),
  interestRate: z.coerce.number().min(0).max(100),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.preprocess(emptyToUndefined, z.string().optional()),
  tenureMonths: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().max(600).optional()),
  emiAmount: z.preprocess(emptyToUndefined, z.coerce.number().positive().optional()),
  notes: z.preprocess(emptyToUndefined, z.string().max(1000).optional()),
});

type LoanValues = z.infer<typeof loanSchema>;

type LoanFormProps = {
  variant?: "inline" | "dialog";
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialValues?: Partial<LoanValues> & { id?: number; status?: LoanStatus };
};

export const LoanForm = ({
  variant = "inline",
  onSuccess,
  mode = "create",
  initialValues,
}: LoanFormProps) => {
  const createLoan = useCreateLoan();
  const updateLoan = useUpdateLoan();
  const [editStatus, setEditStatus] = useState<LoanStatus>(initialValues?.status ?? "ACTIVE");

  const form = useForm<LoanValues>({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      type: initialValues?.type ?? ("GIVEN" satisfies LoanType),
      counterpartyName: initialValues?.counterpartyName ?? "",
      amount: initialValues?.amount ?? 0,
      interestRate: initialValues?.interestRate ?? 12,
      startDate: initialValues?.startDate ?? new Date().toISOString().slice(0, 10),
      dueDate: initialValues?.dueDate ?? "",
      tenureMonths: initialValues?.tenureMonths ?? undefined,
      emiAmount: initialValues?.emiAmount ?? undefined,
      notes: initialValues?.notes ?? "",
    },
  });

  useEffect(() => {
    if (!initialValues) return;
    form.reset({
      type: initialValues.type ?? ("GIVEN" satisfies LoanType),
      counterpartyName: initialValues.counterpartyName ?? "",
      amount: initialValues.amount ?? 0,
      interestRate: initialValues.interestRate ?? 12,
      startDate: initialValues.startDate ?? new Date().toISOString().slice(0, 10),
      dueDate: initialValues.dueDate ?? "",
      tenureMonths: initialValues.tenureMonths ?? undefined,
      emiAmount: initialValues.emiAmount ?? undefined,
      notes: initialValues.notes ?? "",
    });
    if (initialValues.status) {
      setEditStatus(initialValues.status);
    }
  }, [form, initialValues]);

  const onSubmit = async (values: LoanValues) => {
    try {
      if (mode === "edit" && initialValues?.id) {
        await updateLoan.mutateAsync({
          id: initialValues.id,
          payload: {
            counterpartyName: values.counterpartyName,
            interestRate: values.interestRate,
            dueDate: values.dueDate || undefined,
            tenureMonths: values.tenureMonths,
            emiAmount: values.emiAmount,
            notes: values.notes || undefined,
            status: editStatus,
          },
        });
        toast.success("Loan updated");
      } else {
        await createLoan.mutateAsync({
          type: values.type,
          counterpartyName: values.counterpartyName,
          amount: values.amount,
          interestRate: values.interestRate,
          startDate: values.startDate,
          dueDate: values.dueDate || undefined,
          tenureMonths: values.tenureMonths,
          emiAmount: values.emiAmount,
          notes: values.notes || undefined,
        });
        toast.success("Loan created");
        form.reset({
          type: values.type,
          counterpartyName: "",
          amount: 0,
          interestRate: values.interestRate,
          startDate: new Date().toISOString().slice(0, 10),
          dueDate: "",
          tenureMonths: undefined,
          emiAmount: undefined,
          notes: "",
        });
      }
      onSuccess?.();
    } catch (error) {
      toast.error(getApiErrorMessage(error, mode === "edit" ? "Failed to update loan" : "Failed to create loan"));
    }
  };

  const containerClassName =
    variant === "dialog"
      ? "grid gap-4 md:grid-cols-4"
      : "grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-4";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={containerClassName}>
      {mode === "create" ? (
        <div className="space-y-2">
          <Label htmlFor="loan-type">Type</Label>
          <Select id="loan-type" {...form.register("type")}>
            <option value="GIVEN">Given</option>
            <option value="TAKEN">Taken</option>
          </Select>
        </div>
      ) : null}

      <div className={mode === "create" ? "space-y-2 md:col-span-3" : "space-y-2 md:col-span-4"}>
        <Label htmlFor="loan-counterparty">Counterparty</Label>
        <Input id="loan-counterparty" placeholder="John Doe" {...form.register("counterpartyName")} />
        {form.formState.errors.counterpartyName ? (
          <p className="text-xs text-red-600">{form.formState.errors.counterpartyName.message}</p>
        ) : null}
      </div>

      {mode === "create" ? (
        <div className="space-y-2">
          <Label htmlFor="loan-amount">Amount</Label>
          <Input id="loan-amount" type="number" step="0.01" {...form.register("amount")} />
          {form.formState.errors.amount ? (
            <p className="text-xs text-red-600">{form.formState.errors.amount.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="loan-interest">Interest %</Label>
        <Input id="loan-interest" type="number" step="0.1" {...form.register("interestRate")} />
        {form.formState.errors.interestRate ? (
          <p className="text-xs text-red-600">{form.formState.errors.interestRate.message}</p>
        ) : null}
      </div>

      {mode === "create" ? (
        <div className="space-y-2">
          <Label htmlFor="loan-start">Start date</Label>
          <Input id="loan-start" type="date" {...form.register("startDate")} />
          {form.formState.errors.startDate ? (
            <p className="text-xs text-red-600">{form.formState.errors.startDate.message}</p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="loan-due">Due date (optional)</Label>
        <Input id="loan-due" type="date" {...form.register("dueDate")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="loan-tenure">Tenure (months)</Label>
        <Input id="loan-tenure" type="number" inputMode="numeric" placeholder="12" {...form.register("tenureMonths")} />
        {form.formState.errors.tenureMonths ? (
          <p className="text-xs text-red-600">{form.formState.errors.tenureMonths.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="loan-emi">EMI amount</Label>
        <Input id="loan-emi" type="number" step="0.01" placeholder="" {...form.register("emiAmount")} />
        {form.formState.errors.emiAmount ? (
          <p className="text-xs text-red-600">{form.formState.errors.emiAmount.message}</p>
        ) : null}
      </div>

      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="loan-notes">Notes</Label>
        <Textarea id="loan-notes" placeholder="Optional" {...form.register("notes")} />
        {form.formState.errors.notes ? (
          <p className="text-xs text-red-600">{form.formState.errors.notes.message}</p>
        ) : null}
      </div>

      {mode === "edit" ? (
        <div className="space-y-2">
          <Label htmlFor="loan-status">Status</Label>
          <Select
            id="loan-status"
            value={editStatus}
            onChange={(event) => setEditStatus(event.target.value as LoanStatus)}
          >
            <option value="ACTIVE">Active</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CLOSED">Closed</option>
          </Select>
          <p className="text-xs text-slate-500">Status changes are applied on save.</p>
        </div>
      ) : null}

      <div className="md:col-span-4">
        <Button type="submit" disabled={createLoan.isPending || updateLoan.isPending}>
          {createLoan.isPending || updateLoan.isPending
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Add Loan"}
        </Button>
      </div>
    </form>
  );
};
