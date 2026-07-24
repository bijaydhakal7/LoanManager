-- Drop the Bill feature entirely (replaced by a lighter expense tracker)
DROP TABLE IF EXISTS "Bill";
DROP TYPE IF EXISTS "BillRecurrence";
DROP TYPE IF EXISTS "BillCategory";
DROP TYPE IF EXISTS "BillStatus";

-- EMI amortization is replaced by the interest calculator; drop the field
ALTER TABLE "Loan" DROP COLUMN IF EXISTS "emiAmount";
