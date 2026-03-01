import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaService } from "../services/kriteira.service";
import {
  CreateKebutuhanDokumenType,
  ResponseKebutuhanDokumenChooseWithMetaType,
  ResponseKebutuhanDokumenType,
  ResponseKebutuhanDokumenUpdateStatusType,
  ResponseKebutuhanDokumenWithMetaType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { PendekatanService } from "../services/pendekatan.service";
import { KebutuhanDokumenService } from "../services/kebutuhanDokumen.service";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import { JenisRiwayat, Status } from "../utils/contstanst";
import { UpdateStatusType } from "../models/status.model";
import { RiwayatService } from "../services/riwayat.service";

export class kebutuhanDokumenController {
  // create
  static async create(
    req: Request<{}, {}, CreateKebutuhanDokumenType>,
    res: Response<ResponseStructure<ResponseKebutuhanDokumenType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { keterangan, kriteriaId, namaDokumen, pendekatanId } = req.body;

      // check kriteria
      const checkKriteria = await KriteriaService.readById(kriteriaId);

      if (!checkKriteria)
        return ResponseResult.error(res, 404, "kriteria not found");

      // check pendekatan id
      const checkPendekatan = await PendekatanService.readById(pendekatanId);

      if (!checkPendekatan)
        return ResponseResult.error(res, 404, "pendekatan not found");

      //   call service
      const service = await KebutuhanDokumenService.create({
        keterangan,
        kriteriaId,
        namaDokumen,
        pendekatanId,
      });

      // check
      if (!service)
        return ResponseResult.error(
          res,
          500,
          "gagal membuat kebutuhan dokumen",
        );

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumenType | null>(
        service,
        res,
        200,
        "success create kebutuhan dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  // read choose
  static async readChoose(
    req: Request<{}, {}, {}, PaginationType>,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumenChooseWithMetaType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { page, limit, search } = req.query;

      // check
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // call service
      const service = await KebutuhanDokumenService.readChoose({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
      });

      return ResponseResult.success<ResponseKebutuhanDokumenChooseWithMetaType | null>(
        service,
        res,
        200,
        "success read kebutuhan dokumen choose",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read by id
  static async readById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<ResponseKebutuhanDokumenType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const checkId = checkParamsId(res, id);

      //   call service
      const service = await KebutuhanDokumenService.readById(checkId as number);

      // check
      if (!service)
        return ResponseResult.error(res, 404, "kebutuhan dokumen not found");

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumenType | null>(
        service,
        res,
        200,
        "success read kebutuhan dokumen by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // read all
  static async readAll(
    req: Request<
      {},
      {},
      {},
      PaginationType & {
        kriteria: string;
        status: Status;
      }
    >,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumenWithMetaType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, status, kriteria } = req.query;

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      //   check
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      //   check status
      if (status) {
        if (
          status !== Status.menunggu &&
          status !== Status.revisi &&
          status !== Status.disetujui
        ) {
          return ResponseResult.error(
            res,
            400,
            "status must be baru or revisi",
          );
        }
      }

      // call service
      const service = await KebutuhanDokumenService.readAll({
        page: checkQuery.page,
        limit: checkQuery.limit,
        kriteria,
        search,
        status: status as Status,
      });

      // check
      if (!service) {
        return ResponseResult.error(
          res,
          500,
          "gagal membaca kebutuhan dokumen",
        );
      }

      // return
      return ResponseResult.success<ResponseKebutuhanDokumenWithMetaType | null>(
        service,
        res,
        200,
        "success read all kebutuhan dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  //   update
  static async update(
    req: Request<{ id: string }, {}, UpdateKebutuhanDokumenType>,
    res: Response<ResponseStructure<ResponseKebutuhanDokumenType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const checkId = checkParamsId(res, id);

      //   find data
      const findData = await KebutuhanDokumenService.readById(
        checkId as number,
      );

      // check data
      if (!findData)
        return ResponseResult.error(res, 404, "kebutuhan dokumen not found");

      // get body
      const { keterangan, kriteriaId, namaDokumen, pendekatanId } = req.body;

      // check kriteria id
      if (kriteriaId) {
        const checkKriteria = await KriteriaService.readById(kriteriaId);

        if (!checkKriteria)
          return ResponseResult.error(res, 404, "kriteria not found");
      }

      // check pendekatan id
      if (pendekatanId) {
        const checkPendekatan = await PendekatanService.readById(pendekatanId);

        if (!checkPendekatan)
          return ResponseResult.error(res, 404, "pendekatan not found");
      }

      // call service
      const service = await KebutuhanDokumenService.update(findData.id, {
        keterangan,
        kriteriaId,
        namaDokumen,
        pendekatanId,
      });

      // check service
      if (!service)
        return ResponseResult.error(res, 500, "gagal update kebutuhan dokumen");

      // return
      return ResponseResult.success<ResponseKebutuhanDokumenType | null>(
        service,
        res,
        200,
        "success update kebutuhan dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  // update status
  static async updateStatusPic(
    req: Request<{ id: string }, {}, UpdateStatusType>,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumenUpdateStatusType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = req.params;

      // check id
      const checkId = checkParamsId(res, id);

      // find pic
      const pic = await KebutuhanDokumenService.findById(checkId as number);

      // check
      if (!pic) {
        return ResponseResult.error(res, 404, "kebutuhan dokumen not found");
      }

      // get body
      const { status, keterangan } = req.body;

      // call service
      const service = await KebutuhanDokumenService.updateStatus(
        checkId as number,
        status,
      );

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "kebutuhan dokumen not found");
      }

      // check status revisi
      if (service.status === "revisi") {
        // find status success
        const checkStatusSuccess = await RiwayatService.findByPicIdAndStatus(
          service.id,
          Status.disetujui,
        );

        // check
        if (checkStatusSuccess) {
          // delete status
          await RiwayatService.deleteRiwayatKebutuhanDokumen({
            idRiwayat: checkStatusSuccess.id,
            kebutuhanDokumenId: service.id,
          });
        }
      }

      // create riwayat
      const riwayat = await RiwayatService.create({
        jenis: JenisRiwayat.kebutuhan_dokumen,
        keterangan,
        status,
        kebutuhanDokumenId: service.id,
      });

      // check riwayat
      if (!riwayat) {
        return ResponseResult.error(res, 404, "riwayat not found");
      }

      // return success
      return ResponseResult.success<ResponseKebutuhanDokumenUpdateStatusType | null>(
        service,
        res,
        200,
        "success update status kebutuhan dokumen",
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
      // parse id
      const id = req.params.id;

      //check id
      const checkId = checkParamsId(res, id);

      // call service
      const service = await KebutuhanDokumenService.delete(checkId as number);

      // check service
      if (!service)
        return ResponseResult.error(res, 500, "gagal delete kebutuhan dokumen");

      // return
      return ResponseResult.success<null>(
        null,
        res,
        200,
        "success delete kebutuhan dokumen",
      );
    } catch (error) {
      next(error);
    }
  }
}
