import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { DokumenBorangService } from "../services/dokumenBorang.service";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  DaftarDokumenBorangByKriteriaWithMeta,
  DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta,
  DaftarKebutuhanDokumentasiItemType,
} from "../models/dokumenBorang.model";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";

export class DokumenBorangController {
  // read daftar dokumen by user id
  static async readDaftarDokumen(
    req: AuthRequest,
    res: Response<
      ResponseStructure<DaftarDokumenBorangByKriteriaWithMeta | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      // call service
      const service = await DokumenBorangService.readDaftarDokumen(id!, {});

      return ResponseResult.success<DaftarDokumenBorangByKriteriaWithMeta | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  //   get daftar kebutuhan dokumentasi by user id & krieria, pendekatan
  static async readDaftarKebutuhanDokumentasiByKriteriaAndPendekatan(
    req: AuthRequest<
      { kriteria: string; pendekatan: string },
      {},
      {},
      PaginationType
    >,
    res: Response<
      ResponseStructure<DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      //   get params
      const { kriteria, pendekatan } = req.params;

      //   check kriteria
      const checkKriteria = checkParamsId(res, kriteria);

      // get data from query
      const { limit = 10, page, search } = req.query;

      // call service
      const service =
        await DokumenBorangService.findKebutuhanDokumentasiByUserAndKriteriaAndPendekatan(
          id!,
          checkKriteria as number,
          pendekatan,
          { page, limit, search },
        );

      return ResponseResult.success<DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}
