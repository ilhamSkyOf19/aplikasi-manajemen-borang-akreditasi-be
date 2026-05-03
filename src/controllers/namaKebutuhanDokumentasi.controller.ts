import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseNamaKebutuhanDokumentasiWithMetaType } from "../models/namaKebutuhanDokumentasi.model";
import { PaginationType } from "../types/pagination";
import { NamaKebutuhanDokumentasiServices } from "../services/namaKebutuhanDokumentasi.service";

export class NamaKebutuhanDokumentasiController {
  // find all
  static async findAll(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseNamaKebutuhanDokumentasiWithMetaType | null>,
      {
        validatedQuery: PaginationType;
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await NamaKebutuhanDokumentasiServices.findAll({
        limit,
        page,
        search,
        sort,
      });

      // return
      return ResponseResult.success<ResponseNamaKebutuhanDokumentasiWithMetaType | null>(
        service,
        res,
        200,
        "success read all nama kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
