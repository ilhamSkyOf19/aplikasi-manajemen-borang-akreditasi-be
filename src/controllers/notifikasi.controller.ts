import { NextFunction, Request, Response } from "express";
import { PaginationType } from "../types/pagination";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseNotifikasiWithMetaType } from "../models/notifikasi.model";
import checkParamsId from "../utils/checkParamsId";
import { NotifikasiService } from "../services/notifikasi.service";
import { AuthRequest } from "../types/authRequest";
import { checkQueryPagination } from "../utils/checkQueryPagination";

export class NotifikasiController {
  // create
  static async getNotifikasi(
    req: AuthRequest<{}, {}, {}, PaginationType & { isRead?: string }>,
    res: Response<ResponseStructure<ResponseNotifikasiWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get query from params
      const { limit, page, search, isRead } = req.query;

      //   check is read query
      if (isRead) {
        if (
          isRead.toLowerCase() !== "true" &&
          isRead.toLowerCase() !== "false"
        ) {
          return ResponseResult.error(res, 400, "isRead must be true or false");
        }
      }

      // get id from req data
      const id = req?.data?.id as number;

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // call service
      const service = await NotifikasiService.findAll(id, { limit, page });

      // return success
      return ResponseResult.success(service, res, 200);
    } catch (error) {
      next(error);
    }
  }
}
