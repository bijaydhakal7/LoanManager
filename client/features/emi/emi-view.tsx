"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { formatCurrency, formatDate } from "@/lib/format";
import { useMyEmis, useUpcomingEmis } from "@/features/emi/emi-queries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const calculatorSchema = z.object({
  principal: z.coerce.number().positive("Principal is required"),
  interestRate: z.coerce.number().min(0).max(100),
  tenureMonths: z.coerce.number().int().positive().max(600),
});

type CalculatorValues = z.infer<typeof calculatorSchema>;

const calculateEmi = (values: CalculatorValues) => {
  const principal = values.principal;
  const tenureMonths = values.tenureMonths;
  const annualRate = values.interestRate;

  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;
    const totalAmount = emi * tenureMonths;
    const totalInterest = totalAmount - principal;
    return { emi, totalInterest, totalAmount };
  }

  const pow = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * pow) / (pow - 1);
  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;
  return { emi, totalInterest, totalAmount };
};

export const EmiView = () => {
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const { data: emis } = useMyEmis();
  const { data: upcoming } = useUpcomingEmis();

  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    mode: "onChange",
    defaultValues: {
      principal: 0,
      interestRate: 12,
      tenureMonths: 12,
    },
  });

  const watched = useWatch({ control: form.control });
  const canCalculate =
    typeof watched.principal === "number" &&
    typeof watched.interestRate === "number" &&
    typeof watched.tenureMonths === "number" &&
    Number.isFinite(watched.principal) &&
    Number.isFinite(watched.interestRate) &&
    Number.isFinite(watched.tenureMonths) &&
    watched.principal > 0 &&
    watched.tenureMonths > 0 &&
    watched.interestRate >= 0 &&
    !form.formState.errors.principal &&
    !form.formState.errors.interestRate &&
    !form.formState.errors.tenureMonths;

  const result = useMemo(() => {
    if (!canCalculate) return null;
    return calculateEmi(watched as CalculatorValues);
  }, [canCalculate, watched]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="EMI" description="Calculate and track monthly installments." />
        <Dialog open={calculatorOpen} onOpenChange={setCalculatorOpen}>
          <DialogTrigger asChild>
            <Button>EMI Calculator</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>EMI Calculator</DialogTitle>
              <DialogDescription>Instant EMI breakdown based on your inputs.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="principal">Principal</Label>
                        <Input
                          id="principal"
                          type="number"
                          inputMode="decimal"
                          {...form.register("principal", { valueAsNumber: true })}
                        />
                        {form.formState.errors.principal ? (
                          <p className="text-xs text-red-600">{form.formState.errors.principal.message}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="interestRate">Interest %</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          step="0.1"
                          inputMode="decimal"
                          {...form.register("interestRate", { valueAsNumber: true })}
                        />
                        {form.formState.errors.interestRate ? (
                          <p className="text-xs text-red-600">{form.formState.errors.interestRate.message}</p>
                        ) : null}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tenureMonths">Tenure (months)</Label>
                        <Input
                          id="tenureMonths"
                          type="number"
                          inputMode="numeric"
                          {...form.register("tenureMonths", { valueAsNumber: true })}
                        />
                        {form.formState.errors.tenureMonths ? (
                          <p className="text-xs text-red-600">{form.formState.errors.tenureMonths.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Results update instantly as you type.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Monthly EMI</span>
                        <span className="text-lg font-semibold text-emerald-600">{formatCurrency(result.emi)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Total Interest</span>
                        <span className="text-sm font-medium">{formatCurrency(result.totalInterest)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Total Payable</span>
                        <span className="text-sm font-medium">{formatCurrency(result.totalAmount)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Enter valid values to see results.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My EMIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emis?.length ? (
                emis.map((emi) => (
                  <div key={emi.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{emi.loanName}</p>
                      <p className="text-xs text-slate-500">Due {formatDate(emi.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(emi.amount)}</p>
                      <Badge variant={emi.status === "OVERDUE" ? "danger" : "warning"}>{emi.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No EMI schedules yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming EMIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming?.length ? (
                upcoming.map((emi) => (
                  <div key={emi.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{emi.loanName}</p>
                      <p className="text-xs text-slate-500">Due {formatDate(emi.dueDate)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatCurrency(emi.amount)}</p>
                      <Badge variant={emi.type === "GIVEN" ? "success" : "warning"}>{emi.type}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No upcoming EMIs in the next 30 days.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
