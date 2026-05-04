import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponsePicKebutuhanDokumentasiWithPaginationType } from "../models/picKebutuhanDokumentasi.model";
import { PicKebutuhanDokumentasiServices } from "../services/picKebutuhanDokumentasi.service";
import { PaginationType } from "../types/pagination";

export class PicKebutuhanDokumentasiController {
  // find all
  static async findAll(
    _req: Request,
    res: Response<
      ResponseStructure<ResponsePicKebutuhanDokumentasiWithPaginationType | null>,
      { validatedQuery: PaginationType }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await PicKebutuhanDokumentasiServices.findAll({
        query: {
          limit,
          page,
          search,
          sort,
        },
      });

      return ResponseResult.success<ResponsePicKebutuhanDokumentasiWithPaginationType>(
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
