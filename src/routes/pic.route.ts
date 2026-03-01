import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreatePicType, UpdatePicType } from "../models/pic.model";
import { PicValidation } from "../validations/pic.validation";
import { PicController } from "../controllers/pic.controller";
import { UpdateStatusType } from "../models/status.model";
import { StatusValidation } from "../validations/status.validation";

const picRouter: Router = Router();

// read all
picRouter.get(
  "/read-all",
  [
    authMiddleware,
    aclMiddleware(["kaprodi", "wakil_dekan_1", "tim_akreditasi"]),
  ],
  PicController.readAll,
);

// read detail
picRouter.get(
  "/read-by-id/:id",
  [
    authMiddleware,
    aclMiddleware(["kaprodi", "wakil_dekan_1", "tim_akreditasi"]),
  ],
  PicController.readById,
);

// create
picRouter.post(
  "/create",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<CreatePicType>(PicValidation.CREATE),
  PicController.create,
);

// update
picRouter.patch(
  "/update/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  zodValidation<UpdatePicType>(PicValidation.UPDATE),
  PicController.update,
);

// update status
picRouter.patch(
  "/update-status-pic/:id",
  [authMiddleware, aclMiddleware(["wakil_dekan_1"])],
  zodValidation<UpdateStatusType>(StatusValidation.UPDATE_STATUS),
  PicController.updateStatusPic,
);

// delete
picRouter.delete(
  "/delete/:id",
  [authMiddleware, aclMiddleware(["kaprodi"])],
  PicController.delete,
);

export default picRouter;
