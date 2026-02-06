import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateUserType } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";

const authRoute: Router = Router();

// register
authRoute.post(
  "/register",
  zodValidation<CreateUserType>(UserValidation.CREATE),
  AuthController.register,
);

export default authRoute;
