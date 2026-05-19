import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { DistribusiKebutuhanDokumentasiController } from "../controllers/distribusiKebutuhanDokumentasi.controller";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { GlobalValidation } from "../validations/global.validation";

const distribusiKebutuhanDokumentasiRouter: Router = Router();

// find
distribusiKebutuhanDokumentasiRouter.get(
  "/",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
    periodeMiddleware,
  ],
  DistribusiKebutuhanDokumentasiController.find,
);

// find by periode
distribusiKebutuhanDokumentasiRouter.get(
  "/periode",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
      DosenRole.wakil_dekan_1,
    ]),
    periodeMiddleware,
  ],
  DistribusiKebutuhanDokumentasiController.findByPeriode,
);

// handle distribusi active
distribusiKebutuhanDokumentasiRouter.put(
  "/:id/active",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi]), periodeMiddleware],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  DistribusiKebutuhanDokumentasiController.active,
);

// handle distribusi an active
distribusiKebutuhanDokumentasiRouter.put(
  "/:id/an-active",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi]), periodeMiddleware],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  DistribusiKebutuhanDokumentasiController.anActive,
);

export default distribusiKebutuhanDokumentasiRouter;
