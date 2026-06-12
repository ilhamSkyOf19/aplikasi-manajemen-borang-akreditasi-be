import { NextFunction, Request, Response } from "express";

import { ResponseResult, ResponseStructure } from "../types/response";
import { NamaDokumentasiServices } from "../services/namaDokumentasi.service";
import { PaginationType } from "../types/pagination";
import { DosenRole, Status, TipeRiwayat } from "../utils/contstanst";
import { RiwayatService } from "../services/riwayat.service";
import { AuthRequest } from "../types/authRequest";
import { NamaKebutuhanDokumentasiServices } from "../services/namaKebutuhanDokumentasi.service";
import {
  CreateKebutuhanDokumentasiRequestType,
  ResponseCreateUpdateKebutuhanDokumentasiType,
  ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType,
  ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType,
  ResponseKebutuhanDokumentasiType,
  UpdateKebutuhanDokumentasiRequestType,
} from "../models/kebutuhanDokumentasi.model";
import { KebutuhanDokumentasiServices } from "../services/kebutuhanDokumentasi.service";
import { LokasiServices } from "../services/lokasi.service";

export class KebutuhanDokumentasiController {
  // create
  static async create(
    req: AuthRequest<{}, {}, CreateKebutuhanDokumentasiRequestType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateKebutuhanDokumentasiType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get body
      const {
        nama_dokumentasi_new,
        kriteria_id,
        pendekatan_id,
        nama_dokumentasi_id,
        tipe_dokumentasi,
        keterangan,
        lokasi,
      } = req.body;

      // get dosen id
      const dosenId = req?.data?.id;

      //   nama dokumentasi new
      let namaKebutuhanDokumentasiNew: number | null = null;

      //   check nama dokumentasi new || pic new
      if (nama_dokumentasi_new) {
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
      }

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

      if (lokasi.some((lokasi) => lokasi.lokasi_old)) {
        // find pic
        const getLokasiOld = lokasi
          .map((lokasi) => lokasi.lokasi_old!)
          .filter((item) => item !== null && item !== undefined);

        const getLokasi = await LokasiServices.findByIds(getLokasiOld);

        // check pic
        if (getLokasi === 0) {
          return ResponseResult.error(res, 400, "pic tidak ditemukan");
        }
      }

      //   final data
      const finalNamaDokumentasiId =
        nama_dokumentasi_id ?? namaKebutuhanDokumentasiNew;
      //   call service
      const service = await KebutuhanDokumentasiServices.create({
        kriteria_id,
        pendekatan_id,
        nama_dokumentasi_id: finalNamaDokumentasiId as number,
        lokasi,
        tipe_dokumentasi,
        keterangan,
      });

      //   check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi lokasi gagal dibuat",
        );
      }

      // create riwayat
      const riwayat = await RiwayatService.createForKebutuhanDokumentasi({
        dosen_id: dosenId ?? 0,
        tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
        keterangan: "Membuat kebutuhan dokumentasi pic",
        kebutuhan_dokumentasi_id: service.id,
        status: Status.PENDING,
      });

      // check riwayat
      if (!riwayat) {
        return ResponseResult.error(res, 400, "riwayat gagal dibuat");
      }

      //   service succes
      return ResponseResult.success<ResponseCreateUpdateKebutuhanDokumentasiType | null>(
        service,
        res,
        201,
        "success create kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kriteria pic
  static async findAllByKriteriaPic(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType | null>,
      {
        validatedQuery: Omit<PaginationType, "sort">;
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search } = res.locals.validatedQuery;

      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get role from req data
      const { role } = req.data as { role: DosenRole };

      // call service
      const service =
        await KebutuhanDokumentasiServices.findAllByKriteriaLokasi({
          periode_id,
          query: {
            role,
            limit,
            page,
            search,
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
      return ResponseResult.success<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kriteria pic
  static async findAllByKriteriaPendekatan(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>,
      {
        validatedQuery: PaginationType & { status?: Status };
        validatedParams: {
          kriteria_id: number;
          pendekatan_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get query
      const { limit, page, search, sort, status } = res.locals.validatedQuery;

      // get params
      const { kriteria_id, pendekatan_id } = res.locals.validatedParams;

      // call service
      const service =
        await KebutuhanDokumentasiServices.findAllByKriteriaAndPendekatan({
          periode_id,
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
      return ResponseResult.success<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // find by id
  static async findById(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiType | null>,
      {
        validatedParams: { id: number };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id } = res.locals.validatedParams;

      // call service
      const service = await KebutuhanDokumentasiServices.findById(id);

      // check service
      if (!service)
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi lokasi not found",
        );

      // return result
      return ResponseResult.success<ResponseKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success read kebutuhan dokumentasi lokasi by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by dosen id
  static async findAllForDokumentasiBorang(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType | null>,
      {
        validatedQuery: PaginationType;
      }
    >,
    next: NextFunction,
  ) {
    try {
      const periode_id = req?.periode?.id;

      // get role from req data
      const { role, id } = req?.data as { role: DosenRole; id: number };

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service =
        await KebutuhanDokumentasiServices.findAllForDokumentasiBorang({
          periode_id,
          dosen_id: id,
          role,
          query: {
            limit,
            page,
            search,
            sort,
          },
        });

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi not found",
        );
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kriteria pic
  static async findAllForDokumentasiBorangByKriteriaPendekatan(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>,
      {
        validatedQuery: PaginationType & { status?: Status };
        validatedParams: {
          kriteria_id: number;
          pendekatan_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get query
      const { limit, page, search, sort, status } = res.locals.validatedQuery;

      // get params
      const { kriteria_id, pendekatan_id } = res.locals.validatedParams;

      // get dosen id
      const { id, role } = req?.data as { id: number; role: DosenRole };

      // call service
      const service =
        await KebutuhanDokumentasiServices.findAllforDokumentasiBorangByKriteriaAndPendekatan(
          {
            periode_id,
            dosen: {
              id,
              role,
            },
            kriteria_id,
            pendekatan_id,
            query: {
              limit,
              page,
              search,
              sort,
              status: status as Status,
            },
          },
        );

      // check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi pic not found",
        );
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all for dokumentasi borang complated
  static async findAllForDokumentasiBorangComplated(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>,
      {
        validatedQuery: PaginationType;
        validatedParams: {
          kriteria_id: number;
          pendekatan_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // get params
      const { kriteria_id, pendekatan_id } = res.locals.validatedParams;

      // call service
      const service =
        await KebutuhanDokumentasiServices.findAllforDokumentasiBorangComplated(
          {
            periode_id,
            kriteria_id,
            pendekatan_id,
            query: {
              limit,
              page,
              search,
              sort,
            },
          },
        );

      // check service
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null>(
        service,
        res,
        200,
        "success read all",
      );
    } catch (error) {
      next(error);
    }
  }

  // update
  static async update(
    req: AuthRequest<{}, {}, UpdateKebutuhanDokumentasiRequestType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateKebutuhanDokumentasiType | null>,
      { validatedParams: { kebutuhan_dokumentasi_pic_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { kebutuhan_dokumentasi_pic_id } = res.locals.validatedParams;

      // find kebutuhan dokumentasi by id
      const findKebutuhanDokumentasi =
        await KebutuhanDokumentasiServices.findById(
          kebutuhan_dokumentasi_pic_id,
        );

      // check
      if (!findKebutuhanDokumentasi) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi lokasi not found",
        );
      }

      // get dosen id
      const dosenId = req?.data?.id;

      // get body
      const {
        nama_dokumentasi_new,
        kriteria_id,
        pendekatan_id,
        nama_dokumentasi_id,
        lokasi,
        tipe_dokumentasi,
        keterangan,
        keterangan_update,
      } = req.body;

      //   nama dokumentasi new
      let namaKebutuhanDokumentasiNew: number | null = null;

      //   check nama dokumentasi new || pic new
      if (nama_dokumentasi_new) {
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
      }

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

      if (lokasi && lokasi.length > 0) {
        if (lokasi?.some((lokasi) => lokasi.lokasi_old)) {
          // find pic
          const getLokasiOld = lokasi
            .map((pic) => pic.lokasi_old!)
            .filter((item) => item !== null && item !== undefined);

          const getLokasi = await LokasiServices.findByIds(getLokasiOld);

          // check pic
          if (getLokasi === 0) {
            return ResponseResult.error(res, 400, "lokasi tidak ditemukan");
          }
        }
      }

      //   final data
      const finalNamaDokumentasiId =
        nama_dokumentasi_id ?? namaKebutuhanDokumentasiNew;

      //   call service
      const service = await KebutuhanDokumentasiServices.update(
        kebutuhan_dokumentasi_pic_id,
        {
          kriteria_id,
          pendekatan_id,
          nama_dokumentasi_id: finalNamaDokumentasiId ?? undefined,
          lokasi,
          tipe_dokumentasi,
          keterangan,
        },
      );

      //   check service
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi lokasi gagal dibuat",
        );
      }

      // check count nama kebutuhan dokumentasi
      const count =
        await NamaKebutuhanDokumentasiServices.getCountInKebutuhanDokumentasiById(
          findKebutuhanDokumentasi.nama_kebutuhan_dokumentasi.id,
        );

      // check count
      if (count === 0) {
        // delete nama kebutuhan dokumentasi jika sudah tidak digunakan
        await NamaKebutuhanDokumentasiServices.delete(
          findKebutuhanDokumentasi.nama_kebutuhan_dokumentasi.id,
        );
      }

      // create riwayat
      const riwayat = await RiwayatService.createForKebutuhanDokumentasi({
        dosen_id: dosenId ?? 0,
        tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
        keterangan: keterangan_update,
        kebutuhan_dokumentasi_id: service.id,
        status: Status.PENDING,
      });

      // check riwayat
      if (!riwayat) {
        return ResponseResult.error(res, 400, "riwayat gagal dibuat");
      }

      //   service succes
      return ResponseResult.success<ResponseCreateUpdateKebutuhanDokumentasiType | null>(
        service,
        res,
        201,
        "success update kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // delete
  static async delete(
    _req: Request,
    res: Response<ResponseStructure<null>, { validatedParams: { id: number } }>,
    next: NextFunction,
  ) {
    try {
      // call db
      const service = await KebutuhanDokumentasiServices.delete(
        res.locals.validatedParams.id,
      );

      // check
      if (!service) {
        return ResponseResult.error(
          res,
          400,
          "kebutuhan dokumentasi lokasi gagal dihapus",
        );
      }

      return ResponseResult.successNoContent(
        res,
        "success delete kebutuhan dokumentasi lokasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
