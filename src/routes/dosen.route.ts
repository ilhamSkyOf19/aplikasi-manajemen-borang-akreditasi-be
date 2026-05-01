import { Router } from "express";
import { DosenController } from "../controllers/dosen.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateDosenType } from "../models/dosen.model";
import { DosenValidation } from "../validations/dosen.validation";
import { DosenRole } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { zodValidationParams } from "../middlewares/validationParams.middleware";

const dosenRoute: Router = Router();

// find all
dosenRoute.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationQuery<PaginationType & { role?: DosenRole }>(
    DosenValidation.QUERY_PARAMS,
  ),
  DosenController.findAll,
);

// // read by id
dosenRoute.get(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(DosenValidation.PARAMS_ID),
  DosenController.findById,
);

// // update dosen
dosenRoute.patch(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(DosenValidation.PARAMS_ID),
  zodValidation<UpdateDosenType>(DosenValidation.UPDATE),
  DosenController.update,
);

// // delete
dosenRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(DosenValidation.PARAMS_ID),
  DosenController.delete,
);

export default dosenRoute;
