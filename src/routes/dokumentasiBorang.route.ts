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

// create
dokumentasiBorangRoute.post(
  "/default",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  upload.single("dokumentasi"),
  DokumentasiBorangController.createDokumentasiBorangDefault,
);

// find
dokumentasiBorangRoute.get(
  "/by-kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
  ],
  zodValidationParams<{
    kebutuhan_dokumentasi_id: number;
  }>(DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID),
  DokumentasiBorangController.findByKebutuhanDokumentasiId,
);

// find
dokumentasiBorangRoute.get(
  "/by-kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
  ],
  zodValidationParams<{ kebutuhan_dokumentasi_id: number }>(
    DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID,
  ),
  DokumentasiBorangController.findAllByKebutuhanDokumentasiPicId,
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

// find all by kebutuhan dokumentasi pic id and folder id
// dokumentasiBorangRoute.get(
//   "/by-dokumentasi-borang-folder-id/:dokumentasi_borang_id/folder/:folder_id",
//   [
//     authMiddleware,
//     aclMiddleware([DosenRole.tim_akreditasi, DosenRole.kaprodi]),
//   ],
//   zodValidationParams<{ dokumentasi_borang_id: number; folder_id: number }>(
//     DokumentasiBorangValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FOLDER_ID,
//   ),
//   DokumentasiBorangController.findFilesByFolderIdAndDokumentasiBorangId,
// );

export default dokumentasiBorangRoute;
