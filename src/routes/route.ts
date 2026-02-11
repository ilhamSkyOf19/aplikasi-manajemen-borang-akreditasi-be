import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";
import kriteriaRouter from "./kriteria.route";
import timAkreditasiRoute from "./timAkreditasi.route";
import LimiterMiddleware from "../middlewares/limiter.middleware";
import userRoute from "./user.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// middleate limiter
appRoute.use(LimiterMiddleware.apiRegular());

// auth router
appRoute.use("/api/auth", authRoute);

// user route
appRoute.use("/api/user", userRoute);

// kriteria router
appRoute.use("/api/kriteria", kriteriaRouter);

// tim akreditasi router
appRoute.use("/api/tim-akreditasi", timAkreditasiRoute);

export default appRoute;
