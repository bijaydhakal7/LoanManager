import { z } from "zod";

const recurrence = z.enum(["ONE_TIME", "MONTHLY", "YEARLY"]);
const category = z.enum(["UTILITIES", "RENT", "SUBSCRIPTIONS", "INSURANCE", "OTHER"]);

export const createBillSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(120),
    amount: z.coerce.number().positive(),
    dueDate: z.string(),
    recurrence: recurrence.optional(),
    category: category.optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const billIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});
