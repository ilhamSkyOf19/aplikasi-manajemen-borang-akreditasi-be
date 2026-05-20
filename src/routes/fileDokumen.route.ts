import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole, TipeDokumentasi } from "../utils/contstanst";
import { zodValidationQuery } from "../middlewares/validationQuery.middleware";
import { PaginationType } from "../types/pagination";
import { FileDokumenController } from "../controllers/fileDokumen.controller";
import { GlobalValidation } from "../validations/global.validation";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { FileDokumenValidation } from "../validations/fileDokumen.validation";
import { FileDokumenDefaultValidation } from "../validations/fileDokumenDefault.validation";
import { UpdateFileDefaultType } from "../models/fileDokumenDefault.model";
import { UpdateFilePenelitianType } from "../models/fileDokumenPenelitian.model";
import { FileDokumenPenelitianValidation } from "../validations/fileDokumenPenelitian.validation";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { distribusiMiddleware } from "../middlewares/distribusi.middleware";

const fileDokumenRouter: Router = Router();

// dokumen borang router
fileDokumenRouter.get(
  "/for-choose/:tipe_file",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationQuery<PaginationType>(GlobalValidation.QUERY),
  zodValidationParams<{ tipe_file: TipeDokumentasi }>(
    FileDokumenValidation.PARAMS_TIPE_FILE,
  ),
  FileDokumenController.findAllForChoose,
);

// find for default
fileDokumenRouter.get(
  "/:file_dokumen_id/dokumentasi-borang/:dokumentasi_borang_id/default",
  [
    authMiddleware,
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
  ],
  zodValidationParams<{
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }>(GlobalValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_DOKUMEN_ID),
  FileDokumenController.findFileDefaultForDetail,
);

// update file default
fileDokumenRouter.patch(
  "/default/:id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi]),
    periodeMiddleware,
    distribusiMiddleware(),
  ],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  zodValidation<UpdateFileDefaultType>(
    FileDokumenDefaultValidation.UPDATE_DEFAULT,
  ),
  FileDokumenController.updateFileDefault,
);

// find for penelitian
fileDokumenRouter.get(
  "/:file_dokumen_id/dokumentasi-borang/:dokumentasi_borang_id/penelitian",
  [
    authMiddleware,
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
  ],
  zodValidationParams<{
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }>(GlobalValidation.PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_DOKUMEN_ID),
  FileDokumenController.findFilePenelitianForDetail,
);

// update file penelitian
fileDokumenRouter.patch(
  "/penelitian/:id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi]),
    periodeMiddleware,
    distribusiMiddleware(),
  ],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  zodValidation<UpdateFilePenelitianType>(
    FileDokumenPenelitianValidation.UPDATE_PENELITIAN,
  ),
  FileDokumenController.updateFilePenelitian,
);

// preview from sistem
fileDokumenRouter.get(
  "/preview-sistem/:id/:nama_file",
  [
    authMiddleware,
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
  ],
  zodValidationParams<{ id: number; nama_file: string }>(
    GlobalValidation.PARAMS_PREVIEW_FILE,
  ),
  FileDokumenController.previewFileLocal,
);

// preview from google drive
fileDokumenRouter.get(
  "/preview-drive/:id/:nama_file",
  [
    authMiddleware,
    periodeMiddleware,
    distribusiMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
  ],
  zodValidationParams<{ id: number; nama_file: string }>(
    GlobalValidation.PARAMS_PREVIEW_FILE,
  ),
  FileDokumenController.previewFileGoogleDrive,
);

// delete from dokumentasi borang
fileDokumenRouter.delete(
  "/:file_id/for-dokumentasi-borang/:dokumentasi_borang_id",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi]),
    periodeMiddleware,
    distribusiMiddleware(),
  ],
  zodValidationParams<{ file_id: number; dokumentasi_borang_id: number }>(
    FileDokumenValidation.PARAMS_FILE_ID_AND_DOKUMENTASI_BORANG_ID,
  ),
  FileDokumenController.deleteFromDokumentasiBorang,
);

export default fileDokumenRouter;
