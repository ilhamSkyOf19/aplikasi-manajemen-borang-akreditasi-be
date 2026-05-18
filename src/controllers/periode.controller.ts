import { NextFunction, Request, Response } from "express";
import {
  CreatePeriodeType,
  ResponsePeriodeType,
} from "../models/periode.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { PeriodeServices } from "../services/periode.service";

export class PeriodeController {
  // create
  static async create(
    req: Request<{}, {}, CreatePeriodeType>,
    res: Response<ResponseStructure<ResponsePeriodeType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { end_date, start_date } = req.body;

      // call service
      const service = await PeriodeServices.create({ end_date, start_date });

      // chekc
      if (!service) {
        return ResponseResult.error(res, 400, "Failed create periode");
      }

      // return
      return ResponseResult.success<ResponsePeriodeType | null>(
        service,
        res,
        201,
        "success create periode",
      );
    } catch (error) {
      next(error);
    }
  }
}
