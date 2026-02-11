import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";

const userRoute: Router = Router();

// find all
userRoute.get(
  "/read-all",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  AuthController.readAll,
);

export default userRoute;
