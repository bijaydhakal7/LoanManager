import { useQuery } from "@tanstack/react-query";
import { billApi } from "@/features/bills/bill-api";

export const useBills = () => {
  return useQuery({
    queryKey: ["bills"],
    queryFn: billApi.list,
  });
};
