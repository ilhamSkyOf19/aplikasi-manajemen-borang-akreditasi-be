import { NextFunction, Request, Response } from "express";
import {
  CreateKebutuhanDokumentasiPicRequestType,
  ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType,
  ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType,
  ResponseKebutuhanDokumentasiPicType,
} from "../models/kebutuhanDokumentasiPic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { checkBothFilled } from "../utils/utils";
import { NamaDokumentasiServices } from "../services/namaDokumentasi.service";
import { PicServices } from "../services/pic.service";
import { KebutuhanDokumentasiPicServices } from "../services/kebutuhanDokumentasiPic.service";
import { PaginationType } from "../types/pagination";
import { Status } from "../utils/contstanst";

export class KebutuhanDokumentasiPicController {
  // create
  static async create(
    req: Request<{}, {}, CreateKebutuhanDokumentasiPicRequestType>,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiPicType | null>
    >,
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
      return ResponseResult.success<ResponseKebutuhanDokumentasiPicType | null>(
        service,
        res,
        201,
        "success create kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kriteria pic
  static async findAllByKriteriaPic(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType | null>,
      { validatedQuery: PaginationType & { status?: Status } }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort, status } = res.locals.validatedQuery;

      // call service
      const service =
        await KebutuhanDokumentasiPicServices.findAllByKriteriaPic({
          limit,
          page,
          search,
          sort,
          status: status as Status,
        });

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi pic not found",
        );
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kriteria pic
  static async findAllByKriteriaPendekatan(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType | null>,
      {
        validatedQuery: PaginationType & { status?: Status };
        validatedParams: { kriteria_id: number; pendekatan_id: number };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort, status } = res.locals.validatedQuery;

      // get params
      const { kriteria_id, pendekatan_id } = res.locals.validatedParams;

      // call service
      const service =
        await KebutuhanDokumentasiPicServices.findAllByKriteriaAndPendekatan({
          kriteria_id,
          pendekatan_id,
          query: {
            limit,
            page,
            search,
            sort,
            status: status as Status,
          },
        });

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi pic not found",
        );
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
