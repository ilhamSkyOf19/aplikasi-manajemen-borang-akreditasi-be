import { Router } from "express";
import { DosenController } from "../controllers/dosen.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateDosenType } from "../models/dosen.model";
import { DosenValidation } from "../validations/dosen.validation";

const dosenRoute: Router = Router();

// find all
dosenRoute.get(
  "/",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  DosenController.findAll,
);

// // read by id
// dosenRoute.get(
//   "/:id",
//   [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
//   UserController.readById,
// );

// // update dosen
dosenRoute.patch(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateDosenType>(DosenValidation.UPDATE),
  DosenController.update,
);

// // delete
dosenRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  DosenController.delete,
);

export default dosenRoute;
