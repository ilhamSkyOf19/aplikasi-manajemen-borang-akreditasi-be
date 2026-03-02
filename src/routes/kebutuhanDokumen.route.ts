import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { kebutuhanDokumenController } from "../controllers/kebutuhanDokumen.controller";
import {
  CreateKebutuhanDokumenType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { KebutuhanDokumenValidation } from "../validations/kebutuhanDokumen.validation";
import { UpdateStatusType } from "../models/status.model";
import { StatusValidation } from "../validations/status.validation";

const kebutuhanDokumenRoute: Router = Router();

// read all
kebutuhanDokumenRoute.get(
  "/read-all",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  kebutuhanDokumenController.readAll,
);

// read choose
kebutuhanDokumenRoute.get(
  "/read-choose",
  [authMiddleware, aclMiddleware(["kaprodi", "wakil_dekan_1"])],
  kebutuhanDokumenController.readChoose,
);

// read by id
kebutuhanDokumenRoute.get(
  "/read-by-id/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  kebutuhanDokumenController.readById,
);

// create
kebutuhanDokumenRoute.post(
  "/create",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<CreateKebutuhanDokumenType>(KebutuhanDokumenValidation.CREATE),
  kebutuhanDokumenController.create,
);

// update
kebutuhanDokumenRoute.patch(
  "/update/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<UpdateKebutuhanDokumenType>(KebutuhanDokumenValidation.UPDATE),
  kebutuhanDokumenController.update,
);

// delete
kebutuhanDokumenRoute.delete(
  "/delete/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  kebutuhanDokumenController.delete,
);

export default kebutuhanDokumenRoute;
