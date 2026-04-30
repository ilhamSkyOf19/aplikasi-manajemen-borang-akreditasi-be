import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponsePicKebutuhanDokumentasiType } from "../models/picKebutuhanDokumentasi.model";
import { PicKebutuhanDokumentasiServices } from "../services/picKebutuhanDokumentasi.service";

export class PicKebutuhanDokumentasiController {
  // find all
  static async findAll(
    _req: Request,
    res: Response<
      ResponseStructure<ResponsePicKebutuhanDokumentasiType[] | null>
    >,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await PicKebutuhanDokumentasiServices.findAll();

      return ResponseResult.success<ResponsePicKebutuhanDokumentasiType[]>(
        service,
        res,
        200,
        "Berhasil mendapatkan data PIC kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
