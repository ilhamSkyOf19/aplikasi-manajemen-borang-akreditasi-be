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

// find all
kebutuhanDokumentasiPicRoute.get(
  "/by-kriteria-pic",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationQuery<PaginationType>(
    KebutuhanDokumentasiPicValidation.QUERY_NON_STATUS,
  ),
  KebutuhanDokumentasiPicController.findAllByKriteriaPic,
);

// find all by dosen id
kebutuhanDokumentasiPicRoute.get(
  "/for-dokumentasi-borang",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationQuery<PaginationType>(
    KebutuhanDokumentasiPicValidation.QUERY_NON_STATUS,
  ),
  KebutuhanDokumentasiPicController.findAllForDokumentasiBorangByDosen,
);

// find all by kaprodi
kebutuhanDokumentasiPicRoute.get(
  "/for-dokumentasi-borang/by-kaprodi",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationQuery<PaginationType>(
    KebutuhanDokumentasiPicValidation.QUERY_NON_STATUS,
  ),
  KebutuhanDokumentasiPicController.findAllForDokumentasiBorangByKaprodi,
);

// find all
kebutuhanDokumentasiPicRoute.get(
  "/by-kriteria/:kriteria_id/pendekatan/:pendekatan_id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{ kriteria_id: number; pendekatan_id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS,
  ),
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiPicValidation.QUERY,
  ),
  KebutuhanDokumentasiPicController.findAllByKriteriaPendekatan,
);

// find all
kebutuhanDokumentasiPicRoute.get(
  "/for-dokumentasi-borang/by-kriteria/:kriteria_id/pendekatan/:pendekatan_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
  ],
  zodValidationParams<{ kriteria_id: number; pendekatan_id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS,
  ),
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiPicValidation.QUERY,
  ),
  KebutuhanDokumentasiPicController.findAllForDokumentasiBorangByKriteriaPendekatan,
);

// find by id
kebutuhanDokumentasiPicRoute.get(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS_ID,
  ),
  KebutuhanDokumentasiPicController.findById,
);

// delete
kebutuhanDokumentasiPicRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationParams<{ id: number }>(
    KebutuhanDokumentasiPicValidation.PARAMS_ID,
  ),
  KebutuhanDokumentasiPicController.delete,
);

export default kebutuhanDokumentasiPicRoute;
