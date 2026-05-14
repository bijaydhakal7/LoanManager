import type { Prisma } from "@prisma/client";

export const toNumber = (value: Prisma.Decimal | number | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return Number(value.toFixed(2));
  }

  return Number(value.toFixed(2));
};

export const round2 = (value: number): number => Number(value.toFixed(2));
