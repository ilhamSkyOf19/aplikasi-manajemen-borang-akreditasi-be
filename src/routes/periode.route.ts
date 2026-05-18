import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreatePeriodeType } from "../models/periode.model";
import { PeriodeValidation } from "../validations/periode.validation";
import { PeriodeController } from "../controllers/periode.controller";

const periodeRoute: Router = Router();

// create
periodeRoute.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreatePeriodeType>(PeriodeValidation.CREATE),
  PeriodeController.create,
);

export default periodeRoute;
