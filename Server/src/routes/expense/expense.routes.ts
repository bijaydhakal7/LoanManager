import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from "../../controllers/expense/expense.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createExpenseSchema,
  expenseIdSchema,
  listExpensesSchema,
  updateExpenseSchema,
} from "../../validators/expense.validator.js";

const expenseRouter = Router();

expenseRouter.use(authMiddleware);

expenseRouter.post("/", validate(createExpenseSchema), createExpense);
expenseRouter.get("/", validate(listExpensesSchema), listExpenses);
expenseRouter.put("/:id", validate(updateExpenseSchema), updateExpense);
expenseRouter.delete("/:id", validate(expenseIdSchema), deleteExpense);

export default expenseRouter;
