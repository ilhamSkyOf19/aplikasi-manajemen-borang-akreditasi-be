import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateFolderType } from "../models/folder.model";
import { FolderValidation } from "../validations/folder.validation";
import { FolderController } from "../controllers/folder.controller";

const folderRouter: Router = Router();

// create
folderRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.tim_akreditasi])],
  zodValidation<CreateFolderType>(FolderValidation.CREATE),
  FolderController.create,
);

export default folderRouter;
