import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { VerifikasiServices } from "../services/verifikasi.service";
import { KebutuhanDokumentasiPicServices } from "../services/kebutuhanDokumentasiPic.service";
import { VerifikasiKebutuhanDokumentasiPicType } from "../models/kebutuhanDokumentasiPic.model";
import { ResponseRiwayatType } from "../models/riwayat.model";
import { VerifikasiDokumentasiBorangType } from "../models/dokumentasiBorang.model";

export class VerifikasiController {
  // verifikasi kebutuhan dokumentasi pic
  static async verifikasiKebutuhanDokumentasiPic(
    req: Request<{}, {}, VerifikasiKebutuhanDokumentasiPicType>,
    res: Response<ResponseStructure<ResponseRiwayatType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { kebutuhan_dokumentasi_pic_id, keterangan_verifikasi, status } =
        req.body;

      // call service
      const service =
        await VerifikasiServices.verifikasiKebutuhanDokumentasiPic({
          kebutuhan_dokumentasi_pic_id,
          keterangan_verifikasi,
          status,
        });

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "verifikasi kebutuhan dokumentasi pic gagal",
        );
      }

      return ResponseResult.success<ResponseRiwayatType | null>(
        service,
        res,
        200,
        "success verifikasi kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }

  // verifikasi dokumentasi borang
  static async verifikasiDokumentasiBorang(
    req: Request<{}, {}, VerifikasiDokumentasiBorangType>,
    res: Response<ResponseStructure<ResponseRiwayatType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { dokumentasi_borang_id, keterangan_verifikasi, status } = req.body;

      // call service
      const service = await VerifikasiServices.verifikasiDokumentasiBorang({
        dokumentasi_borang_id,
        keterangan_verifikasi,
        status,
      });

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "verifikasi dokumentasi borang  gagal",
        );
      }

      return ResponseResult.success<ResponseRiwayatType | null>(
        service,
        res,
        200,
        "success verifikasi dokumentasi borang",
      );
    } catch (error) {
      next(error);
    }
  }
}
