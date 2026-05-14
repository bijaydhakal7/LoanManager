import { calculateEmi } from "../../utils/emi.js";

export const emiService = {
  calculate(principal: number, interestRate: number, tenureMonths: number) {
    return calculateEmi({
      principal,
      annualRate: interestRate,
      tenureMonths,
    });
  },
};
