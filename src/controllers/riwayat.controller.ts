import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseRiwayatKebutuhanDokumentasiPicType } from "../models/riwayat.model";
import { RiwayatService } from "../services/riwayat.service";

export class RiwayatController {
  // find all by kebutuhan dokumentasi id
  static async findAllByKebutuhanDokumentasiPicId(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseRiwayatKebutuhanDokumentasiPicType[]>,
      { validatedParams: { kebutuhan_dokumentasi_pic_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { kebutuhan_dokumentasi_pic_id } = res.locals.validatedParams;

      // call db
      const result = await RiwayatService.findAllByKebutuhanDokumentasiPicId(
        kebutuhan_dokumentasi_pic_id,
      );

      // return result
      return ResponseResult.success<
        ResponseRiwayatKebutuhanDokumentasiPicType[]
      >(result, res);
    } catch (error) {
      next(error);
    }
  }
}
