import { Router } from "express";
import { login, profile, register, refresh, logout, logoutAll } from "../../controllers/auth/auth.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { csrfMiddleware } from "../../middlewares/csrf.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "../../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", authMiddleware, profile);
authRouter.post("/refresh", csrfMiddleware, refresh);
authRouter.post("/logout", csrfMiddleware, logout);
authRouter.post("/logout-all", authMiddleware, csrfMiddleware, logoutAll);

export default authRouter;
