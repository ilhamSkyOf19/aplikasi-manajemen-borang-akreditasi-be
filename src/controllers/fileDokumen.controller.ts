import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseFileDokumenForChooseWithMetaType } from "../models/fileDokumen.mode";
import { PaginationType } from "../types/pagination";
import { FileDokumenService } from "../services/fileDokumen.service";

export class FileDokumenController {
  // find all for choose
  static async findAllForChoose(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenForChooseWithMetaType | null>,
      { validatedQuery: PaginationType }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await FileDokumenService.findAllForChoose({
        limit,
        page,
        search,
        sort,
      });

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenForChooseWithMetaType | null>(
        service,
        res,
        200,
        "berhasil mendapatkan data file dokumen",
      );
    } catch (error) {
      next(error);
    }
  }
}
