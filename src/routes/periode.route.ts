import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { zodValidation } from "../middlewares/validation.middleware";
import { CreatePeriodeType } from "../models/periode.model";
import { PeriodeValidation } from "../validations/periode.validation";
import { PeriodeController } from "../controllers/periode.controller";
import { GlobalValidation } from "../validations/global.validation";
import { zodValidationParams } from "../middlewares/validationParams.middleware";
import { periodeMiddleware } from "../middlewares/periode.middleware";

const periodeRoute: Router = Router();

// find periode
periodeRoute.get(
  "/",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.wakil_dekan_1,
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
    ]),
  ],
  PeriodeController.find,
);

// find periode active
periodeRoute.get(
  "/active",
  [
    authMiddleware,
    aclMiddleware([
      DosenRole.wakil_dekan_1,
      DosenRole.kaprodi,
      DosenRole.tim_akreditasi,
    ]),
    periodeMiddleware,
  ],
  PeriodeController.findIsActiveWithDistribusi,
);

// create
periodeRoute.post(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1])],
  zodValidation<CreatePeriodeType>(PeriodeValidation.CREATE),
  PeriodeController.create,
);

// periode is active
periodeRoute.put(
  "/:id/active",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  zodValidationParams<{ id: number }>(GlobalValidation.PARAMS_ID),
  PeriodeController.isActive,
);

export default periodeRoute;
