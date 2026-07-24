import prisma from "../lib/prisma.js";
import { toNumber, round2 } from "../utils/number.js";

const startOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const yearsBetweenDates = (from: Date, to: Date): number => {
  const diffMs = Math.max(0, to.getTime() - from.getTime());
  return diffMs / (1000 * 60 * 60 * 24 * 365);
};

const accruedInterestFor = (loan: {
  amount: any;
  interestRate: any;
  startDate: Date;
  tenureMonths: number | null;
}) => {
  const principal = toNumber(loan.amount);
  const rate = toNumber(loan.interestRate);
  const tenureYears = loan.tenureMonths ? loan.tenureMonths / 12 : yearsBetweenDates(loan.startDate, new Date());
  return round2(principal * (rate / 100) * tenureYears);
};

export const dashboardService = {
  async getSummary(userId: number) {
    const now = new Date();
    const next30Days = new Date();
    next30Days.setDate(now.getDate() + 30);

    const [
      givenLoans,
      takenLoans,
      activeLoansCount,
      upcomingPayments,
      recentExpenses,
      monthlyExpenses,
      expenseByCategoryRaw,
    ] = await Promise.all([
      prisma.loan.findMany({ where: { userId, type: "GIVEN" } }),
      prisma.loan.findMany({ where: { userId, type: "TAKEN" } }),
      prisma.loan.count({ where: { userId, status: "ACTIVE" } }),
      prisma.loan.findMany({
        where: {
          userId,
          status: "ACTIVE",
          dueDate: {
            gte: now,
            lte: next30Days,
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
      prisma.expense.findMany({
        where: { userId, expenseDate: { gte: startOfMonth() } },
      }),
      prisma.expense.groupBy({
        by: ["category"],
        where: { userId, expenseDate: { gte: startOfMonth() } },
        _sum: { amount: true },
      }),
    ]);

    const totalGiven = givenLoans.reduce((sum, loan) => sum + toNumber(loan.amount), 0);
    const totalTaken = takenLoans.reduce((sum, loan) => sum + toNumber(loan.amount), 0);

    const interestReceivable = round2(
      givenLoans.filter((l) => l.status === "ACTIVE").reduce((sum, loan) => sum + accruedInterestFor(loan), 0),
    );
    const interestPayable = round2(
      takenLoans.filter((l) => l.status === "ACTIVE").reduce((sum, loan) => sum + accruedInterestFor(loan), 0),
    );

    const monthlyExpenseTotal = round2(monthlyExpenses.reduce((sum, e) => sum + toNumber(e.amount), 0));

    const expenseByCategory = expenseByCategoryRaw
      .map((row) => ({
        category: row.category,
        total: round2(toNumber(row._sum.amount ?? 0)),
      }))
      .sort((a, b) => b.total - a.total);

    return {
      totalGiven,
      totalTaken,
      netPosition: round2(totalGiven - totalTaken),
      activeLoansCount,
      interestReceivable,
      interestPayable,
      netInterestPosition: round2(interestReceivable - interestPayable),
      monthlyExpenseTotal,
      expenseByCategory,
      upcomingPayments: upcomingPayments.map((loan) => ({
        id: loan.id,
        counterpartyName: loan.counterpartyName,
        amount: toNumber(loan.amount),
        dueDate: loan.dueDate,
        type: loan.type,
      })),
      recentExpenses: recentExpenses.map((expense) => ({
        ...expense,
        amount: toNumber(expense.amount),
      })),
    };
  },
};
