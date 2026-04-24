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

const kriteriaRouter: Router = Router();

// find all
kriteriaRouter.get(
  "/",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  KriteriaController.findAll,
);

// read by id
kriteriaRouter.get(
  "/:id",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  KriteriaController.findById,
);

// create
kriteriaRouter.post(
  "/",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateKriteriaType>(KriteriaValidation.CREATE),
  KriteriaController.create,
);

// // update
kriteriaRouter.patch(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateKriteriaType>(KriteriaValidation.UPDATE),
  KriteriaController.update,
);

// // delete
kriteriaRouter.delete(
  "/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  KriteriaController.delete,
);

export default kriteriaRouter;
