import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateUserType } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";

const userRoute: Router = Router();

// find all
userRoute.get(
  "/",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  UserController.readAll,
);

// read by id
userRoute.get(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  UserController.readById,
);

// update user
userRoute.patch(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateUserType>(UserValidation.UPDATE),
  UserController.update,
);

// delete
userRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  UserController.delete,
);

export default userRoute;
