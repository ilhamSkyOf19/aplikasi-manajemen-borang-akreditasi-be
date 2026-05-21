import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { StatistikController } from "../controllers/statistik.controller";
import { aclMiddleware } from "../middlewares/acl.middleware";
import { DosenRole } from "../utils/contstanst";
import { periodeMiddleware } from "../middlewares/periode.middleware";

const statistikRoute: Router = Router();

// get statistik
statistikRoute.get(
  "/",
  [
    authMiddleware,
    aclMiddleware([DosenRole.wakil_dekan_1, DosenRole.kaprodi]),
    periodeMiddleware,
  ],
  StatistikController.getStatistik,
);

statistikRoute.get(
  "/for-tim-akreditasi",
  [
    authMiddleware,
    aclMiddleware([DosenRole.tim_akreditasi]),
    periodeMiddleware,
  ],
  StatistikController.getStatistikForTimAkreditasi,
);

export default statistikRoute;
