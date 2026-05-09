import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { FileDokumenController } from "../controllers/fileDokumen.controller";
import { GlobalValidation } from "../validations/global.validation";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateFileDefaultType } from "../models/fileDokumen.model";
import { FileDokumenValidation } from "../validations/fileDokumen.validation";

const fileDokumenRouter: Router = Router();

// dokumen borang router
fileDokumenRouter.get(
  "/for-choose",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationQuery<PaginationType>(GlobalValidation.QUERY),
  FileDokumenController.findAllForChoose,
);

// find for detail
fileDokumenRouter.get(
  "/:id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  FileDokumenController.findForDetail,
);

// update file default
fileDokumenRouter.patch(
  "/default/:id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  zodValidation<UpdateFileDefaultType>(FileDokumenValidation.UPDATE_DEFAULT),
  FileDokumenController.updateFileDefault,
);

// preview
fileDokumenRouter.get(
  "/preview-sistem/:id/:nama_file",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ id: number; nama_file: string }>(
    GlobalValidation.PARAMS_PREVIEW_FILE,
  ),
  FileDokumenController.previewFileLocal,
);

fileDokumenRouter.get(
  "/preview-drive/:id/:nama_file",
  authMiddleware,
  zodValidationParams<{ id: number; nama_file: string }>(
    GlobalValidation.PARAMS_PREVIEW_FILE,
  ),
  FileDokumenController.previewFileGoogleDrive,
);

export default fileDokumenRouter;
