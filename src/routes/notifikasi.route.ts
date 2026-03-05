import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { NotifikasiController } from "../controllers/notifikasi.controller";
// notifikasi route
const notifikasiRoute: Router = Router();

// get notifikasi
notifikasiRoute.get(
  "/read-all",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  NotifikasiController.getNotifikasi,
);

export default notifikasiRoute;
