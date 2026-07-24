import { calculateInterest, type InterestCalculationInput } from "../utils/interest.js";

export const interestService = {
  calculate(input: InterestCalculationInput) {
    return calculateInterest(input);
  },
};
