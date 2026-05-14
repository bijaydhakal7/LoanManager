import { apiClient } from "@/lib/api/client";
import type { ApiResponse, EmiCalculation, EmiEntry, UpcomingEmi } from "@/lib/types";

export const emiApi = {
  async calculate(payload: { principal: number; interestRate: number; tenureMonths: number }) {
    const { data } = await apiClient.post<ApiResponse<EmiCalculation>>("/emi/calculate", payload);
    return data.data;
  },

  async myEmis() {
    const { data } = await apiClient.get<ApiResponse<EmiEntry[]>>("/emi/my");
    return data.data;
  },

  async upcoming() {
    const { data } = await apiClient.get<ApiResponse<UpcomingEmi[]>>("/emi/upcoming");
    return data.data;
  },
};
