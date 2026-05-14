import { useMutation, useQueryClient } from "@tanstack/react-query";
import { billApi } from "@/features/bills/bill-api";

export const useCreateBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

export const usePayBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billApi.pay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};

export const useDeleteBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
    },
  });
};
