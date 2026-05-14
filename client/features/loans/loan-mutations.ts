import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loanApi } from "@/features/loans/loan-api";

export const useCreateLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof loanApi.update>[1] }) =>
      loanApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loanApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
