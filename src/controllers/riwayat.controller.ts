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
}
