import type { LoanStatus, LoanType, Prisma } from "@prisma/client";
import { loanRepository } from "../repositories/loan/loan.repository.js";
import { AppError } from "../utils/appError.js";
import { round2, toNumber } from "../utils/number.js";

interface CreateLoanInput {
  userId: number;
  type: LoanType;
  counterpartyName: string;
  amount: number;
  interestRate: number;
  startDate: string;
  dueDate?: string;
  tenureMonths?: number;
  notes?: string;
}

interface UpdateLoanInput {
  counterpartyName?: string;
  interestRate?: number;
  dueDate?: string;
  tenureMonths?: number;
  status?: LoanStatus;
  notes?: string;
}

const yearsBetweenDates = (from: Date, to: Date): number => {
  const diffMs = Math.max(0, to.getTime() - from.getTime());
  return diffMs / (1000 * 60 * 60 * 24 * 365);
};

const getLoanMetrics = (loan: {
  amount: Prisma.Decimal;
  interestRate: Prisma.Decimal;
  startDate: Date;
  tenureMonths: number | null;
  repayments: Array<{ amount: Prisma.Decimal }>;
}) => {
  const principal = toNumber(loan.amount);
  const interestRate = toNumber(loan.interestRate);
  const totalPaid = round2(
    loan.repayments.reduce((sum, repayment) => sum + toNumber(repayment.amount), 0),
  );

  const tenureYears = loan.tenureMonths ? loan.tenureMonths / 12 : yearsBetweenDates(loan.startDate, new Date());
  // Simple interest: I = P * R * T / 100
  const accruedInterest = round2(principal * (interestRate / 100) * tenureYears);
  const totalDue = round2(principal + accruedInterest);
  const remainingBalance = round2(Math.max(totalDue - totalPaid, 0));
  const progressPercentage = totalDue === 0 ? 100 : round2((totalPaid / totalDue) * 100);

  return {
    principal,
    accruedInterest,
    totalDue,
    totalPaid,
    remainingBalance,
    progressPercentage,
  };
};

export const loanService = {
  async createLoan(input: CreateLoanInput) {
    const startDate = new Date(input.startDate);
    if (Number.isNaN(startDate.getTime())) {
      throw new AppError("Invalid start date", 400);
    }

    const dueDate = input.dueDate ? new Date(input.dueDate) : null;
    if (dueDate && Number.isNaN(dueDate.getTime())) {
      throw new AppError("Invalid due date", 400);
    }

    const loan = await loanRepository.createLoan({
      userId: input.userId,
      type: input.type,
      counterpartyName: input.counterpartyName,
      amount: input.amount,
      interestRate: input.interestRate,
      startDate,
      dueDate,
      tenureMonths: input.tenureMonths,
      notes: input.notes,
    });

    return {
      ...loan,
      amount: toNumber(loan.amount),
      interestRate: toNumber(loan.interestRate),
    };
  },

  async listLoans(userId: number, filters: { type?: LoanType; status?: LoanStatus }) {
    const loans = await loanRepository.listLoans(userId, filters);
    return loans.map((loan) => {
      const metrics = getLoanMetrics(loan);
      return {
        ...loan,
        amount: toNumber(loan.amount),
        interestRate: toNumber(loan.interestRate),
        ...metrics,
      };
    });
  },

  async getLoanById(userId: number, loanId: number) {
    const loan = await loanRepository.getLoanById(userId, loanId);
    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    const metrics = getLoanMetrics(loan);

    return {
      ...loan,
      amount: toNumber(loan.amount),
      interestRate: toNumber(loan.interestRate),
      repayments: loan.repayments.map((repayment) => ({
        ...repayment,
        amount: toNumber(repayment.amount),
      })),
      ...metrics,
    };
  },

  async updateLoan(userId: number, loanId: number, input: UpdateLoanInput) {
    const existing = await loanRepository.getLoanById(userId, loanId);
    if (!existing) {
      throw new AppError("Loan not found", 404);
    }

    const dueDate = input.dueDate ? new Date(input.dueDate) : undefined;
    if (dueDate && Number.isNaN(dueDate.getTime())) {
      throw new AppError("Invalid due date", 400);
    }

    const updated = await loanRepository.updateLoan(loanId, {
      counterpartyName: input.counterpartyName,
      interestRate: input.interestRate,
      dueDate,
      tenureMonths: input.tenureMonths,
      status: input.status,
      notes: input.notes,
    });

    return {
      ...updated,
      amount: toNumber(updated.amount),
      interestRate: toNumber(updated.interestRate),
    };
  },

  async closeLoan(userId: number, loanId: number) {
    const existing = await loanRepository.getLoanById(userId, loanId);
    if (!existing) {
      throw new AppError("Loan not found", 404);
    }

    const closed = await loanRepository.closeLoan(loanId);
    return {
      ...closed,
      amount: toNumber(closed.amount),
      interestRate: toNumber(closed.interestRate),
    };
  },

  async createRepayment(userId: number, loanId: number, input: { amount: number; paymentDate: string; notes?: string }) {
    const loan = await loanRepository.getLoanById(userId, loanId);
    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    if (loan.status === "CLOSED") {
      throw new AppError("Cannot add repayment to a closed loan", 400);
    }

    const paymentDate = new Date(input.paymentDate);
    if (Number.isNaN(paymentDate.getTime())) {
      throw new AppError("Invalid payment date", 400);
    }

    const metrics = getLoanMetrics(loan);
    if (input.amount > metrics.remainingBalance) {
      throw new AppError("Payment amount exceeds remaining balance", 400, {
        remainingBalance: metrics.remainingBalance,
      });
    }

    const repayment = await loanRepository.createRepayment({
      loanId,
      amount: input.amount,
      paymentDate,
      notes: input.notes,
    });

    const refreshedLoan = await loanRepository.getLoanById(userId, loanId);
    if (!refreshedLoan) {
      throw new AppError("Loan not found after repayment", 500);
    }

    const updatedMetrics = getLoanMetrics(refreshedLoan);
    if (updatedMetrics.remainingBalance <= 0 && refreshedLoan.status !== "CLOSED") {
      await loanRepository.closeLoan(loanId);
    }

    return {
      ...repayment,
      amount: toNumber(repayment.amount),
      remainingBalance: updatedMetrics.remainingBalance,
      autoClosed: updatedMetrics.remainingBalance <= 0,
    };
  },

  async listRepayments(userId: number, loanId: number) {
    const loan = await loanRepository.getLoanById(userId, loanId);
    if (!loan) {
      throw new AppError("Loan not found", 404);
    }

    const repayments = await loanRepository.listRepayments(loanId);
    return repayments.map((repayment) => ({
      ...repayment,
      amount: toNumber(repayment.amount),
    }));
  },
};
