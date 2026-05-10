import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { VerifikasiValidation } from "../validations/verifikasi.validation";
import { VerifikasiController } from "../controllers/verifikasi.controller";
import { VerifikasiDokumentasiBorangType } from "../models/dokumentasiBorang.model";
import {
  VerifikasiType,
  VerifikasiUpdateType,
} from "../models/verifikasi.model";
import { zodValidationParams } from "../middlewares/validationParams.middleware";

const verifikasiRoute: Router = Router();

// verifikasi kebutuhan dokumentasi pic
verifikasiRoute.post(
  "/kebutuhan-dokumentasi-pic",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<VerifikasiType>(VerifikasiValidation.VERIFIKASI),
  VerifikasiController.verifikasi,
);

verifikasiRoute.post(
  "/dokumentasi-borang",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidation<VerifikasiType>(VerifikasiValidation.VERIFIKASI),
  VerifikasiController.verifikasi,
);

// update verifikasi kebutuhan dokumentasi pic
verifikasiRoute.patch(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidationParams<{ id: number }>(VerifikasiValidation.PARAMS_ID),
  zodValidation<VerifikasiUpdateType>(VerifikasiValidation.UPDATE_VERIFIKASI),
  VerifikasiController.updateVerifikasi,
);

export default verifikasiRoute;
