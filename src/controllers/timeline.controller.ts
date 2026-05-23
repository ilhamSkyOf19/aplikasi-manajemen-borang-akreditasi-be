import { NextFunction, Response } from "express";
import {
  ResponseTimelineType,
  UpdateTimelineType,
} from "../models/timeline.model";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { TimelineService } from "../services/timeline.service";

export class TimelineController {
  // update timeline
  static async update(
    req: AuthRequest<{}, {}, UpdateTimelineType>,
    res: Response<ResponseStructure<ResponseTimelineType | null>>,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // find timeline by periode id
      const timeline = await TimelineService.findByPeriode(periodeId);

      // check timeline
      if (!timeline) {
        return ResponseResult.error(res, 404, "tidak ada timeline");
      }

      // call service
      const service = await TimelineService.update({
        id: timeline.id,
        data: req.body,
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 400, "failed update timeline");
      }

      // return success
      return ResponseResult.success<ResponseTimelineType | null>(
        service,
        res,
        200,
        "success update timeline",
      );
    } catch (error) {
      next(error);
    }
  }

  //   find by periode
  static async findByPeriode(
    req: AuthRequest,
    res: Response<ResponseStructure<ResponseTimelineType | null>>,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // call service
      const service = await TimelineService.findByPeriode(periodeId);

      // return success
      return ResponseResult.success<ResponseTimelineType | null>(
        service,
        res,
        200,
        "success find timeline",
      );
    } catch (error) {
      next(error);
    }
  }

  // update timeline
  static async isActive(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseTimelineType | null>,
      {
        validatedParams: {
          tipe: "kebutuhan_dokumentasi" | "dokumentasi_borang";
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get tipe from params
      const { tipe } = res.locals.validatedParams;

      // find timeline by periode id
      const timeline = await TimelineService.findByPeriode(periodeId);

      // check timeline
      if (!timeline) {
        return ResponseResult.error(res, 404, "tidak ada timeline");
      }

      // call service
      const service = await TimelineService.update({
        id: timeline.id,
        data:
          tipe === "kebutuhan_dokumentasi"
            ? {
                deadline_kebutuhan_dokumentasi: null,
              }
            : {
                deadline_dokumentasi_borang: null,
              },
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 400, "failed update timeline");
      }

      // return success
      return ResponseResult.success<ResponseTimelineType | null>(
        service,
        res,
        200,
        "success update timeline",
      );
    } catch (error) {
      next(error);
    }
  }
}
