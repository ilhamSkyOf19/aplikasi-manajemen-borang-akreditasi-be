import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import {
  CreateDosenType,
  LoginDosenType,
  UpdatePasswordType,
} from "../models/dosen.model";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import LimiterMiddleware from "../middlewares/limiter.middleware";
import { DosenValidation } from "../validations/dosen.validation";
import { DosenRole } from "../utils/contstanst";

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
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreateDosenType>(DosenValidation.CREATE),
  AuthController.register,
);

// update password
authRoute.put(
  "/update-password",
  authMiddleware,
  zodValidation<UpdatePasswordType>(DosenValidation.UPDATE_PASSWORD),
  AuthController.updatePassword,
);

// // me
authRoute.get("/me", authMiddleware, AuthController.me);

// switch
authRoute.post(
  "/switch-role",
  authMiddleware,
  zodValidation<{ role: DosenRole }>(DosenValidation.SWITCH_ROLE),
  AuthController.switchRole,
);

// // logout
authRoute.post("/logout", authMiddleware, AuthController.logout);

export default authRoute;
