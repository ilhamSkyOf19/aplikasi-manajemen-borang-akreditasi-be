import { Response, Router } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";

const globalRoute: Router = Router();

globalRoute.get("/", (_req, res: Response<ResponseStructure<null>>) => {
  return ResponseResult.success<null>(null, res, 200, "API is running");
});

export default globalRoute;
