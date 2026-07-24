"use client";

import { useMemo, useState } from "react";
import { useLoans } from "@/features/loans/loan-queries";
import { DataTable } from "@/components/data-table";
import { createLoanColumns } from "@/features/loans/loan-columns";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { LoanForm } from "@/features/loans/loan-form";
import { useDeleteLoan } from "@/features/loans/loan-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { toast } from "sonner";
import type { Loan, LoanStatus, LoanType } from "@/lib/types";

const PAGE_SIZES = [5, 10, 20];

export const LoanView = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editLoan, setEditLoan] = useState<Loan | null>(null);
  const [deleteLoan, setDeleteLoan] = useState<Loan | null>(null);
  const [type, setType] = useState<LoanType | "ALL">("ALL");
  const [status, setStatus] = useState<LoanStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const debouncedSearch = useDebounce(search, 350);
  const deleteMutation = useDeleteLoan();

  const { data, isLoading } = useLoans({
    type: type === "ALL" ? undefined : type,
    status: status === "ALL" ? undefined : status,
  });

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (!debouncedSearch) return list;
    const query = debouncedSearch.toLowerCase();
    return list.filter((loan) => loan.counterpartyName.toLowerCase().includes(query));
  }, [data, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = useMemo(
    () =>
      createLoanColumns(
        (loan) => setEditLoan(loan),
        (loan) => setDeleteLoan(loan),
      ),
    [],
  );

  const handleDelete = async () => {
    if (!deleteLoan) return;
    try {
      await deleteMutation.mutateAsync(deleteLoan.id);
      toast.success("Loan deleted");
      setDeleteLoan(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete loan"));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader
          title="Loans"
          description="Track active, closed, and overdue loans across your network."
        />

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Loan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create loan</DialogTitle>
              <DialogDescription>Add a new given/taken loan entry.</DialogDescription>
            </DialogHeader>
            <LoanForm variant="dialog" onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr]">
        <Input
          placeholder="Search by counterparty"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <Select
          value={type}
          onChange={(event) => {
            setType(event.target.value as LoanType | "ALL");
            setPage(1);
          }}
        >
          <option value="ALL">All Types</option>
          <option value="GIVEN">Given</option>
          <option value="TAKEN">Taken</option>
        </Select>
        <Select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as LoanStatus | "ALL");
            setPage(1);
          }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CLOSED">Closed</option>
        </Select>
        <Select
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </Select>
      </div>

      <DataTable columns={columns} data={paginated} isLoading={isLoading} emptyMessage="No loans yet. Create a loan to get started." />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
      />

      <Dialog open={Boolean(editLoan)} onOpenChange={(open) => !open && setEditLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit loan</DialogTitle>
            <DialogDescription>Update loan details.</DialogDescription>
          </DialogHeader>
          {editLoan ? (
            <LoanForm
              variant="dialog"
              mode="edit"
              initialValues={{
                id: editLoan.id,
                type: editLoan.type,
                counterpartyName: editLoan.counterpartyName,
                amount: editLoan.amount,
                interestRate: editLoan.interestRate,
                startDate: editLoan.startDate,
                dueDate: editLoan.dueDate ?? "",
                status: editLoan.status,
              }}
              onSuccess={() => setEditLoan(null)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteLoan)} onOpenChange={(open) => !open && setDeleteLoan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete loan</DialogTitle>
            <DialogDescription>
              This will permanently remove the loan. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteLoan(null)}>
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
