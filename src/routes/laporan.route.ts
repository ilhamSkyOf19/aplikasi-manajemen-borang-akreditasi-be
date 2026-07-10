import { Router } from "express";
import { LaporanController } from "../controllers/laporan.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { periodeMiddleware } from "../middlewares/periode.middleware";

const laporanRoute: Router = Router();

laporanRoute.get(
  "/export/statistik-akreditasi",
  [authMiddleware, periodeMiddleware],
  LaporanController.exportLaporanPdf,
);

export default laporanRoute;
