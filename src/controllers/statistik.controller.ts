import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { StatistikService } from "../services/statistik.service";
import { ResponseStatistikType } from "../models/statistik.model";

export class StatistikController {
  // get statistik
  static async getStatistik(
    _req: Request,
    res: Response<ResponseStructure<any | null>>,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await StatistikService.getStatistik();

      //   return
      return ResponseResult.success<any | null>(
        service,
        res,
        200,
        "success get statistik",
      );
    } catch (error) {
      next(error);
    }
  }
}
