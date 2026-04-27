import { Router } from "express";
import { RiwayatController } from "../controllers/riwayat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { RiwayatValidation } from "../validations/riwayat.validation";

const riwayatRouter: Router = Router();

// find all by kebutuhan dokumentasi id
riwayatRouter.get(
  "/kebutuhan-dokumentasi-pic/:kebutuhan_dokumentasi_pic_id",
  authMiddleware,
  [authMiddleware, aclMiddleware([DosenRole.kaprodi, DosenRole.wakil_dekan_1])],
  zodValidationParams<{ kebutuhan_dokumentasi_pic_id: number }>(
    RiwayatValidation.PARAMS_ID,
  ),
  RiwayatController.findAllByKebutuhanDokumentasiPicId,
);

export default riwayatRouter;
