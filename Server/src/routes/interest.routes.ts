import { Router } from "express";
import { calculateInterestController } from "../controllers/interest.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { calculateInterestSchema } from "../validators/interest.validator.js";

const interestRouter = Router();

interestRouter.post("/calculate", validate(calculateInterestSchema), calculateInterestController);

export default interestRouter;
