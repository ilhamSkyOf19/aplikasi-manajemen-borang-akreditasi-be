import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { DistribusiKebutuhanDokumentasiController } from "../controllers/distribusiKebutuhanDokumentasi.controller";

const distribusiKebutuhanDokumentasiRouter: Router = Router();

// find
distribusiKebutuhanDokumentasiRouter.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  DistribusiKebutuhanDokumentasiController.find,
);

export default distribusiKebutuhanDokumentasiRouter;
