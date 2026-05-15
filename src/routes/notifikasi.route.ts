import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { NotifikasiController } from "../controllers/notifikasi.controller";
import { PaginationType } from "../types/pagination";
import { GlobalValidation } from "../validations/global.validation";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { NotifikasiValidation } from "../validations/notifikasi.validation";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
// notifikasi route
const notifikasiRoute: Router = Router();

// get notifikasi
notifikasiRoute.get(
  "/",
  authMiddleware,
  zodValidationQuery<PaginationType & { isRead?: boolean }>(
    NotifikasiValidation.QUERY,
  ),
  NotifikasiController.getNotifikasi,
);

// is read notifikasi
notifikasiRoute.put(
  "/:id/is-read",
  authMiddleware,
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  NotifikasiController.isRead,
);

export default notifikasiRoute;
