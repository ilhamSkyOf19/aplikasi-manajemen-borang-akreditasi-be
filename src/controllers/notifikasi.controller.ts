import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { AuthRequest } from "../types/authRequest";
import { NotifikasiService } from "../services/notifikasi.service";
import { PaginationType } from "../types/pagination";
import {
  ResponseNotifikasiType,
  ResponseNotifikasiWithMetaType,
} from "../models/notifikasi.model";

export class NotifikasiController {
  // get notifikasi
  static async getNotifikasi(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseNotifikasiWithMetaType | null>,
      { validatedQuery: PaginationType & { isRead?: boolean } }
    >,
    next: NextFunction,
  ) {
    try {
      // get role
      const role = req.data?.role;
      const dosenId = req.data?.id;

      // get periode
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get query
      const { limit, page, search, sort, isRead } = res.locals.validatedQuery;

      // call service
      const service = await NotifikasiService.getNotifikasiByRole({
        role: role!,
        dosenId,
        periodeId,
        query: {
          limit,
          page,
          search,
          sort,
          isRead,
        },
      });

      return ResponseResult.success<ResponseNotifikasiWithMetaType | null>(
        service,
        res,
      );
    } catch (error) {
      next(error);
    }
  }

  // is read
  static async isRead(
    _req: Request,
    response: Response<
      ResponseStructure<ResponseNotifikasiType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const id = response.locals.validatedParams.id;

      // call service
      const service = await NotifikasiService.isRead(id);

      return ResponseResult.success<ResponseNotifikasiType | null>(
        service,
        response,
      );
    } catch (error) {
      next(error);
    }
  }
}
