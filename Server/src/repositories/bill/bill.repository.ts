import type { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const billRepository = {
  createBill(data: Prisma.BillUncheckedCreateInput) {
    return prisma.bill.create({ data });
  },

  listBills(userId: number) {
    return prisma.bill.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });
  },

  getBillById(userId: number, id: number) {
    return prisma.bill.findFirst({ where: { id, userId } });
  },

  updateBill(id: number, data: Prisma.BillUpdateInput) {
    return prisma.bill.update({ where: { id }, data });
  },

  deleteBill(id: number) {
    return prisma.bill.delete({ where: { id } });
  },
};
