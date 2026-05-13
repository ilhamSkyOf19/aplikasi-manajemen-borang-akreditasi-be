import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FileService } from "../services/file.service";
import { DokumentasiBorangController } from "../controllers/dokumentasiBorang.controller";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { DokumentasiBorangValidation } from "../validations/dokumentasiBorang.validationn";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { AjukanRequestType } from "../models/dokumentasiBorang.model";

const dokumentasiBorangRoute: Router = Router();

// file upload
const upload = FileService.uploadFile({
  allowedMimeTypes: /pdf/,
});

// default
dokumentasiBorangRoute.post(
  "/default",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  upload.single("dokumentasi"),
  DokumentasiBorangController.createDokumentasiBorangDefault,
);

// penelitian
dokumentasiBorangRoute.post(
  "/penelitian",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  upload.single("dokumentasi"),
  DokumentasiBorangController.createDokumentasiBorangPenelitian,
);

// find

// gunakan pada detail
dokumentasiBorangRoute.get(
  "/by-kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.tim_akreditasi,
      DosenRole.kaprodi,
      DosenRole.wakil_dekan_1,
    ]),
  ],
  zodValidationParams<{
    kebutuhan_dokumentasi_id: number;
  }>(DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID),
  DokumentasiBorangController.findByKebutuhanDokumentasiId,
);

// ajukan
dokumentasiBorangRoute.post(
  "/:dokumentasi_borang_id/ajukan",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ dokumentasi_borang_id: number }>(
    DokumentasiBorangValidation.PARAMS_DOKUMENTASI_BORANG_ID,
  ),
  zodValidation<AjukanRequestType>(DokumentasiBorangValidation.AJUKAN),
  DokumentasiBorangController.ajukan,
);

export default dokumentasiBorangRoute;
