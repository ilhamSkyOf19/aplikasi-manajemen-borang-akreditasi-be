import { Router } from "express";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { DokumentasiBorangValidation } from "../validations/dokumentasiBorang.validationn";
import { DokumentasiBorangController } from "../controllers/dokumentasiBorang.controller";
import { GlobalValidation } from "../validations/global.validation";
import { FileDokumenController } from "../controllers/fileDokumen.controller";

const publicRoute: Router = Router();

publicRoute.get(
  "/by-kebutuhan-dokumentasi/:kebutuhan_dokumentasi_id",
  [periodeMiddleware],
  zodValidationParams<{
    kebutuhan_dokumentasi_id: number;
  }>(DokumentasiBorangValidation.PARAMS_KEBUTUHAN_DOKUMENTASI_ID),
  DokumentasiBorangController.findByKebutuhanDokumentasiIdForPublic,
);

// find for default
publicRoute.get(
  "/file-dokumen/:file_dokumen_id/dokumentasi-borang/:dokumentasi_borang_id/default",
  [periodeMiddleware],
  zodValidationParams<{
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }>(GlobalValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_DOKUMEN_ID),
  FileDokumenController.findFileDefaultForDetailForPublic,
);

// find for penelitian
publicRoute.get(
  "/file-dokumen/:file_dokumen_id/dokumentasi-borang/:dokumentasi_borang_id/penelitian",
  [periodeMiddleware],
  zodValidationParams<{
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }>(GlobalValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_DOKUMEN_ID),
  FileDokumenController.findFilePenelitianForDetailForPublic,
);

// preview from sistem
publicRoute.get(
  "/file-dokumen/preview-sistem/:id",
  [periodeMiddleware],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_PREVIEW_FILE),
  FileDokumenController.previewFileLocal,
);

// preview from google drive
publicRoute.get(
  "/file-dokumen/preview-drive/:id",
  [periodeMiddleware],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_PREVIEW_FILE),
  FileDokumenController.previewFileGoogleDrive,
);

export default publicRoute;
