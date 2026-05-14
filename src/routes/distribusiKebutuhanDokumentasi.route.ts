import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { DistribusiKebutuhanDokumentasiController } from "../controllers/distribusiKebutuhanDokumentasi.controller";

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
  ],
  DistribusiKebutuhanDokumentasiController.find,
);

// handle distribusi active
distribusiKebutuhanDokumentasiRouter.put(
  "/active",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  DistribusiKebutuhanDokumentasiController.active,
);

// handle distribusi an active
distribusiKebutuhanDokumentasiRouter.put(
  "/an-active",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  DistribusiKebutuhanDokumentasiController.anActive,
);

export default distribusiKebutuhanDokumentasiRouter;
