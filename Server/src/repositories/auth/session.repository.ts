import prisma from "../../lib/prisma.js";

export const sessionRepository = {
  createSession(data: {
    userId: number;
    sid: string;
    familyId: string;
    tokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return prisma.authSession.create({ data });
  },

  findByTokenHash(tokenHash: string) {
    return prisma.authSession.findUnique({ where: { tokenHash } });
  },

  findActiveByUser(userId: number) {
    return prisma.authSession.findMany({ where: { userId, status: "ACTIVE" }, orderBy: { updatedAt: "desc" } });
  },

  findBySid(userId: number, sid: string) {
    return prisma.authSession.findFirst({ where: { userId, sid } });
  },

  revokeByTokenHash(tokenHash: string) {
    return prisma.authSession.updateMany({ where: { tokenHash }, data: { status: "REVOKED", revokedAt: new Date() } as any });
  },

  revokeBySid(userId: number, sid: string) {
    return prisma.authSession.updateMany({
      where: { userId, sid, status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: new Date() } as any,
    });
  },

  revokeAllByUser(userId: number) {
    return prisma.authSession.updateMany({ where: { userId }, data: { status: "REVOKED", revokedAt: new Date() } as any });
  },

  markReplaced(oldHash: string, newHash: string) {
    return prisma.authSession.updateMany({ where: { tokenHash: oldHash }, data: { status: "REPLACED", replacedBy: newHash, revokedAt: new Date() } as any });
  },
};
