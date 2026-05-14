import type { ExpenseCategory, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const expenseRepository = {
  createExpense(data: Prisma.ExpenseUncheckedCreateInput) {
    return prisma.expense.create({ data });
  },

  listExpenses(userId: number, filters: { category?: ExpenseCategory; startDate?: Date; endDate?: Date }) {
    return prisma.expense.findMany({
      where: {
        userId,
        ...(filters.category && { category: filters.category }),
        ...(filters.startDate || filters.endDate
          ? {
              expenseDate: {
                ...(filters.startDate && { gte: filters.startDate }),
                ...(filters.endDate && { lte: filters.endDate }),
              },
            }
          : {}),
      },
      orderBy: { expenseDate: "desc" },
    });
  },

  getExpenseById(userId: number, id: number) {
    return prisma.expense.findFirst({ where: { id, userId } });
  },

  updateExpense(id: number, data: Prisma.ExpenseUpdateInput) {
    return prisma.expense.update({ where: { id }, data });
  },

  deleteExpense(id: number) {
    return prisma.expense.delete({ where: { id } });
  },
};
