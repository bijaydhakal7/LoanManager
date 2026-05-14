import { useQuery } from "@tanstack/react-query";
import { loanApi } from "@/features/loans/loan-api";
import type { LoanStatus, LoanType } from "@/lib/types";

type LoanFilters = {
  type?: LoanType;
  status?: LoanStatus;
};

export const useLoans = (filters: LoanFilters) => {
  return useQuery({
    queryKey: ["loans", filters],
    queryFn: () => loanApi.list(filters),
  });
};
