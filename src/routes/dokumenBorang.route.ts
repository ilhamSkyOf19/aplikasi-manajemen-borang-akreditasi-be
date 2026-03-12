import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DokumenBorangController } from "../controllers/dokumenBorang.controller";
import { FileService } from "../services/file.service";

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
  "/read-daftar",
  authMiddleware,
  DokumenBorangController.readDaftarDokumen,
);

// read daftar kebutuhan dokumentasi
dokumenBorangRoute.get(
  "/read-daftar-kebutuhan-dokumentasi/:kriteria/:pendekatan",
  authMiddleware,
  DokumenBorangController.readDaftarKebutuhanDokumentasiByKriteriaAndPendekatan,
);

export default dokumenBorangRoute;
