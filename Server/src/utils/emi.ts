import { round2 } from "./number.js";

export interface EmicalculationInput {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}

export interface EmiScheduleRow {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EmiCalculationResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: EmiScheduleRow[];
}

export const calculateEmi = ({
  principal,
  annualRate,
  tenureMonths,
}: EmicalculationInput): EmiCalculationResult => {
  if (principal <= 0 || tenureMonths <= 0 || annualRate < 0) {
    throw new Error("Invalid EMI input");
  }

  const monthlyRate = annualRate / 12 / 100;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    const pow = Math.pow(1 + monthlyRate, tenureMonths);
    emi = (principal * monthlyRate * pow) / (pow - 1);
  }

  emi = round2(emi);

  let balance = principal;
  const schedule: EmiScheduleRow[] = [];

  for (let month = 1; month <= tenureMonths; month += 1) {
    const interest = round2(balance * monthlyRate);
    let principalPart = round2(emi - interest);

    if (month === tenureMonths) {
      principalPart = round2(balance);
    }

    balance = round2(Math.max(0, balance - principalPart));

    schedule.push({
      month,
      emi,
      principal: principalPart,
      interest,
      balance,
    });
  }

  const totalPayment = round2(emi * tenureMonths);
  const totalInterest = round2(totalPayment - principal);

  return {
    emi,
    totalPayment,
    totalInterest,
    schedule,
  };
};
