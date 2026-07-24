"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { interestApi } from "@/features/interest/interest-api";
import { formatCurrency } from "@/lib/format";
import type { CompoundingFrequency, InterestMode, InterestTimeUnit } from "@/lib/types";

export const InterestCalculatorView = () => {
  const [principal, setPrincipal] = useState("100000");
  const [ratePercent, setRatePercent] = useState("12");
  const [time, setTime] = useState("2");
  const [timeUnit, setTimeUnit] = useState<InterestTimeUnit>("YEARS");
  const [mode, setMode] = useState<InterestMode>("SIMPLE");
  const [compoundingFrequency, setCompoundingFrequency] = useState<CompoundingFrequency>("ANNUALLY");

  const debouncedPrincipal = useDebounce(principal, 300);
  const debouncedRate = useDebounce(ratePercent, 300);
  const debouncedTime = useDebounce(time, 300);

  const parsedPrincipal = Number(debouncedPrincipal);
  const parsedRate = Number(debouncedRate);
  const parsedTime = Number(debouncedTime);

  const isValid = parsedPrincipal > 0 && parsedRate >= 0 && parsedTime > 0;

  const { data, isFetching, isError } = useQuery({
    queryKey: ["interest-calc", parsedPrincipal, parsedRate, parsedTime, timeUnit, mode, compoundingFrequency],
    queryFn: () =>
      interestApi.calculate({
        principal: parsedPrincipal,
        ratePercent: parsedRate,
        time: parsedTime,
        timeUnit,
        mode,
        compoundingFrequency,
      }),
    enabled: isValid,
    placeholderData: (prev) => prev,
  });

  const breakdown = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Principal", value: data.principal, color: "bg-blue-500" },
      { label: mode === "SIMPLE" ? "Simple interest" : "Compound interest", value: data.interest, color: "bg-emerald-500" },
    ];
  }, [data, mode]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interest Calculator"
        description="Work out simple or compound interest instantly from principal, rate, and time."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-4 w-4 text-blue-600" />
              Calculation inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Tabs value={mode} onValueChange={(value) => setMode(value as InterestMode)}>
              <TabsList className="w-full">
                <TabsTrigger value="SIMPLE">Simple Interest</TabsTrigger>
                <TabsTrigger value="COMPOUND">Compound Interest</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="principal">Principal (P)</Label>
              <Input
                id="principal"
                type="number"
                inputMode="decimal"
                value={principal}
                onChange={(event) => setPrincipal(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Rate of interest (R) — % per annum</Label>
              <Input
                id="rate"
                type="number"
                inputMode="decimal"
                step="0.1"
                value={ratePercent}
                onChange={(event) => setRatePercent(event.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="time">Time (T)</Label>
                <Input
                  id="time"
                  type="number"
                  inputMode="decimal"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-unit">Unit</Label>
                <Select
                  id="time-unit"
                  value={timeUnit}
                  onChange={(event) => setTimeUnit(event.target.value as InterestTimeUnit)}
                >
                  <option value="DAYS">Days</option>
                  <option value="MONTHS">Months</option>
                  <option value="YEARS">Years</option>
                </Select>
              </div>
            </div>

            {mode === "COMPOUND" ? (
              <div className="space-y-2">
                <Label htmlFor="compounding">Compounding frequency</Label>
                <Select
                  id="compounding"
                  value={compoundingFrequency}
                  onChange={(event) => setCompoundingFrequency(event.target.value as CompoundingFrequency)}
                >
                  <option value="ANNUALLY">Annually</option>
                  <option value="SEMI_ANNUALLY">Semi-annually</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MONTHLY">Monthly</option>
                </Select>
              </div>
            ) : null}

            {!isValid ? (
              <p className="text-xs text-slate-500">Enter a principal, rate, and time greater than zero to see results.</p>
            ) : null}
            {isError ? <p className="text-xs text-red-600">Couldn&apos;t calculate interest. Please check your inputs.</p> : null}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white/90">
              <TrendingUp className="h-4 w-4" />
              Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={data ? `${data.totalAmount}-${mode}` : "empty"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className={isFetching ? "opacity-60 transition-opacity" : "transition-opacity"}
              >
                <p className="text-sm text-white/70">Total amount payable/receivable</p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  {data ? formatCurrency(data.totalAmount) : "—"}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/70">Principal</p>
                <p className="mt-1 text-lg font-semibold">{data ? formatCurrency(data.principal) : "—"}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <p className="text-xs text-white/70">Interest earned</p>
                <p className="mt-1 text-lg font-semibold">{data ? formatCurrency(data.interest) : "—"}</p>
              </div>
            </div>

            {data ? (
              <div className="space-y-2">
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/10">
                  {breakdown.map((segment) => {
                    const pct = data.totalAmount === 0 ? 0 : (segment.value / data.totalAmount) * 100;
                    return (
                      <motion.div
                        key={segment.label}
                        className={segment.color}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-white/70">
                  <span>Principal</span>
                  <span>{mode === "SIMPLE" ? "Simple" : "Compound"} interest</span>
                </div>
              </div>
            ) : null}

            <p className="text-xs text-white/60">
              {mode === "SIMPLE"
                ? "Simple Interest = (P × R × T) / 100"
                : "Compound Interest = P × (1 + R/n)^(n×T) − P"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
