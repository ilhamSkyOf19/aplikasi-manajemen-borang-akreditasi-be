import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DokumenBorangController } from "../controllers/dokumenBorang.controller";

const dokumenBorangRoute: Router = Router();

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
  DokumenBorangController.readDaftarKebutuhanDokumentasi,
);

export default dokumenBorangRoute;
