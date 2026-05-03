import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { NamaKebutuhanDokumentasiValidation } from "../validations/namaKebutuhanDokumentasi.validation";
import { NamaKebutuhanDokumentasiController } from "../controllers/namaKebutuhanDokumentasi.controller";

const namaKebutuhanDokumentasiRouter: Router = Router();

// find all
namaKebutuhanDokumentasiRouter.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.kaprodi])],
  zodValidationQuery<PaginationType>(NamaKebutuhanDokumentasiValidation.QUERY),
  NamaKebutuhanDokumentasiController.findAll,
);

export default namaKebutuhanDokumentasiRouter;
