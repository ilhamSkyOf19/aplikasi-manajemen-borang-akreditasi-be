import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { PicKebutuhanDokumentasiController } from "../controllers/picKebutuhanDokumentasi.controller";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { PicKebutuhanDokumentasiValidation } from "../validations/picKebutuhanValidation";

const picKebutuhanDokumentasiRoute: Router = Router();

// find all
picKebutuhanDokumentasiRoute.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationQuery<PaginationType>(PicKebutuhanDokumentasiValidation.QUERY),
  PicKebutuhanDokumentasiController.findAll,
);

export default picKebutuhanDokumentasiRoute;
