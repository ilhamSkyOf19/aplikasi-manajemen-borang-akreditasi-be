import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateKebutuhanDokumentasiPicRequestType } from "../models/kebutuhanDokumentasiPic.model";
import { KebutuhanDokumentasiPicValidation } from "../validations/kebutuhanDokumentasiPic.validation";
import { KebutuhanDokumentasiPicController } from "../controllers/kebutuhanDokumentasiPic.controller";

const kebutuhanDokumentasiPicRoute: Router = Router();

// create
kebutuhanDokumentasiPicRoute.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidation<CreateKebutuhanDokumentasiPicRequestType>(
    KebutuhanDokumentasiPicValidation.CREATE,
  ),
  KebutuhanDokumentasiPicController.create,
);

export default kebutuhanDokumentasiPicRoute;
