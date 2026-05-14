"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useBills } from "@/features/bills/bill-queries";
import { DataTable } from "@/components/data-table";
import { createBillColumns } from "@/features/bills/bill-columns";
import { PageHeader } from "@/components/page-header";
import { BillForm } from "@/features/bills/bill-form";
import { useDeleteBill, usePayBill } from "@/features/bills/bill-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Bill } from "@/lib/types";

export const BillView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteBill, setDeleteBill] = useState<Bill | null>(null);
  const { data, isLoading } = useBills();
  const payBill = usePayBill();
  const deleteMutation = useDeleteBill();

  const columns = createBillColumns(
    async (billId) => {
      try {
        await payBill.mutateAsync(billId);
        toast.success("Bill marked as paid");
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Failed to update bill"));
      }
    },
    (bill) => setDeleteBill(bill),
  );

  const handleDelete = async () => {
    if (!deleteBill) return;
    try {
      await deleteMutation.mutateAsync(deleteBill.id);
      toast.success("Bill deleted");
      setDeleteBill(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete bill"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Bills" description="Manage recurring bills and payment status." />
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Bill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add bill</DialogTitle>
              <DialogDescription>Create a bill and track its status.</DialogDescription>
            </DialogHeader>
            <BillForm variant="dialog" onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        emptyMessage="No bills available yet."
      />

      <Dialog open={Boolean(deleteBill)} onOpenChange={(open) => !open && setDeleteBill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete bill</DialogTitle>
            <DialogDescription>
              This will permanently remove the bill. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteBill(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
