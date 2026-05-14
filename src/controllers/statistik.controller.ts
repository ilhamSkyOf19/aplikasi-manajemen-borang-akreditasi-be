import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { StatistikService } from "../services/statistik.service";
import {
  ResponseStatistikTimAkreditasiType,
  ResponseStatistikType,
} from "../models/statistik.model";
import { AuthRequest } from "../types/authRequest";

export class StatistikController {
  // get statistik
  static async getStatistik(
    _req: Request,
    res: Response<ResponseStructure<ResponseStatistikType | null>>,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await StatistikService.getStatistik();

      //   return
      return ResponseResult.success<ResponseStatistikType | null>(
        service,
        res,
        200,
        "success get statistik",
      );
    } catch (error) {
      next(error);
    }
  }

  // statistik for tim akreditasi
  static async getStatistikForTimAkreditasi(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseStatistikTimAkreditasiType[] | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get dosen id
      const dosenId = req?.data?.id;

      // call service
      const service = await StatistikService.getStatistikForTimAkreditasi({
        dosenId: dosenId ?? 0,
      });

      //   return
      return ResponseResult.success<
        ResponseStatistikTimAkreditasiType[] | null
      >(service, res, 200, "success get statistik");
    } catch (error) {
      next(error);
    }
  }
}
