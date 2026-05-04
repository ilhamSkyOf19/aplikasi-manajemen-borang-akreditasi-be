import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { VerifikasiValidation } from "../validations/verifikasi.validation";
import { VerifikasiController } from "../controllers/verifikasi.controller";
import { VerifikasiKebutuhanDokumentasiPicType } from "../models/kebutuhanDokumentasiPic.model";
import { VerifikasiDokumentasiBorangType } from "../models/dokumentasiBorang.model";

const verifikasiRoute: Router = Router();

// verifikasi kebutuhan dokumentasi pic
verifikasiRoute.post(
  "/kebutuhan-dokumentasi-pic",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<VerifikasiKebutuhanDokumentasiPicType>(
    VerifikasiValidation.VERIFIKASI_KEBUTUHAN_DOKUMENTASI_PIC,
  ),
  VerifikasiController.verifikasiKebutuhanDokumentasiPic,
);

// verifikasi dokumentasi borang
verifikasiRoute.post(
  "/dokumentasi-borang",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<VerifikasiDokumentasiBorangType>(
    VerifikasiValidation.VERIFIKASI_DOKUMENTASI_BORANG,
  ),
  VerifikasiController.verifikasiDokumentasiBorang,
);

export default verifikasiRoute;
