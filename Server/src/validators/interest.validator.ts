import { z } from "zod";

export const calculateInterestSchema = z.object({
  body: z.object({
    principal: z.coerce.number().positive(),
    ratePercent: z.coerce.number().min(0).max(100),
    time: z.coerce.number().positive(),
    timeUnit: z.enum(["DAYS", "MONTHS", "YEARS"]),
    mode: z.enum(["SIMPLE", "COMPOUND"]),
    compoundingFrequency: z.enum(["ANNUALLY", "SEMI_ANNUALLY", "QUARTERLY", "MONTHLY"]).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});
