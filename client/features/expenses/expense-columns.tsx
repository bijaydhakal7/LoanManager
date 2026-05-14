"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const createExpenseColumns = (
  onEdit: (expense: Expense) => void,
  onDelete: (expense: Expense) => void,
): ColumnDef<Expense>[] => [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">
          {row.original.description || "Expense"}
        </span>
        <span className="text-xs text-slate-500">{formatDate(row.original.expenseDate)}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
          Delete
        </Button>
      </div>
    ),
  },
];
