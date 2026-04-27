import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { VerifikasiKebutuhanDokumentasiPic } from "../models/verifikasiKebutuhanDokumentasiPic.model";
import { VerifikasiValidation } from "../validations/verifikasi.validation";
import { verifikasiController } from "../controllers/verifikasi.controller";

const verifikasiRoute: Router = Router();

// verifikasi kebutuhan dokumentasi pic
verifikasiRoute.post(
  "/kebutuhan-dokumentasi-pic",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<VerifikasiKebutuhanDokumentasiPic>(
    VerifikasiValidation.VERIFIKASI_KEBUTUHAN_DOKUMENTASI_PIC,
  ),
  verifikasiController.verifikasiKebutuhanDokumentasiPic,
);

export default verifikasiRoute;
