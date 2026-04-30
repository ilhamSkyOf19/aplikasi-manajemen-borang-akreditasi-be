import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { PicKebutuhanDokumentasiController } from "../controllers/picKebutuhanDokumentasi.controller";

const picKebutuhanDokumentasiRoute: Router = Router();

// find all
picKebutuhanDokumentasiRoute.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  PicKebutuhanDokumentasiController.findAll,
);

export default picKebutuhanDokumentasiRoute;
