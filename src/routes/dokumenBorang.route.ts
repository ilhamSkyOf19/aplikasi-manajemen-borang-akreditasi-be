import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DokumenBorangController } from "../controllers/dokumenBorang.controller";
import { FileService } from "../services/file.service";
import { zodValidation } from "../middlewares/validation.middleware";
import { DokumenBorangValidation } from "../validations/dokumenBorang.validation";

const dokumenBorangRoute: Router = Router();

// file upload
const upload = FileService.uploadFile({
  allowedMimeTypes: /pdf/,
});

// create
dokumenBorangRoute.post(
  "/upload",
  authMiddleware,
  upload.array("dokumen", 4),
  DokumenBorangController.create,
);

// read all
dokumenBorangRoute.get(
  "/",
  authMiddleware,
  DokumenBorangController.readDaftarDokumen,
);

// read dokumen for choose
dokumenBorangRoute.get(
  "/for-choose",
  authMiddleware,
  DokumenBorangController.getDokumenBorangForChoose,
);

// read daftar kebutuhan dokumentasi by kriteria by pendekatan
dokumenBorangRoute.get(
  "/:kriteria/:pendekatan",
  authMiddleware,
  DokumenBorangController.readDaftarKebutuhanDokumentasiByKriteriaAndPendekatan,
);

// read dokumentasi borang by kebutuhan dokumen id
dokumenBorangRoute.get(
  "/:kebutuhanDokumenId",
  authMiddleware,
  DokumenBorangController.findDokumenBorangByKebutuhanDokumenId,
);

// download borang
dokumenBorangRoute.get(
  "/download/:filename",
  DokumenBorangController.downloadSingleFile,
);

// download borang
dokumenBorangRoute.post(
  "/download-multiple",
  zodValidation<{ filenames: string[] }>(DokumenBorangValidation.DOWNLOAD),
  DokumenBorangController.downloadMultipleFile,
);

// delete
dokumenBorangRoute.delete(
  "/:id",
  authMiddleware,
  zodValidation<{ ids: number[] }>(DokumenBorangValidation.DELETE),
  DokumenBorangController.deleteDokumenBorang,
);

export default dokumenBorangRoute;
