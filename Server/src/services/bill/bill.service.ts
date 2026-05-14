import type { BillCategory, BillRecurrence } from "@prisma/client";
import { billRepository } from "../../repositories/bill/bill.repository.js";
import { AppError } from "../../utils/appError.js";
import { toNumber } from "../../utils/number.js";

export const billService = {
  async createBill(input: {
    userId: number;
    name: string;
    amount: number;
    dueDate: string;
    recurrence?: BillRecurrence;
    category?: BillCategory;
  }) {
    const dueDate = new Date(input.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      throw new AppError("Invalid due date", 400);
    }

    const bill = await billRepository.createBill({
      userId: input.userId,
      name: input.name,
      amount: input.amount,
      dueDate,
      recurrence: input.recurrence,
      category: input.category,
    });

    return {
      ...bill,
      amount: toNumber(bill.amount),
    };
  },

  async listBills(userId: number) {
    const bills = await billRepository.listBills(userId);
    return bills.map((bill) => ({
      ...bill,
      amount: toNumber(bill.amount),
    }));
  },

  async payBill(userId: number, billId: number) {
    const existing = await billRepository.getBillById(userId, billId);
    if (!existing) {
      throw new AppError("Bill not found", 404);
    }

    const updated = await billRepository.updateBill(billId, {
      status: "PAID",
      paidDate: new Date(),
    });

    return {
      ...updated,
      amount: toNumber(updated.amount),
    };
  },

  async deleteBill(userId: number, billId: number) {
    const existing = await billRepository.getBillById(userId, billId);
    if (!existing) {
      throw new AppError("Bill not found", 404);
    }

    await billRepository.deleteBill(billId);
    return { id: billId };
  },


async updateBill(userId: number, billId: number, data: { name?: string; amount?: number; dueDate?: string; recurrence?: BillRecurrence; category?: BillCategory }) {
    const existing = await billRepository.getBillById(userId, billId);  
    if (!existing) {
      throw new AppError("Bill not found", 404);
    }

    const updateData: { name?: string; amount?: number; dueDate?: Date; recurrence?: BillRecurrence; category?: BillCategory } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.dueDate !== undefined) {
      const dueDate = new Date(data.dueDate);
      if (Number.isNaN(dueDate.getTime())) {
        throw new AppError("Invalid due date", 400);
      }
      updateData.dueDate = dueDate;
    }
    if (data.recurrence !== undefined) updateData.recurrence = data.recurrence;
    if (data.category !== undefined) updateData.category = data.category;

    const updated = await billRepository.updateBill(billId, updateData);

    return {
      ...updated,
      amount: toNumber(updated.amount),
    };
  }

}; 
