import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { NotifikasiController } from "../controllers/notifikasi.controller";
// notifikasi route
const notifikasiRoute: Router = Router();

// get notifikasi
notifikasiRoute.get(
  "/read-all",

  authMiddleware,

  NotifikasiController.getNotifikasi,
);

// is read
notifikasiRoute.put("/isRead/:id", authMiddleware, NotifikasiController.isRead);

export default notifikasiRoute;
