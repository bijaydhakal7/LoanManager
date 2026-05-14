import { apiClient } from "@/lib/api/client";
import type { ApiResponse, ExpenseCategory, ExpenseSummary } from "@/lib/types";

type ExpenseListParams = {
  category?: ExpenseCategory;
  startDate?: string;
  endDate?: string;
};

export const expenseApi = {
  async list(params?: ExpenseListParams) {
    const { data } = await apiClient.get<ApiResponse<ExpenseSummary>>("/expenses", { params });
    return data.data;
  },

  async create(payload: {
    amount: number;
    category: ExpenseCategory;
    expenseDate: string;
    description?: string;
  }) {
    const { data } = await apiClient.post<ApiResponse<{ id: number }>>("/expenses", payload);
    return data.data;
  },

  async update(id: number, payload: {
    amount?: number;
    category?: ExpenseCategory;
    expenseDate?: string;
    description?: string;
  }) {
    const { data } = await apiClient.put<ApiResponse<{ id: number }>>(`/expenses/${id}`, payload);
    return data.data;
  },

  async remove(id: number) {
    const { data } = await apiClient.delete<ApiResponse<{ id: number }>>(`/expenses/${id}`);
    return data.data;
  },
};
