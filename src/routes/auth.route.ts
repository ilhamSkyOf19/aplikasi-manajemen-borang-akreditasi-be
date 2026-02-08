import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateUserType, LoginUserType } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";

const authRoute: Router = Router();

// login
authRoute.post(
  "/login",
  zodValidation<LoginUserType>(UserValidation.LOGIN),
  AuthController.login,
);

// register
authRoute.post(
  "/register",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateUserType>(UserValidation.CREATE),
  AuthController.register,
);

// me
authRoute.get("/me", authMiddleware, AuthController.me);

// logout
authRoute.post("/logout", authMiddleware, AuthController.logout);

export default authRoute;
