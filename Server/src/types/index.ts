// ============================================
// USER TYPES
// ============================================

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface UserCreateInput {
    name: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    name: string;
    email: string;
}

// ============================================
// LOAN TYPES
// ============================================

export type LoanType = 'GIVEN' | 'TAKEN';
export type LoanStatus = 'ACTIVE' | 'CLOSED' | 'OVERDUE';

export interface Loan {
    id: number;
    userId: number;
    type: LoanType;
    counterpartyName: string;
    amount: number;
    interestRate: number;
    startDate: Date;
    dueDate: Date | null;
    tenureMonths: number | null;
    status: LoanStatus;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoanCreateInput {
    type: LoanType;
    counterpartyName: string;
    amount: number;
    interestRate: number;
    startDate: Date;
    dueDate?: Date;
    tenureMonths?: number;
    notes?: string;
}

export interface LoanUpdateInput {
    counterpartyName?: string;
    interestRate?: number;
    dueDate?: Date;
    status?: LoanStatus;
    notes?: string;
}

export interface LoanWithBalance extends Loan {
    totalPaid: number;
    remainingBalance: number;
    progressPercentage: number;
}

// ============================================
// REPAYMENT TYPES
// ============================================

export interface Repayment {
    id: number;
    loanId: number;
    amount: number;
    paymentDate: Date;
    notes: string | null;
    createdAt: Date;
}

export interface RepaymentCreateInput {
    loanId: number;
    amount: number;
    paymentDate: Date;
    notes?: string;
}

// ============================================
// EXPENSE TYPES
// ============================================

export type ExpenseCategory =
    | 'FOOD'
    | 'TRANSPORT'
    | 'SHOPPING'
    | 'BILLS'
    | 'ENTERTAINMENT'
    | 'HEALTHCARE'
    | 'OTHER';

export interface Expense {
    id: number;
    userId: number;
    amount: number;
    category: ExpenseCategory;
    description: string | null;
    expenseDate: Date;
    createdAt: Date;
}

export interface ExpenseCreateInput {
    amount: number;
    category: ExpenseCategory;
    description?: string;
    expenseDate: Date;
}

// ============================================
// INTEREST CALCULATOR TYPES
// ============================================

export type InterestTimeUnit = 'DAYS' | 'MONTHS' | 'YEARS';
export type InterestMode = 'SIMPLE' | 'COMPOUND';
export type CompoundingFrequency = 'ANNUALLY' | 'SEMI_ANNUALLY' | 'QUARTERLY' | 'MONTHLY';

export interface InterestCalculateInput {
    principal: number;
    ratePercent: number;
    time: number;
    timeUnit: InterestTimeUnit;
    mode: InterestMode;
    compoundingFrequency?: CompoundingFrequency;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: UserResponse;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardSummary {
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
        dueDate: Date;
        type: LoanType;
    }>;
    recentExpenses: Array<Expense>;
}
