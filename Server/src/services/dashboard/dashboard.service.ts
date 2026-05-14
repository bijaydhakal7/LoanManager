import prisma from "../../lib/prisma.js";
import { toNumber } from "../../utils/number.js";

export const dashboardService = {
  async getSummary(userId: number) {
    const [givenLoans, takenLoans, activeLoansCount, upcomingPayments, recentExpenses, overdueBills] = await Promise.all([
      prisma.loan.findMany({ where: { userId, type: "GIVEN" } }),
      prisma.loan.findMany({ where: { userId, type: "TAKEN" } }),
      prisma.loan.count({ where: { userId, status: "ACTIVE" } }),
      prisma.loan.findMany({
        where: {
          userId,
          status: "ACTIVE",
          dueDate: {
            gte: new Date(),
            lte: new Date(new Date().setDate(new Date().getDate() + 30)),
          },
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
      prisma.expense.findMany({
        where: { userId },
        orderBy: { expenseDate: "desc" },
        take: 10,
      }),
      prisma.bill.findMany({
        where: {
          userId,
          status: "OVERDUE",
        },
        orderBy: { dueDate: "asc" },
        take: 10,
      }),
    ]);

    const totalGiven = givenLoans.reduce((sum, loan) => sum + toNumber(loan.amount), 0);
    const totalTaken = takenLoans.reduce((sum, loan) => sum + toNumber(loan.amount), 0);

    return {
      totalGiven,
      totalTaken,
      netPosition: totalGiven - totalTaken,
      activeLoansCount,
      upcomingPayments: upcomingPayments.map((loan) => ({
        id: loan.id,
        counterpartyName: loan.counterpartyName,
        amount: toNumber(loan.emiAmount ?? loan.amount),
        dueDate: loan.dueDate,
        type: loan.type,
      })),
      recentExpenses: recentExpenses.map((expense) => ({
        ...expense,
        amount: toNumber(expense.amount),
      })),
      overdueBills: overdueBills.map((bill) => ({
        ...bill,
        amount: toNumber(bill.amount),
      })),
    };
  },
};
