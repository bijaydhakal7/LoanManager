// Request body types for API endpoints

import { LoanCreateInput, ExpenseCreateInput, BillCreateInput, RepaymentCreateInput } from './index.js';

// ============================================
// AUTH REQUEST TYPES
// ============================================

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// ============================================
// LOAN REQUEST TYPES
// ============================================

export interface CreateLoanRequest extends LoanCreateInput {}

export interface UpdateLoanRequest {
    counterpartyName?: string;
    interestRate?: number;
    dueDate?: string;
    status?: 'ACTIVE' | 'CLOSED';
    notes?: string;
}

// ============================================
// REPAYMENT REQUEST TYPES
// ============================================

export interface CreateRepaymentRequest extends RepaymentCreateInput {}

// ============================================
// EXPENSE REQUEST TYPES
// ============================================

export interface CreateExpenseRequest extends ExpenseCreateInput {}

// ============================================
// BILL REQUEST TYPES
// ============================================

export interface CreateBillRequest extends BillCreateInput {}