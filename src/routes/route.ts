import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";
import kriteriaRouter from "./kriteria.route";
import timAkreditasiRoute from "./timAkreditasi.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// auth router
appRoute.use("/api/auth", authRoute);

// kriteria router
appRoute.use("/api/kriteria", kriteriaRouter);

// tim akreditasi router
appRoute.use("/api/tim-akreditasi", timAkreditasiRoute);

export default appRoute;
