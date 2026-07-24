import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Loan, LoanStatus, LoanType } from "@/lib/types";

type LoanListParams = {
  type?: LoanType;
  status?: LoanStatus;
};

export const loanApi = {
  async list(params?: LoanListParams) {
    const { data } = await apiClient.get<ApiResponse<Loan[]>>("/loans", { params });
    return data.data;
  },

  async create(payload: {
    type: LoanType;
    counterpartyName: string;
    amount: number;
    interestRate: number;
    startDate: string;
    dueDate?: string;
    tenureMonths?: number;
    notes?: string;
  }) {
    const { data } = await apiClient.post<ApiResponse<{ id: number }>>("/loans", payload);
    return data.data;
  },

  async update(id: number, payload: {
    counterpartyName?: string;
    interestRate?: number;
    dueDate?: string;
    tenureMonths?: number;
    status?: "ACTIVE" | "CLOSED" | "OVERDUE";
    notes?: string;
  }) {
    const { data } = await apiClient.put<ApiResponse<{ id: number }>>(`/loans/${id}`, payload);
    return data.data;
  },

  async remove(id: number) {
    const { data } = await apiClient.delete<ApiResponse<{ id: number }>>(`/loans/${id}`);
    return data.data;
  },
};
