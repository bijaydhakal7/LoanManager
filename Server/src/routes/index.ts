import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import loanRouter from "./loan/loan.routes.js";
import emiRouter from "./emi/emi.routes.js";
import dashboardRouter from "./dashboard/dashboard.routes.js";
import expenseRouter from "./expense/expense.routes.js";
import billRouter from "./bill/bill.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/loans", loanRouter);
apiRouter.use("/emi", emiRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/bills", billRouter);

export default apiRouter;
