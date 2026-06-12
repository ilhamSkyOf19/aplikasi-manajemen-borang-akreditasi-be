import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { PicKebutuhanDokumentasiValidation } from "../validations/picKebutuhanValidation";
import { LokasiController } from "../controllers/lokasi.controller";

const lokasiRoute: Router = Router();

// find all
lokasiRoute.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationQuery<PaginationType>(PicKebutuhanDokumentasiValidation.QUERY),
  LokasiController.findAll,
);

export default lokasiRoute;
