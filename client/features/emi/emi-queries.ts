import { useMutation, useQuery } from "@tanstack/react-query";
import { emiApi } from "@/features/emi/emi-api";

export const useEmiCalculator = () => {
  return useMutation({
    mutationFn: emiApi.calculate,
  });
};

export const useMyEmis = () => {
  return useQuery({
    queryKey: ["emi", "my"],
    queryFn: emiApi.myEmis,
  });
};

export const useUpcomingEmis = () => {
  return useQuery({
    queryKey: ["emi", "upcoming"],
    queryFn: emiApi.upcoming,
  });
};
