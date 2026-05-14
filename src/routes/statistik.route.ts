import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { StatistikController } from "../controllers/statistik.controller";

const statistikRoute: Router = Router();

// get statistik
statistikRoute.get("/", authMiddleware, StatistikController.getStatistik);

export default statistikRoute;
