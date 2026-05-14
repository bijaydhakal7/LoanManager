"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Loan } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const createLoanColumns = (
  onEdit: (loan: Loan) => void,
  onDelete: (loan: Loan) => void,
): ColumnDef<Loan>[] => [
  {
    accessorKey: "counterpartyName",
    header: "Counterparty",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">{row.original.counterpartyName}</span>
        <span className="text-xs text-slate-500">{row.original.type}</span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Principal",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>,
  },
  {
    accessorKey: "remainingBalance",
    header: "Remaining",
    cell: ({ row }) => <span className="text-sm">{formatCurrency(row.original.remainingBalance)}</span>,
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.dueDate ?? "")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "ACTIVE" ? "success" : status === "OVERDUE" ? "danger" : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
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
