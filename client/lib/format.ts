import { env } from "@/lib/config";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: env.currency,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number | string | null | undefined) => {
  const amount = typeof value === "string" ? Number(value) : value ?? 0;
  if (Number.isNaN(amount)) return "-";
  return currencyFormatter.format(amount);
};

export const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};
