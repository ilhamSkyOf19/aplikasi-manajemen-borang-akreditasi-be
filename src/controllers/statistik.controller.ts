import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { StatistikService } from "../services/statistik.service";
import {
  ResponseStatistikTimAkreditasiType,
  ResponseStatistikType,
} from "../models/statistik.model";
import { AuthRequest } from "../types/authRequest";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";
import { DosenRole } from "../utils/contstanst";

export class StatistikController {
  // get statistik
  static async getStatistik(
    req: AuthRequest,
    res: Response<ResponseStructure<ResponseStatistikType | null>>,
    next: NextFunction,
  ) {
    try {
      // get dosen role
      const dosenRole = req?.data?.role;

      // get periode id
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id && dosenRole === DosenRole.tim_akreditasi) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // call service
      const service = await StatistikService.getStatistik({
        periode_id,
      });

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

      // get periode
      const periodeId = req?.periode?.id;

      // call service
      const service = await StatistikService.getStatistikForTimAkreditasi({
        dosenId: dosenId ?? 0,
        periodeId: periodeId ?? 0,
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
