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
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { PaginationType } from "../types/pagination";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";

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
  zodValidationQuery<PaginationType>(KriteriaValidation.QUERY),
  KriteriaController.findAll,
);

// find all with pic
kriteriaRouter.get(
  "/with-pic",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
  ],
  zodValidationQuery<PaginationType>(KriteriaValidation.QUERY),
  KriteriaController.findAllWithPic,
);

// find all for choose
kriteriaRouter.get(
  "/for-choose",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
  ],
  KriteriaController.findAllForChoose,
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
  zodValidationParams<{ id: number }>(KriteriaValidation.PARAMS_ID),
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
  zodValidationParams<{ id: number }>(KriteriaValidation.PARAMS_ID),
  zodValidation<UpdateKriteriaType>(KriteriaValidation.UPDATE),
  KriteriaController.update,
);

// // delete
kriteriaRouter.delete(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(KriteriaValidation.PARAMS_ID),
  KriteriaController.delete,
);

export default kriteriaRouter;
