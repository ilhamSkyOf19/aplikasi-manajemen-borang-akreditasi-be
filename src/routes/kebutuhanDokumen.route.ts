import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { KebutuhanDokumenController } from "../controllers/kebutuhanDokumen.controller";
import {
  CreateKebutuhanDokumenType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { KebutuhanDokumenValidation } from "../validations/kebutuhanDokumen.validation";

const kebutuhanDokumenRoute: Router = Router();

// read all
kebutuhanDokumenRoute.get(
  "/read-all",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  KebutuhanDokumenController.readAll,
);

// read choose
kebutuhanDokumenRoute.get(
  "/read-choose",
  [authMiddleware, aclMiddleware(["kaprodi", "wakil_dekan_1"])],
  KebutuhanDokumenController.readChoose,
);

// read by id
kebutuhanDokumenRoute.get(
  "/read-by-id/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  KebutuhanDokumenController.readById,
);

// create
kebutuhanDokumenRoute.post(
  "/create",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<CreateKebutuhanDokumenType>(KebutuhanDokumenValidation.CREATE),
  KebutuhanDokumenController.create,
);

// update
kebutuhanDokumenRoute.patch(
  "/update/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<UpdateKebutuhanDokumenType>(KebutuhanDokumenValidation.UPDATE),
  KebutuhanDokumenController.update,
);

// delete
kebutuhanDokumenRoute.delete(
  "/delete/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  KebutuhanDokumenController.delete,
);

export default kebutuhanDokumenRoute;
