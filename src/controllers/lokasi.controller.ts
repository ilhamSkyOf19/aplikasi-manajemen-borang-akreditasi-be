import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { PaginationType } from "../types/pagination";
import { ResponseLokasiWithPaginationType } from "../models/lokasi.model";
import { LokasiServices } from "../services/lokasi.service";

export class LokasiController {
  // find all
  static async findAll(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseLokasiWithPaginationType | null>,
      { validatedQuery: PaginationType }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await LokasiServices.findAll({
        query: {
          limit,
          page,
          search,
          sort,
        },
      });

      return ResponseResult.success<ResponseLokasiWithPaginationType>(
        service,
        res,
        200,
        "Berhasil mendapatkan data Lokasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
