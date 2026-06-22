import { NextFunction, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  VerifikasiType,
  VerifikasiUpdateType,
} from "../models/verifikasi.model";
import { ResponseRiwayatType } from "../models/riwayat.model";
import { RiwayatService } from "../services/riwayat.service";
import { DosenRole, TipeRiwayat } from "../utils/contstanst";
import { AuthRequest } from "../types/authRequest";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";

export class VerifikasiController {
  // verifikasi kebutuhan dokumentasi pic
  static async verifikasi(
    req: AuthRequest<{}, {}, VerifikasiType>,
    res: Response<ResponseStructure<ResponseRiwayatType | null>>,
    next: NextFunction,
  ) {
    try {
      // get role
      const { role, id: dosenId } = req.data as { role: DosenRole; id: number };

      // get body
      const {
        kebutuhan_dokumentasi_pic_id,
        dokumentasi_borang_id,
        keterangan_verifikasi,
        status,
      } = req.body;

      let result: ResponseRiwayatType | null = null;

      // call service
      if (kebutuhan_dokumentasi_pic_id && role === DosenRole.wakil_dekan_1) {
        result = await RiwayatService.createForKebutuhanDokumentasi({
          dosen_id: dosenId,
          tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
          keterangan: keterangan_verifikasi,
          status,
        });
      }

      if (dokumentasi_borang_id && role === DosenRole.kaprodi) {
        result = await RiwayatService.createForDokumentasiBorang({
          dosen_id: dosenId,
          tipe_riwayat: TipeRiwayat.DOKUMENTASI_BORANG,
          dokumentasi_borang_id,
          keterangan: keterangan_verifikasi,
          status,
        });
      }

      // check service
      if (!result) {
        return ResponseResult.error(
          res,
          400,
          "verifikasi kebutuhan dokumentasi pic gagal",
        );
      }

      return ResponseResult.success<ResponseRiwayatType | null>(
        result,
        res,
        200,
        "success verifikasi kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }

  // update verifikasi
  static async updateVerifikasi(
    req: AuthRequest<{}, {}, VerifikasiUpdateType>,
    res: Response<
      ResponseStructure<ResponseRiwayatType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id parmas
      const { id } = res.locals.validatedParams;

      // get periode
      const idPeriode = req?.periode?.id;

      // check distribusi
      if (!idPeriode) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get body
      const {
        dokumentasi_borang_id,
        kebutuhan_dokumentasi_pic_id,
        keterangan_verifikasi,
        status,
      } = req.body;

      // check distribusi for verifikasi kebutuhan dokumentasi
      if (kebutuhan_dokumentasi_pic_id) {
        const isDistribusi =
          await DistribusiKebutuhanDokumentasiService.findByPeriode(idPeriode);

        if (isDistribusi?.is_active) {
          return ResponseResult.error(res, 404, "distribusi sedang aktif");
        }
      }

      // get role
      const { role, id: dosenId } = req.data as { role: DosenRole; id: number };

      // find riwayat and get dosen id
      const dosenInRiwayat = await RiwayatService.findByIdForGetDosenId({ id });

      // check
      if (!dosenInRiwayat) {
        return ResponseResult.error(res, 400, "riwayat tidak ditemukan");
      }

      // service
      let result: ResponseRiwayatType | null = null;

      if (kebutuhan_dokumentasi_pic_id && role === DosenRole.wakil_dekan_1) {
        result = await RiwayatService.updateForKebutuhanDokumentasiPic({
          ...(dosenId !== dosenInRiwayat && {
            dosen_id: dosenId,
          }),
          riwayat_id: id,
          data: {
            keterangan: keterangan_verifikasi,
            kebutuhan_dokumentasi_pic_id,
            status,
          },
        });
      }

      if (dokumentasi_borang_id && role === DosenRole.kaprodi) {
        result = await RiwayatService.updateForDokumentasiBorang({
          ...(dosenId !== dosenInRiwayat && {
            dosen_id: dosenId,
          }),
          riwayat_id: id,
          data: {
            keterangan: keterangan_verifikasi,
            dokumentasi_borang_id,
            status,
          },
        });
      }

      // check service
      if (!result) {
        return ResponseResult.error(res, 400, "update verifikasi gagal");
      }

      return ResponseResult.success<ResponseRiwayatType | null>(
        result,
        res,
        200,
        "success update verifikasi kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
