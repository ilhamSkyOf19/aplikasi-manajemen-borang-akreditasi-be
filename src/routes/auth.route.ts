import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateDosenType, LoginDosenType } from "../models/dosen.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import LimiterMiddleware from "../middlewares/limiter.middleware";
import { DosenValidation } from "../validations/dosen.validation";

const authRoute: Router = Router();

// // login
authRoute.post(
  "/login",
  LimiterMiddleware.login(),
  zodValidation<LoginDosenType>(DosenValidation.LOGIN),
  AuthController.login,
);

// register
authRoute.post(
  "/register",
  // [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateDosenType>(DosenValidation.CREATE),
  AuthController.register,
);

// // me
// authRoute.get("/me", authMiddleware, AuthController.me);

// // logout
// authRoute.post("/logout", authMiddleware, AuthController.logout);

export default authRoute;
