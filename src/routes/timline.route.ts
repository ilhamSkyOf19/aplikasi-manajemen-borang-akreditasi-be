import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { periodeMiddleware } from "../middlewares/periode.middleware";
import { zodValidation } from "../middlewares/validation.middleware";
import { UpdateTimelineType } from "../models/timeline.model";
import { TimelineValidation } from "../validations/timeline.validation";
import { TimelineController } from "../controllers/timeline.controller";

const timelineRoute: Router = Router();

// update by periode
timelineRoute.patch(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  zodValidation<UpdateTimelineType>(TimelineValidation.UPDATE),
  TimelineController.update,
);

// find by periode
timelineRoute.get(
  "/",
  [authMiddleware, aclMiddleware([DosenRole.wakil_dekan_1]), periodeMiddleware],
  TimelineController.findByPeriode,
);

// export
export default timelineRoute;
