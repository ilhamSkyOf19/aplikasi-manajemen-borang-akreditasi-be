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

// read all
kriteriaRouter.get(
  "/read-all",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  KriteriaController.readAll,
);

// read by id
kriteriaRouter.get(
  "/read-by-id/:id",
  [
    authMiddleware,
    aclMiddleware(["wakil_dekan_1", "kaprodi", "tim_akreditasi"]),
  ],
  KriteriaController.readById,
);

// create
kriteriaRouter.post(
  "/create",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<CreateKriteriaType>(KriteriaValidation.CREATE),
  KriteriaController.create,
);

// update
kriteriaRouter.patch(
  "/update/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateKriteriaType>(KriteriaValidation.UPDATE),
  KriteriaController.update,
);

// delete
kriteriaRouter.delete(
  "/delete/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  KriteriaController.delete,
);

export default kriteriaRouter;
