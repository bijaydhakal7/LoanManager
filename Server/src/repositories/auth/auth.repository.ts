import type { User } from "@prisma/client";
import prisma from "../../lib/prisma.js";

export const authRepository = {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser(data: { name: string; email: string; password: string }): Promise<User> {
    return prisma.user.create({ data });
  },
  incrementTokenVersion(userId: number) {
    return prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } as any } as any });
  },
};
