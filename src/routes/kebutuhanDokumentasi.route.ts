import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole, Status } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { distribusiMiddleware } from "../middlewares/distribusi.middleware";
import {
  CreateKebutuhanDokumentasiRequestType,
  UpdateKebutuhanDokumentasiRequestType,
} from "../models/kebutuhanDokumentasi.model";
import { KebutuhanDokumentasiValidation } from "../validations/kebutuhanDokumentasi.validation";
import { KebutuhanDokumentasiController } from "../controllers/kebutuhanDokumentasi.controller";

const kebutuhanDokumentasiRoute: Router = Router();

// create
kebutuhanDokumentasiRoute.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidation<CreateKebutuhanDokumentasiRequestType>(
    KebutuhanDokumentasiValidation.CREATE,
  ),
  KebutuhanDokumentasiController.create,
);

// update
kebutuhanDokumentasiRoute.patch(
  "/:kebutuhan_dokumentasi_pic_id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationParams<{ kebutuhan_dokumentasi_pic_id: number }>(
    KebutuhanDokumentasiValidation.PARAMS_UPDATE,
  ),
  zodValidation<UpdateKebutuhanDokumentasiRequestType>(
    KebutuhanDokumentasiValidation.UPDATE,
  ),
  KebutuhanDokumentasiController.update,
);

// find all
kebutuhanDokumentasiRoute.get(
  "/by-kriteria-pic",
  [
    authMiddleware,
    aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1]),
    periodeMiddleware,
  ],
  zodValidationQuery<Omit<PaginationType, "sort">>(
    KebutuhanDokumentasiValidation.QUERY_NON_STATUS,
  ),
  KebutuhanDokumentasiController.findAllByKriteriaPic,
);

// find all
kebutuhanDokumentasiRoute.get(
  "/by-kriteria/:kriteria_id/pendekatan/:pendekatan_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1]),
    periodeMiddleware,
  ],
  zodValidationParams<{
    kriteria_id: number;
    pendekatan_id: number;
  }>(KebutuhanDokumentasiValidation.PARAMS),
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiValidation.QUERY,
  ),
  KebutuhanDokumentasiController.findAllByKriteriaPendekatan,
);

// find all by dosen id
kebutuhanDokumentasiRoute.get(
  "/for-dokumentasi-borang",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
    periodeMiddleware,
  ],
  zodValidationQuery<PaginationType>(
    KebutuhanDokumentasiValidation.QUERY_NON_STATUS,
  ),
  KebutuhanDokumentasiController.findAllForDokumentasiBorang,
);

// find all
kebutuhanDokumentasiRoute.get(
  "/for-dokumentasi-borang/by-kriteria/:kriteria_id/pendekatan/:pendekatan_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
  ],
  zodValidationParams<{
    kriteria_id: number;
    pendekatan_id: number;
  }>(KebutuhanDokumentasiValidation.PARAMS),
  zodValidationQuery<PaginationType & { status?: Status }>(
    KebutuhanDokumentasiValidation.QUERY,
  ),
  KebutuhanDokumentasiController.findAllForDokumentasiBorangByKriteriaPendekatan,
);

// find all
kebutuhanDokumentasiRoute.get(
  "/for-dokumentasi-borang-complated/by-kriteria/:kriteria_id/pendekatan/:pendekatan_id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  zodValidationParams<{
    kriteria_id: number;
    pendekatan_id: number;
  }>(KebutuhanDokumentasiValidation.PARAMS),
  zodValidationQuery<PaginationType>(KebutuhanDokumentasiValidation.QUERY),
  KebutuhanDokumentasiController.findAllForDokumentasiBorangComplated,
);

// find by id
kebutuhanDokumentasiRoute.get(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(KebutuhanDokumentasiValidation.PARAMS_ID),
  KebutuhanDokumentasiController.findById,
);

// delete
kebutuhanDokumentasiRoute.delete(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationParams<{ id: number }>(KebutuhanDokumentasiValidation.PARAMS_ID),
  KebutuhanDokumentasiController.delete,
);

export default kebutuhanDokumentasiRoute;
