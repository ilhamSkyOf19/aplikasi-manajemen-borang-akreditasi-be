import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DokumenBorangController } from "../controllers/dokumenBorang.controller";
import { FileService } from "../services/file.service";
import { DokumentasiBorangController } from "../controllers/dokumentasiBorang.controller";

const dokumentasiBorangRoute: Router = Router();

// file upload
const upload = FileService.uploadFile({
  allowedMimeTypes: /pdf/,
});

// create
dokumentasiBorangRoute.post(
  "/upload-dokumentasi-default",
  authMiddleware,
  upload.array("dokumentasi", 4),
  DokumentasiBorangController.createDokumentasiBorangDefatult,
);

export default dokumentasiBorangRoute;
