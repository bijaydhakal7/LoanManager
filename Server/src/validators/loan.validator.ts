import { z } from "zod";

const optionalDate = z
  .string()
  .datetime({ offset: true })
  .or(z.string().date())
  .optional();

export const createLoanSchema = z.object({
  body: z.object({
    type: z.enum(["GIVEN", "TAKEN"]),
    counterpartyName: z.string().min(1).max(120),
    amount: z.coerce.number().positive(),
    interestRate: z.coerce.number().min(0).max(100),
    startDate: z.string(),
    dueDate: optionalDate,
    tenureMonths: z.coerce.number().int().positive().max(600).optional(),
    emiAmount: z.coerce.number().positive().optional(),
    notes: z.string().max(1000).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateLoanSchema = z.object({
  body: z.object({
    counterpartyName: z.string().min(1).max(120).optional(),
    interestRate: z.coerce.number().min(0).max(100).optional(),
    dueDate: optionalDate,
    tenureMonths: z.coerce.number().int().positive().max(600).optional(),
    emiAmount: z.coerce.number().positive().optional(),
    status: z.enum(["ACTIVE", "CLOSED", "OVERDUE"]).optional(),
    notes: z.string().max(1000).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const getLoanByIdSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const listLoansSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    type: z.enum(["GIVEN", "TAKEN"]).optional(),
    status: z.enum(["ACTIVE", "CLOSED", "OVERDUE"]).optional(),
  }),
  params: z.object({}).passthrough(),
});

export const createRepaymentSchema = z.object({
  body: z.object({
    amount: z.coerce.number().positive(),
    paymentDate: z.string(),
    notes: z.string().max(1000).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({ id: z.coerce.number().int().positive() }),
});
