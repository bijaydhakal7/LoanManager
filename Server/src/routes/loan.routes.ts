import { Router } from "express";
import {
  closeLoan,
  createLoan,
  createRepayment,
  getLoansDashboard,
  getLoanById,
  listLoans,
  listRepayments,
  updateLoan,
} from "../controllers/loan.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createLoanSchema,
  createRepaymentSchema,
  getLoanByIdSchema,
  listLoansSchema,
  updateLoanSchema,
} from "../validators/loan.validator.js";

const loanRouter = Router();

loanRouter.use(authMiddleware);

loanRouter.post("/", validate(createLoanSchema), createLoan);
loanRouter.get("/", validate(listLoansSchema), listLoans);
loanRouter.get("/dashboard", getLoansDashboard);
loanRouter.get("/:id", validate(getLoanByIdSchema), getLoanById);
loanRouter.put("/:id", validate(updateLoanSchema), updateLoan);
loanRouter.delete("/:id", validate(getLoanByIdSchema), closeLoan);
loanRouter.post("/:id/payments", validate(createRepaymentSchema), createRepayment);
loanRouter.get("/:id/payments", validate(getLoanByIdSchema), listRepayments);

export default loanRouter;
