"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Bill } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const createBillColumns = (
  onPay: (billId: number) => void,
  onDelete: (bill: Bill) => void,
): ColumnDef<Bill>[] => [
  {
    accessorKey: "name",
    header: "Bill",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900">{row.original.name}</span>
        <span className="text-xs text-slate-500">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span className="text-sm font-medium">{formatCurrency(row.original.amount)}</span>,
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => <span className="text-sm">{formatDate(row.original.dueDate)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === "PAID" ? "success" : status === "OVERDUE" ? "danger" : "secondary";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={row.original.status === "PAID"}
          onClick={() => onPay(row.original.id)}
        >
          Mark Paid
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
          Delete
        </Button>
      </div>
    ),
  },
];
