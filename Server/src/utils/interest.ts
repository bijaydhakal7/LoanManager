import { round2 } from "./number.js";

export type InterestTimeUnit = "DAYS" | "MONTHS" | "YEARS";
export type CompoundingFrequency = "ANNUALLY" | "SEMI_ANNUALLY" | "QUARTERLY" | "MONTHLY";

export interface InterestCalculationInput {
  principal: number;
  ratePercent: number;
  time: number;
  timeUnit: InterestTimeUnit;
  mode: "SIMPLE" | "COMPOUND";
  compoundingFrequency?: CompoundingFrequency;
}

export interface InterestCalculationResult {
  principal: number;
  interest: number;
  totalAmount: number;
  ratePercent: number;
  timeInYears: number;
}

const timesPerYear: Record<CompoundingFrequency, number> = {
  ANNUALLY: 1,
  SEMI_ANNUALLY: 2,
  QUARTERLY: 4,
  MONTHLY: 12,
};

export const toYears = (time: number, unit: InterestTimeUnit): number => {
  if (unit === "YEARS") return time;
  if (unit === "MONTHS") return time / 12;
  return time / 365;
};

export const calculateInterest = ({
  principal,
  ratePercent,
  time,
  timeUnit,
  mode,
  compoundingFrequency = "ANNUALLY",
}: InterestCalculationInput): InterestCalculationResult => {
  if (principal <= 0) throw new Error("Principal must be greater than 0");
  if (ratePercent < 0) throw new Error("Rate cannot be negative");
  if (time <= 0) throw new Error("Time must be greater than 0");

  const timeInYears = toYears(time, timeUnit);

  let totalAmount: number;
  if (mode === "SIMPLE") {
    // SI = (P * R * T) / 100
    const simpleInterest = (principal * ratePercent * timeInYears) / 100;
    totalAmount = principal + simpleInterest;
  } else {
    const n = timesPerYear[compoundingFrequency];
    const rate = ratePercent / 100;
    totalAmount = principal * Math.pow(1 + rate / n, n * timeInYears);
  }

  const interest = round2(totalAmount - principal);

  return {
    principal: round2(principal),
    interest,
    totalAmount: round2(principal + interest),
    ratePercent,
    timeInYears: round2(timeInYears),
  };
};
