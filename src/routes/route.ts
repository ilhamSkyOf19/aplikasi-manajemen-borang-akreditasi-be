import { Router } from "express";
import globalRoute from "./global.route";

const appRoute: Router = Router();

// global route
appRoute.use("/", globalRoute);

export default appRoute;
