import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/dashboard-api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.summary,
  });
};
