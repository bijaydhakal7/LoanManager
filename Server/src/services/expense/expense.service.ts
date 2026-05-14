import type { ExpenseCategory } from "@prisma/client";
import { expenseRepository } from "../../repositories/expense/expense.repository.js";
import { AppError } from "../../utils/appError.js";
import { round2, toNumber } from "../../utils/number.js";

const withAmount = <T extends { amount: unknown }>(item: T) => ({
  ...item,
  amount: toNumber(item.amount as never),
});

const startOfWeek = (date: Date): Date => {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  copy.setDate(diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export const expenseService = {
  async createExpense(input: {
    userId: number;
    amount: number;
    category: ExpenseCategory;
    expenseDate: string;
    description?: string;
  }) {
    const expenseDate = new Date(input.expenseDate);
    if (Number.isNaN(expenseDate.getTime())) {
      throw new AppError("Invalid expense date", 400);
    }

    const expense = await expenseRepository.createExpense({
      userId: input.userId,
      amount: input.amount,
      category: input.category,
      expenseDate,
      description: input.description,
    });

    return withAmount(expense);
  },

  async listExpenses(input: {
    userId: number;
    category?: ExpenseCategory;
    startDate?: string;
    endDate?: string;
  }) {
    const startDate = input.startDate ? new Date(input.startDate) : undefined;
    const endDate = input.endDate ? new Date(input.endDate) : undefined;

    const expenses = await expenseRepository.listExpenses(input.userId, {
      category: input.category,
      startDate,
      endDate,
    });

    const normalized = expenses.map((expense) => withAmount(expense));

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = startOfWeek(now);

    const dailyTotal = round2(
      normalized
        .filter((expense) => expense.expenseDate >= todayStart)
        .reduce((sum, expense) => sum + expense.amount, 0),
    );

    const weeklyTotal = round2(
      normalized
        .filter((expense) => expense.expenseDate >= weekStart)
        .reduce((sum, expense) => sum + expense.amount, 0),
    );

    const monthlyTotal = round2(
      normalized
        .filter((expense) => expense.expenseDate >= monthStart)
        .reduce((sum, expense) => sum + expense.amount, 0),
    );

    return {
      items: normalized,
      totals: {
        dailyTotal,
        weeklyTotal,
        monthlyTotal,
      },
    };
  },

  async updateExpense(
    userId: number,
    id: number,
    input: {
      amount?: number;
      category?: ExpenseCategory;
      expenseDate?: string;
      description?: string;
    },
  ) {
    const existing = await expenseRepository.getExpenseById(userId, id);
    if (!existing) {
      throw new AppError("Expense not found", 404);
    }

    const expenseDate = input.expenseDate ? new Date(input.expenseDate) : undefined;
    if (expenseDate && Number.isNaN(expenseDate.getTime())) {
      throw new AppError("Invalid expense date", 400);
    }

    const updated = await expenseRepository.updateExpense(id, {
      amount: input.amount,
      category: input.category,
      expenseDate,
      description: input.description,
    });

    return withAmount(updated);
  },

  async deleteExpense(userId: number, id: number) {
    const existing = await expenseRepository.getExpenseById(userId, id);
    if (!existing) {
      throw new AppError("Expense not found", 404);
    }

    await expenseRepository.deleteExpense(id);
    return { id };
  },
};
