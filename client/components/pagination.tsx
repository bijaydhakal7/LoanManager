import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export const Pagination = ({ page, totalPages, onPrev, onNext }: PaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={onNext} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </div>
  );
};
