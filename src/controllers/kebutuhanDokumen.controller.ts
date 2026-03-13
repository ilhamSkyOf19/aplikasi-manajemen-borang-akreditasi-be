import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaService } from "../services/kriteria.service";
import {
  CreateKebutuhanDokumenType,
  ResponseKebutuhanDokumenChooseWithMetaType,
  ResponseKebutuhanDokumenType,
  ResponseKebutuhanDokumenWithMetaType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { PendekatanService } from "../services/pendekatan.service";
import { KebutuhanDokumenService } from "../services/kebutuhanDokumen.service";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";
import { RiwayatService } from "../services/riwayat.service";
import { CreateRiwayatType } from "../models/riwayat.model";
import { NotifikasiService } from "../services/notifikasi.service";
import { PicService } from "../services/pic.service";

export class KebutuhanDokumenController {
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
        kriteria?: string;
        status?: Status;
        pendekatan?: string;
      }
    >,
    res: Response<
      ResponseStructure<ResponseKebutuhanDokumenWithMetaType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, status, kriteria, pendekatan, sort } =
        req.query;

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
        pendekatan,
        sort,
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
      const {
        keterangan,
        kriteriaId,
        namaDokumen,
        pendekatanId,
        keteranganUpdate,
      } = req.body;

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

      // check riwayat
      const checkRiwayat =
        await RiwayatService.findAllRiwayatByKebutuhanDokumenId(
          checkId as number,
        );

      // check flag kebutuhan
      if (
        checkRiwayat?.some((item) =>
          item.flagRevisi?.some(
            (flag) =>
              flag === "kebutuhan_dokumen" && item.status === "menunggu",
          ),
        )
      ) {
        return ResponseResult.error(
          res,
          409,
          "Document requirement pending verification",
        );
      }

      //  check status
      if (checkRiwayat && checkRiwayat.length > 0) {
        // check status disetujui
        if (checkRiwayat.some((item) => item.status === Status.disetujui)) {
          const dataRiwayatDisetujui = checkRiwayat.filter(
            (item) => item.status === Status.disetujui,
          );

          // delete data disetujui
          await RiwayatService.deleteMany(
            dataRiwayatDisetujui.map((item) => item.id),
          );
        }

        // get id pic
        const picids = [
          ...new Set(checkRiwayat.map((item) => item.pic?.id ?? 0)),
        ];

        // update status
        const updateStatusPics = await PicService.updateManyStatus(
          picids,
          Status.menunggu,
        );

        // check
        if (!updateStatusPics)
          return ResponseResult.error(res, 500, "gagal update status pic");

        // data riwayat
        const dataRiwayat: CreateRiwayatType[] = picids.map((id) => ({
          jenis: JenisRiwayat.pic,
          status: Status.menunggu,
          keterangan: keteranganUpdate,
          picId: id,
          flagRevisi: [FlagRevisi.kebutuhan_dokumen],
        }));

        // create riwayat
        const riwayat = await RiwayatService.createMany(dataRiwayat);

        // check riwayat
        if (!riwayat)
          return ResponseResult.error(res, 500, "gagal create riwayat");
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

      // push notifikasi
      await NotifikasiService.notifyPicRevisiKaprodiKeWD1(
        service.id,
        service.namaDokumen,
      );

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
      return ResponseResult.successNoContent(null, res, "success delete");
    } catch (error) {
      next(error);
    }
  }
}
