import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";
import kriteriaRouter from "./kriteria.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// auth router
appRoute.use("/api/auth", authRoute);

// kriteria router
appRoute.use("/api/kriteria", kriteriaRouter);

export default appRoute;
