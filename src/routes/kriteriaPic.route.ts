import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { AddPicToKriteriaType } from "../models/kriteriaPic.model";
import { KriteriaPicValidation } from "../validations/kriteriaPic.validation";
import { KriteriaPicController } from "../controllers/kriteriaPic.controller";

const kriteriaPicRouter: Router = Router();

// add pic
kriteriaPicRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<AddPicToKriteriaType>(KriteriaPicValidation.ADD_PIC),
  KriteriaPicController.addPicToKriteria,
);

export default kriteriaPicRouter;
