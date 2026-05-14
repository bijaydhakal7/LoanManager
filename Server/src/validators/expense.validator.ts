import { z } from "zod";

const expenseCategory = z.enum([
  "FOOD",
  "TRANSPORT",
  "SHOPPING",
  "BILLS",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "OTHER",
]);

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive(),
    category: expenseCategory,
    expenseDate: z.string(),
    description: z.string().max(500).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const listExpensesSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    category: expenseCategory.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
  params: z.object({}).passthrough(),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive().optional(),
    category: expenseCategory.optional(),
    expenseDate: z.string().optional(),
    description: z.string().max(500).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const expenseIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});
