import type { LoanStatus, LoanType, Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export interface LoanFilters {
  type?: LoanType;
  status?: LoanStatus;
}

export const loanRepository = {
  createLoan(data: Prisma.LoanUncheckedCreateInput) {
    return prisma.loan.create({ data });
  },

  listLoans(userId: number, filters: LoanFilters) {
    return prisma.loan.findMany({
      where: {
        userId,
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
      },
      include: {
        repayments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getLoanById(userId: number, loanId: number) {
    return prisma.loan.findFirst({
      where: { id: loanId, userId },
      include: {
        repayments: {
          orderBy: { paymentDate: "desc" },
        },
      },
    });
  },

  updateLoan(loanId: number, data: Prisma.LoanUpdateInput) {
    return prisma.loan.update({
      where: { id: loanId },
      data,
    });
  },

  closeLoan(loanId: number) {
    return prisma.loan.update({
      where: { id: loanId },
      data: { status: "CLOSED" },
    });
  },

  createRepayment(data: Prisma.RepaymentUncheckedCreateInput) {
    return prisma.repayment.create({ data });
  },

  listRepayments(loanId: number) {
    return prisma.repayment.findMany({
      where: { loanId },
      orderBy: { paymentDate: "desc" },
    });
  },

  listEmiLoans(userId: number) {
    return prisma.loan.findMany({
      where: {
        userId,
        status: "ACTIVE",
        emiAmount: { not: null },
      },
      orderBy: { dueDate: "asc" },
      include: { repayments: true },
    });
  },

  listUpcomingLoans(userId: number, from: Date, to: Date) {
    return prisma.loan.findMany({
      where: {
        userId,
        status: "ACTIVE",
        dueDate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { dueDate: "asc" },
      include: { repayments: true },
    });
  },
};
