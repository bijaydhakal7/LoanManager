import { apiClient } from "@/lib/api/client";
import type {
  ApiResponse,
  CompoundingFrequency,
  InterestCalculation,
  InterestMode,
  InterestTimeUnit,
} from "@/lib/types";

export type InterestCalculatePayload = {
  principal: number;
  ratePercent: number;
  time: number;
  timeUnit: InterestTimeUnit;
  mode: InterestMode;
  compoundingFrequency?: CompoundingFrequency;
};

export const interestApi = {
  async calculate(payload: InterestCalculatePayload) {
    const { data } = await apiClient.post<ApiResponse<InterestCalculation>>("/interest/calculate", payload);
    return data.data;
  },
};
