import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { FileDokumenValidation } from "../validations/fileDokumen.validation";
import { FileDokumenController } from "../controllers/fileDokumen.controller";

const fileDokumenRouter: Router = Router();

// dokumen borang router
fileDokumenRouter.get(
  "/for-choose",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationQuery<PaginationType>(FileDokumenValidation.QUERY_PARAMS),
  FileDokumenController.findAllForChoose,
);

export default fileDokumenRouter;
