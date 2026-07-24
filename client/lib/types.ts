export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type LoanStatus = "ACTIVE" | "CLOSED" | "OVERDUE";
export type LoanType = "GIVEN" | "TAKEN";

export type Loan = {
  id: number;
  type: LoanType;
  counterpartyName: string;
  amount: number;
  interestRate: number;
  startDate: string;
  dueDate?: string | null;
  tenureMonths?: number | null;
  status: LoanStatus;
  notes?: string | null;
  principal: number;
  accruedInterest: number;
  totalDue: number;
  totalPaid: number;
  remainingBalance: number;
  progressPercentage: number;
};

export type ExpenseCategory =
  | "FOOD"
  | "TRANSPORT"
  | "SHOPPING"
  | "BILLS"
  | "ENTERTAINMENT"
  | "HEALTHCARE"
  | "OTHER";

export type Expense = {
  id: number;
  amount: number;
  category: ExpenseCategory;
  description?: string | null;
  expenseDate: string;
  createdAt: string;
};

export type ExpenseSummary = {
  items: Expense[];
  totals: {
    dailyTotal: number;
    weeklyTotal: number;
    monthlyTotal: number;
  };
};

export type DashboardSummary = {
  totalGiven: number;
  totalTaken: number;
  netPosition: number;
  activeLoansCount: number;
  interestReceivable: number;
  interestPayable: number;
  netInterestPosition: number;
  monthlyExpenseTotal: number;
  expenseByCategory: Array<{ category: ExpenseCategory; total: number }>;
  upcomingPayments: Array<{
    id: number;
    counterpartyName: string;
    amount: number;
    dueDate: string | null;
    type: LoanType;
  }>;
  recentExpenses: Expense[];
};

export type InterestTimeUnit = "DAYS" | "MONTHS" | "YEARS";
export type InterestMode = "SIMPLE" | "COMPOUND";
export type CompoundingFrequency = "ANNUALLY" | "SEMI_ANNUALLY" | "QUARTERLY" | "MONTHLY";

export type InterestCalculation = {
  principal: number;
  interest: number;
  totalAmount: number;
  ratePercent: number;
  timeInYears: number;
};

export type Session = {
  sid: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
};
