import { NextFunction, Request, Response } from "express";
import {
  CreatePicType,
  MyPIcResponse,
  ResponsePicType,
  ResponsePicWithMetaType,
  UpdatePicType,
} from "../models/pic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { TimAkreditasiService } from "../services/timAkreditasi.service";
import { PicService } from "../services/pic.service";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";
import checkParamsId from "../utils/checkParamsId";
import { RiwayatService } from "../services/riwayat.service";
import { NotifikasiService } from "../services/notifikasi.service";
import { AuthRequest } from "../types/authRequest";
import { KriteriaService } from "../services/kriteria.service";
import { PendekatanService } from "../services/pendekatan.service";

export class PicController {
  // create
  static async create(
    req: Request<{}, {}, CreatePicType>,
    res: Response<ResponseStructure<ResponsePicType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body from params
      const {
        keterangan,
        timAkreditasiId,
        kriteriaId,
        namaDokumen,
        pendekatanId,
      } = req.body;

      // find tim akreditasi id
      const findTimAkreditasi =
        await TimAkreditasiService.readManyByIds(timAkreditasiId);

      // check
      if (!findTimAkreditasi)
        return ResponseResult.error(res, 404, "tim akreditasi not found");

      // check kriteria
      const checkKriteria = await KriteriaService.readById(kriteriaId);

      if (!checkKriteria)
        return ResponseResult.error(res, 404, "kriteria not found");

      // check pendekatan id
      const checkPendekatan = await PendekatanService.readById(pendekatanId);

      if (!checkPendekatan)
        return ResponseResult.error(res, 404, "pendekatan not found");

      // call service
      const service = await PicService.create({
        kriteriaId,
        namaDokumen,
        pendekatanId,
        keterangan,
        timAkreditasiId,
      });

      // check
      if (!service)
        return ResponseResult.error(res, 500, "internal server error");

      // push notifikasi
      await NotifikasiService.notifyPicBaruKeWD1(
        service.id,
        service.namaDokumen,
      );

      return ResponseResult.success<ResponsePicType | null>(
        service,
        res,
        200,
        "success create pic",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read all
  static async readAll(
    req: Request<
      {},
      {},
      {},
      PaginationType & {
        status?: string;
        kriteria?: string;
        pendekatan?: string;
        sort?: string;
      }
    >,
    res: Response<ResponseStructure<ResponsePicWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get query from params
      const {
        limit,
        page,
        search,
        status,
        kriteria,
        pendekatan,
        sort = "desc",
      } = req.query;

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // check query status
      if (status) {
        if (["menunggu", "revisi", "disetujui"].includes(status) === false) {
          return ResponseResult.error(res, 400, "status tidak valid");
        }
      }

      //   call service
      const service = await PicService.readAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        status: status as Status,
        kriteria,
        pendekatan,
        sort,
      });

      return ResponseResult.success<ResponsePicWithMetaType | null>(
        service,
        res,
        200,
        "success read all pic",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read by id
  static async readById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<ResponsePicType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = req.params;

      // check params
      const checkId = checkParamsId(res, id);

      // call service
      const service = await PicService.readById(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      // return success
      return ResponseResult.success<ResponsePicType | null>(
        service,
        res,
        200,
        "success read pic by id",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read by id user
  static async readByUserId(
    req: AuthRequest,
    res: Response<ResponseStructure<MyPIcResponse[] | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      // call service
      const service = await PicService.readByUserId(id!);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      // return success
      return ResponseResult.success<MyPIcResponse[] | null>(
        service,
        res,
        200,
        "success read pic by id",
      );
    } catch (error) {
      next(error);
    }
  }

  //   update
  static async update(
    req: Request<{ id: string }, {}, UpdatePicType>,
    res: Response<ResponseStructure<ResponsePicType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = req.params;

      // check id
      const checkId = checkParamsId(res, id);

      //   find pic
      const pic = await PicService.findById(checkId as number);

      //   check
      if (!pic) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      // get body
      const {
        keterangan,
        timAkreditasiId,
        keteranganUpdate,
        kriteriaId,
        namaDokumen,
        pendekatanId,
      } = req.body;

      // jika timAkreditasiId dikirim
      if (timAkreditasiId && timAkreditasiId?.length > 0) {
        // cari tim
        const timAkreditasi =
          await TimAkreditasiService.readManyByIds(timAkreditasiId);

        if (!timAkreditasi) {
          return ResponseResult.error(res, 404, "tim akreditasi not found");
        }
      }

      // call service
      const service = await PicService.update(checkId as number, {
        kriteriaId,
        namaDokumen,
        pendekatanId,
        keterangan,
        timAkreditasiId,
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      // find riwayat by pic id
      const findRiwayat = await RiwayatService.readAllByPicId(service.id);

      // check riwayat
      if (findRiwayat && findRiwayat.length > 0) {
        // check status di setujui
        if (findRiwayat.some((item) => item.status === Status.disetujui)) {
          const dataRiwayatDisetujui = findRiwayat.filter(
            (item) => item.status === Status.disetujui,
          );

          // delete data disetujui
          await RiwayatService.deleteMany(
            dataRiwayatDisetujui.map((item) => item.id),
          );
        }

        // create riwayat
        const riwayat = await RiwayatService.create({
          jenis: JenisRiwayat.pic,
          keterangan: keteranganUpdate,
          status: Status.menunggu,
          picId: service ? service.id : 0,
        });

        // check riwayat
        if (!riwayat) {
          return ResponseResult.error(res, 404, "riwayat not found");
        }
      }

      // push notifikasi
      await NotifikasiService.notifyPicRevisiKaprodiKeWD1(
        service.id,
        service.namaDokumen,
      );

      // return success
      return ResponseResult.success<ResponsePicType | null>(
        service,
        res,
        200,
        "success update pic",
      );
    } catch (error) {
      next(error);
    }
  }

  //   delete
  static async delete(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = req.params;

      // check id
      const checkId = checkParamsId(res, id);

      // call service
      const service = await PicService.delete(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      // return success
      return ResponseResult.successNoContent(null, res, "success delete pic");
    } catch (error) {
      next(error);
    }
  }
}
