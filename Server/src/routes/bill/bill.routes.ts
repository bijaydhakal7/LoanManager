import { Router } from "express";
import {
  createBill,
  deleteBill,
  listBills,
  payBill,
  updateBill,
} from "../../controllers/bill/bill.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { billIdSchema, createBillSchema } from "../../validators/bill.validator.js";

const billRouter = Router();

billRouter.use(authMiddleware);

billRouter.post("/", validate(createBillSchema), createBill);
billRouter.get("/", listBills);
billRouter.put("/:id/pay", validate(billIdSchema), payBill);
billRouter.delete("/:id", validate(billIdSchema), deleteBill);
billRouter.put("/:id", validate(billIdSchema), updateBill);

export default billRouter;
