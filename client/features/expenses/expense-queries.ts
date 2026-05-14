import { useQuery } from "@tanstack/react-query";
import { expenseApi } from "@/features/expenses/expense-api";
import type { ExpenseCategory } from "@/lib/types";

type ExpenseFilters = {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
};

export const useExpenses = (filters: ExpenseFilters) => {
  return useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => expenseApi.list(filters),
  });
};
