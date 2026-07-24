import { Router } from "express";
import authRouter from "./auth.routes.js";
import loanRouter from "./loan.routes.js";
import interestRouter from "./interest.routes.js";
import dashboardRouter from "./dashboard.routes.js";
import expenseRouter from "./expense.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/loans", loanRouter);
apiRouter.use("/interest", interestRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/expenses", expenseRouter);

export default apiRouter;
