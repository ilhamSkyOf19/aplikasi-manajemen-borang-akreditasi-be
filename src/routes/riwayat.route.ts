import { Router } from "express";
import { RiwayatController } from "../controllers/riwayat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole, TipeRiwayat } from "../utils/contstanst";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { RiwayatValidation } from "../validations/riwayat.validation";

const riwayatRouter: Router = Router();

// find all by kebutuhan dokumentasi id
riwayatRouter.get(
  "/by-kebutuhan-dokumentasi-pic-or-dokumentasi-borang/:id/tipe-riwayat/:tipe_riwayat",
  authMiddleware,
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{
    id: number;
    tipe_riwayat: TipeRiwayat;
  }>(RiwayatValidation.PARAMS_ID),
  RiwayatController.findAllRiwayatByKebutuhanDokumentasiOrDokumentasiBorang,
);

export default riwayatRouter;
