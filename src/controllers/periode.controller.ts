import { NextFunction, Request, Response } from "express";
import {
  CreatePeriodeType,
  ResponsePeriodeType,
  ResponsePeriodeWithDistribusiType,
} from "../models/periode.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { PeriodeServices } from "../services/periode.service";
import { AuthRequest } from "../types/authRequest";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";
import { TimelineService } from "../services/timeline.service";

export class PeriodeController {
  static async findIsActiveWithDistribusi(
    _req: Request,
    res: Response<ResponseStructure<ResponsePeriodeWithDistribusiType | null>>,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode = await PeriodeServices.findIsActiveWithDistribusi();

      // return
      return ResponseResult.success<ResponsePeriodeWithDistribusiType | null>(
        periode,
        res,
        200,
        "success find periode",
      );
    } catch (error) {
      next(error);
    }
  }
  // find periode
  static async find(
    _req: Request,
    res: Response<ResponseStructure<ResponsePeriodeType[] | null>>,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await PeriodeServices.find();

      // return
      return ResponseResult.success<ResponsePeriodeType[] | null>(
        service,
        res,
        200,
        "success find periode",
      );
    } catch (error) {
      next(error);
    }
  }
  // create
  static async create(
    req: Request<{}, {}, CreatePeriodeType>,
    res: Response<ResponseStructure<ResponsePeriodeType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { end_date, start_date } = req.body;

      const startDate = new Date(start_date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(end_date);
      endDate.setUTCHours(23, 59, 59, 999);

      const service = await PeriodeServices.create({
        start_date: startDate,
        end_date: endDate,
      });

      // chekc
      if (!service) {
        return ResponseResult.error(res, 400, "Failed create periode");
      }

      // create distribusi untuk kebutuhan dokumentasi
      await DistribusiKebutuhanDokumentasiService.create({
        periode_id: service.id,
      });

      // create timeline
      await TimelineService.create({
        periode_id: service.id,
        deadline_dokumentasi_borang: null,
        deadline_kebutuhan_dokumentasi: null,
      });

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

  // periode is active
  static async isActive(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponsePeriodeType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id } = res.locals.validatedParams;

      // find is active
      const periodeIsActive = req.periode?.id;

      // check periode is active
      if (periodeIsActive) {
        // check same id
        if (periodeIsActive === id) {
          return ResponseResult.error(res, 400, "periode sudah aktif");
        }

        const disableIsActive = await PeriodeServices.isActive({
          id: periodeIsActive,
          is_active: false,
        });

        // set request periode
        req.periode = disableIsActive ?? undefined;

        // check disable periode is active
        if (!disableIsActive) {
          return ResponseResult.error(
            res,
            400,
            "Failed disable periode is active",
          );
        }
      }

      // call service
      const enablePeriodeIsActive = await PeriodeServices.isActive({
        id,
        is_active: true,
      });

      // check service
      if (!enablePeriodeIsActive) {
        return ResponseResult.error(res, 404, "periode not found");
      }

      // return
      return ResponseResult.success<ResponsePeriodeType | null>(
        enablePeriodeIsActive,
        res,
        200,
        "success find periode is active",
      );
    } catch (error) {
      next(error);
    }
  }
}
