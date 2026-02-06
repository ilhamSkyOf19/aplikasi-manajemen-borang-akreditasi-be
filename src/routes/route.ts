import { Router } from "express";
import globalRoute from "./global.route";
import authRoute from "./auth.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

// auth router
appRoute.use("/api/auth", authRoute);

export default appRoute;
