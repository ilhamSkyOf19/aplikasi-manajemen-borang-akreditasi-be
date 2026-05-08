import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateFolderType, UpdateNameFolderType } from "../models/folder.model";
import { FolderValidation } from "../validations/folder.validation";
import { FolderController } from "../controllers/folder.controller";
import { zodValidationParams } from "../middlewares/validationParams.middleware";

const folderRouter: Router = Router();

// create
folderRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidation<CreateFolderType>(FolderValidation.CREATE),
  FolderController.create,
);

// update
folderRouter.put(
  "/nama-folder/:id",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidationParams<{ id: number }>(FolderValidation.PARAMS_ID),
  zodValidation<UpdateNameFolderType>(FolderValidation.UPDATE_NAMA_FOLDER),
  FolderController.updateNameFolder,
);

export default folderRouter;
