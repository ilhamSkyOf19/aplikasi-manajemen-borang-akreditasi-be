import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreateKriteriaPicType } from "../models/kriteriaPic.model";
import { KriteriaPicValidation } from "../validations/kriteriaPic.validation";
import { KriteriaPicController } from "../controllers/kriteriaPic.controller";

const kriteriaPicRouter: Router = Router();

// create
kriteriaPicRouter.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreateKriteriaPicType>(KriteriaPicValidation.CREATE),
  KriteriaPicController.create,
);

export default kriteriaPicRouter;
