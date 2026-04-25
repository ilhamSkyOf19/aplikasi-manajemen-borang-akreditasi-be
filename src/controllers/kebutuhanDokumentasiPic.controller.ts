import { NextFunction, Request, Response } from "express";
import { CreateKebutuhanDokumentasiPicRequestType } from "../models/kebutuhanDokumentasi.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { checkBothFilled } from "../utils/utils";
import { NamaDokumentasiServices } from "../services/namaDokumentasi.service";
import { PicServices } from "../services/pic.service";
import { KebutuhanDokumentasiPicServices } from "../services/kebutuhanDokumentasiPic.service";

export class KebutuhanDokumentasiPicController {
  // create
  static async create(
    req: Request<{}, {}, CreateKebutuhanDokumentasiPicRequestType>,
    res: Response<ResponseStructure<any | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const {
        nama_dokumentasi_new,
        pic_new,
        kriteria_id,
        pendekatan_id,
        nama_dokumentasi_id,
        pic_id,
        tipe_dokumentasi,
        keterangan,
      } = req.body;

      //   check nama dokumentasi
      const checkRequestNamaDokumentasi = checkBothFilled(
        nama_dokumentasi_new,
        nama_dokumentasi_id,
        res,
      );

      if (checkRequestNamaDokumentasi) return checkRequestNamaDokumentasi;

      //   check request pic
      const checkRequestPic = checkBothFilled(pic_new, pic_id, res);

      if (checkRequestPic) return checkRequestPic;

      //   nama dokumentasi new
      let namaKebutuhanDokumentasiNew: number | null = null;
      //   pic new
      let picNew: number | null = null;

      //   check nama dokumentasi new || pic new
      if (nama_dokumentasi_new || pic_new) {
        if (nama_dokumentasi_new) {
          const namaDokumentasi =
            await NamaDokumentasiServices.create(nama_dokumentasi_new);

          if (!namaDokumentasi) {
            return ResponseResult.error(
              res,
              400,
              "Nama dokumentasi gagal dibuat",
            );
          }

          namaKebutuhanDokumentasiNew = namaDokumentasi.id;
        }

        // check pic
        if (pic_new) {
          const picNewService = await PicServices.create(pic_new);

          if (!picNewService) {
            return ResponseResult.error(res, 400, "pic gagal dibuat");
          }

          picNew = picNewService.id;
        }
      }

      if (pic_id || nama_dokumentasi_id) {
        if (nama_dokumentasi_id) {
          //   find nama dokumentasi
          const getNamaDokumentasi = await NamaDokumentasiServices.findById(
            nama_dokumentasi_id as number,
          );
          // check nama dokumentasi
          if (!getNamaDokumentasi) {
            return ResponseResult.error(
              res,
              400,
              "Nama dokumentasi tidak ditemukan",
            );
          }
        }

        if (pic_id) {
          // find pic
          const getPic = await PicServices.findById(pic_id as number);

          // check pic
          if (!getPic) {
            return ResponseResult.error(res, 400, "pic tidak ditemukan");
          }
        }
      }

      //   final data
      const finalNamaDokumentasiId =
        nama_dokumentasi_id ?? namaKebutuhanDokumentasiNew;

      const finalPicId = pic_id ?? picNew;
      //   call service
      const service = await KebutuhanDokumentasiPicServices.create({
        kriteria_id,
        pendekatan_id,
        nama_dokumentasi_id: finalNamaDokumentasiId as number,
        pic_id: finalPicId as number,
        tipe_dokumentasi,
        keterangan,
      });

      //   check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi pic gagal dibuat",
        );
      }

      //   service succes
      return ResponseResult.success<any | null>(
        service,
        res,
        201,
        "success create kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
