import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { DokumenBorangService } from "../services/dokumenBorang.service";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  DaftarDokumenBorang,
  DaftarKebutuhanDokumentasiItemType,
} from "../models/dokumenBorang.model";
import checkParamsId from "../utils/checkParamsId";

export class DokumenBorangController {
  // read daftar dokumen by user id
  static async readDaftarDokumen(
    req: AuthRequest,
    res: Response<ResponseStructure<DaftarDokumenBorang[] | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      // call service
      const service = await DokumenBorangService.readDaftarDokumen(id!);

      return ResponseResult.success<DaftarDokumenBorang[] | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  //   get daftar kebutuhan dokumentasi by user id & krieria, pendekatan
  static async readDaftarKebutuhanDokumentasi(
    req: AuthRequest<{ kriteria: string; pendekatan: string }>,
    res: Response<
      ResponseStructure<DaftarKebutuhanDokumentasiItemType[] | null>
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

      // call service
      const service =
        await DokumenBorangService.findKebutuhanDokumentasiByUserAndKriteriaAndPendekatan(
          id!,
          checkKriteria as number,
          pendekatan,
        );

      return ResponseResult.success<
        DaftarKebutuhanDokumentasiItemType[] | null
      >(service, res, 200);
    } catch (error) {
      next(error);
    }
  }
}
