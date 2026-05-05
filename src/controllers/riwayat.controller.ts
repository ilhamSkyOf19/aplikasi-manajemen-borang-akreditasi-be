import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseRiwayatType } from "../models/riwayat.model";
import { RiwayatService } from "../services/riwayat.service";
import { TipeRiwayat } from "../utils/contstanst";

export class RiwayatController {
  // find all by kebutuhan dokumentasi id
  static async findAllRiwayatByKebutuhanDokumentasiOrDokumentasiBorang(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseRiwayatType[]>,
      {
        validatedParams: {
          id: number;
          tipe_riwayat: TipeRiwayat;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id, tipe_riwayat } = res.locals.validatedParams;

      // call db
      const result =
        await RiwayatService.findAllRiwayatByKebutuhanDokumentasiOrDokumentasiBorang(
          { id, tipe_riwayat },
        );

      // return result
      return ResponseResult.success<ResponseRiwayatType[]>(result, res);
    } catch (error) {
      next(error);
    }
  }

  // find by id
  static async findById(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseRiwayatType | null>,
      { validatedParams: { id: number; tipe_riwayat: TipeRiwayat } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id, tipe_riwayat } = res.locals.validatedParams;

      // call db
      const result = await RiwayatService.findById({ id, tipe_riwayat });

      // check result
      if (!result) return ResponseResult.error(res, 404, "riwayat not found");

      // return result
      return ResponseResult.success<ResponseRiwayatType | null>(result, res);
    } catch (error) {
      next(error);
    }
  }
}
