import { Router } from "express";
import { KriteriaController } from "../controllers/kriteria.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { KriteriaValidation } from "../validations/kriteria.validation";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";

const kriteriaRouter: Router = Router();

// find all
kriteriaRouter.get(
  "/",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
  ],
  KriteriaController.findAll,
);

// read by id
kriteriaRouter.get(
  "/:id",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
  ],
  KriteriaController.findById,
);

// create
kriteriaRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreateKriteriaType>(KriteriaValidation.CREATE),
  KriteriaController.create,
);

// // update
kriteriaRouter.patch(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<UpdateKriteriaType>(KriteriaValidation.UPDATE),
  KriteriaController.update,
);

// // delete
kriteriaRouter.delete(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  KriteriaController.delete,
);

export default kriteriaRouter;
