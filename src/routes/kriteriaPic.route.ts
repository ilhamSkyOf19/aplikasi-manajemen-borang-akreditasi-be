import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import {
  CreateKriteriaPicType,
  UpdateKriteriaPicType,
} from "../models/kriteriaPic.model";
import { KriteriaPicValidation } from "../validations/kriteriaPic.validation";
import { KriteriaPicController } from "../controllers/kriteriaPic.controller";

const kriteriaPicRouter: Router = Router();

// create
kriteriaPicRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreateKriteriaPicType>(KriteriaPicValidation.CREATE),
  KriteriaPicController.create,
);

// find all
kriteriaPicRouter.get("/", [authMiddleware], KriteriaPicController.findAll);

// update
kriteriaPicRouter.patch(
  "/:kriteria_id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<UpdateKriteriaPicType>(KriteriaPicValidation.UPDATE),
  KriteriaPicController.update,
);

// delete
kriteriaPicRouter.delete(
  "/:kriteria_id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  KriteriaPicController.delete,
);

export default kriteriaPicRouter;
