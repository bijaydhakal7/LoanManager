import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Bill, BillCategory, BillRecurrence } from "@/lib/types";

export const billApi = {
  async list() {
    const { data } = await apiClient.get<ApiResponse<Bill[]>>("/bills");
    return data.data;
  },

  async create(payload: {
    name: string;
    amount: number;
    dueDate: string;
    recurrence?: BillRecurrence;
    category?: BillCategory;
  }) {
    const { data } = await apiClient.post<ApiResponse<{ id: number }>>("/bills", payload);
    return data.data;
  },

  async pay(id: number) {
    const { data } = await apiClient.put<ApiResponse<Bill>>(`/bills/${id}/pay`);
    return data.data;
  },

  async remove(id: number) {
    const { data } = await apiClient.delete<ApiResponse<{ id: number }>>(`/bills/${id}`);
    return data.data;
  },
  async update(id: number, payload: {
    name?: string;
    amount?: number;
    dueDate?: string;
    recurrence?: BillRecurrence;
    category?: BillCategory;
  }) {
    const { data } = await apiClient.put<ApiResponse<Bill>>(`/bills/${id}`, payload);
    return data.data;
  }
};
