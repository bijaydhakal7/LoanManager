import { Router } from "express";
import {
  calculateEmiController,
  myEmisController,
  upcomingEmisController,
} from "../../controllers/emi/emi.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { calculateEmiSchema } from "../../validators/emi.validator.js";

const emiRouter = Router();

emiRouter.post("/calculate", validate(calculateEmiSchema), calculateEmiController);
emiRouter.get("/my", authMiddleware, myEmisController);
emiRouter.get("/upcoming", authMiddleware, upcomingEmisController);

export default emiRouter;
