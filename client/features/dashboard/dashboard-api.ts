import { apiClient } from "@/lib/api/client";
import type { ApiResponse, DashboardSummary } from "@/lib/types";

export const dashboardApi = {
  async summary() {
    const { data } = await apiClient.get<ApiResponse<DashboardSummary>>("/dashboard");
    return data.data;
  },
};
