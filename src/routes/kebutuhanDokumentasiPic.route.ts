import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole, Status } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import {
  CreateKebutuhanDokumentasiPicRequestType,
  UpdateKebutuhanDokumentasiPicRequestType,
} from "../models/kebutuhanDokumentasiPic.model";
import { KebutuhanDokumentasiPicValidation } from "../validations/kebutuhanDokumentasiPic.validation";
import { KebutuhanDokumentasiPicController } from "../controllers/kebutuhanDokumentasiPic.controller";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { zodValidationParams } from "../middlewares/validationParams.middleware";

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

// update
kebutuhanDokumentasiPicRoute.patch(
  "/:kebutuhan_dokumentasi_pic_id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationParams<{ kebutuhan_dokumentasi_pic_id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS_UPDATE,
  ),
  zodValidation<UpdateKebutuhanDokumentasiPicRequestType>(
    KebutuhanDokumentasiPicValidation.UPDATE,
  ),
  KebutuhanDokumentasiPicController.update,
);

// find all by kriteria pic
kebutuhanDokumentasiPicRoute.get(
  "/by-kriteria-pic",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiPicValidation.QUERY,
  ),
  KebutuhanDokumentasiPicController.findAllByKriteriaPic,
);

// find all by kriteria pic
kebutuhanDokumentasiPicRoute.get(
  "/:kriteria_id/:pendekatan_id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{ kriteria_id: number; pendekatan_id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS,
  ),
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiPicValidation.QUERY,
  ),
  KebutuhanDokumentasiPicController.findAllByKriteriaPendekatan,
);

export default kebutuhanDokumentasiPicRoute;
