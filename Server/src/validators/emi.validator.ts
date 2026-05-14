import { z } from "zod";

export const calculateEmiSchema = z.object({
  body: z.object({
    principal: z.coerce.number().positive(),
    interestRate: z.coerce.number().min(0).max(100),
    tenureMonths: z.coerce.number().int().positive().max(600),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});
