import { NextFunction, Request, Response } from "express";
import { VerifikasiKebutuhanDokumentasiPic } from "../models/verifikasiKebutuhanDokumentasiPic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { VerifikasiServices } from "../services/verifikasi.service";
import { KebutuhanDokumentasiPicServices } from "../services/kebutuhanDokumentasiPic.service";
import { ResponseCreateRiwayatKebutuhanDokumentasiPicType } from "../models/riwayat.model";

export class verifikasiController {
  // verifikasi kebutuhan dokumentasi pic
  static async verifikasiKebutuhanDokumentasiPic(
    req: Request<{}, {}, VerifikasiKebutuhanDokumentasiPic>,
    res: Response<
      ResponseStructure<ResponseCreateRiwayatKebutuhanDokumentasiPicType | null>
    >,
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

      return ResponseResult.success(
        service,
        res,
        200,
        "success verifikasi kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
