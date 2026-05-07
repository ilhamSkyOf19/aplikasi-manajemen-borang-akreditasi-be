import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { FileService } from "../services/file.service";
import { DokumentasiBorangController } from "../controllers/dokumentasiBorang.controller";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { DokumentasiBorangValidation } from "../validations/dokumentasiBorang.validationn";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";

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
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{
    kebutuhan_dokumentasi_id: number;
  }>(DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID),
  DokumentasiBorangController.findByKebutuhanDokumentasiId,
);

// update
dokumentasiBorangRoute.patch(
  "/by-dokumentasi-borang/:dokumentasi_borang_id/file-id/:file_id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  upload.single("dokumentasi"),
  zodValidationParams<{ dokumentasi_borang_id: number; file_id: number }>(
    DokumentasiBorangValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_ID,
  ),
  DokumentasiBorangController.updateDokumentasiBorangDefatult,
);

// find
dokumentasiBorangRoute.get(
  "/by-kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ kebutuhan_dokumentasi_id: number }>(
    DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID,
  ),
  DokumentasiBorangController.findAllByKebutuhanDokumentasiPicId,
);

// find all by kebutuhan dokumentasi pic id and folder id
dokumentasiBorangRoute.get(
  "/by-dokumentasi-borang-folder-id/:dokumentasi_borang_id/folder/:folder_id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ dokumentasi_borang_id: number; folder_id: number }>(
    DokumentasiBorangValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FOLDER_ID,
  ),
  DokumentasiBorangController.findFilesByFolderIdAndDokumentasiBorangId,
);

export default dokumentasiBorangRoute;
