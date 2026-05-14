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
  emiAmount?: number | null;
  status: LoanStatus;
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

export type BillStatus = "PAID" | "UNPAID" | "OVERDUE";
export type BillCategory = "UTILITIES" | "RENT" | "SUBSCRIPTIONS" | "INSURANCE" | "OTHER";
export type BillRecurrence = "ONE_TIME" | "MONTHLY" | "YEARLY";

export type Bill = {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  recurrence: BillRecurrence;
  category: BillCategory;
  status: BillStatus;
  paidDate?: string | null;
};

export type DashboardSummary = {
  totalGiven: number;
  totalTaken: number;
  netPosition: number;
  activeLoansCount: number;
  upcomingPayments: Array<{
    id: number;
    counterpartyName: string;
    amount: number;
    dueDate: string | null;
    type: LoanType;
  }>;
  recentExpenses: Expense[];
  overdueBills: Bill[];
};

export type EmiCalculation = {
  emi: number;
  totalInterest: number;
  totalAmount: number;
};

export type EmiEntry = {
  id: number;
  loanName: string;
  amount: number;
  dueDate: string;
  status: "OVERDUE" | "UPCOMING";
  progressPercentage: number;
};

export type UpcomingEmi = {
  id: number;
  loanName: string;
  amount: number;
  dueDate: string | null;
  type: LoanType;
};
