import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  ResponseFileDokumenForChooseWithMetaType,
  ResponseFileDokumenForDetailType,
} from "../models/fileDokumen.mode";
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

  // find for detail
  static async findForDetail(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenForDetailType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { id } = res.locals.validatedParams;

      // call service
      const service = await FileDokumenService.findByIdForDetail(id);

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenForDetailType | null>(
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
