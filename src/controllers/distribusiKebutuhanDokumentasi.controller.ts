import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseDistribusiKebutuhanDokumentasiType } from "../models/distribusiKebutuhanDokumentasi.model";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";

export class DistribusiKebutuhanDokumentasiController {
  // find distribusi
  static async find(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDistribusiKebutuhanDokumentasiType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await DistribusiKebutuhanDokumentasiService.find();

      return ResponseResult.success<ResponseDistribusiKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success find distribusi kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
