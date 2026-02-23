import { NextFunction, Request, Response } from "express";
import {
  CreatePicType,
  ResponsePicType,
  ResponsePicWithMetaType,
  UpdatePicType,
} from "../models/pic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KebutuhanDokumenService } from "../services/kebutuhanDokumen.service";
import { TimAkreditasiService } from "../services/timAkreditasi.service";
import { UserService } from "../services/user.service";
import { PicService } from "../services/pic.service";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import { Status } from "../utils/contstanst";
import checkParamsId from "../utils/checkParamsId";

export class PicController {
  // create
  static async create(
    req: Request<{}, {}, CreatePicType>,
    res: Response<ResponseStructure<ResponsePicType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body from params
      const { kebutuhanDokumenId, keterangan, pjId, timAkreditasiId } =
        req.body;

      // find kebutuhan dokumen id
      const findKebutuhanDokumen =
        await KebutuhanDokumenService.readById(kebutuhanDokumenId);

      // check
      if (!findKebutuhanDokumen)
        return ResponseResult.error(res, 404, "kebutuhan dokumen not found");

      // find tim akreditasi id
      const findTimAkreditasi =
        await TimAkreditasiService.readById(timAkreditasiId);

      // check
      if (!findTimAkreditasi)
        return ResponseResult.error(res, 404, "tim akreditasi not found");

      // find & check pj id
      for (const pj of pjId) {
        // find user by id
        const findUser = findTimAkreditasi.user.find((u) => u.id === pj);

        // check
        if (!findUser) return ResponseResult.error(res, 404, "user not found");
      }

      // call service
      const service = await PicService.create({
        kebutuhanDokumenId,
        keterangan,
        pjId,
        timAkreditasiId,
      });

      // check
      if (!service)
        return ResponseResult.error(res, 500, "internal server error");

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
      }
    >,
    res: Response<ResponseStructure<ResponsePicWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get query from params
      const { limit, page, search, status } = req.query;

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
      const { kebutuhanDokumenId, keterangan, pjId, timAkreditasiId } =
        req.body;

      // check if kebutuhan dokumen exist in request
      if (kebutuhanDokumenId) {
        // find kebutuhan dokumen
        const findKebutuhanDokumen =
          await KebutuhanDokumenService.readById(kebutuhanDokumenId);

        // check kebutuhan dokumen
        if (!findKebutuhanDokumen) {
          return ResponseResult.error(res, 404, "kebutuhan dokumen not found");
        }
      }

      // jika salah satu diisi tapi yang lain tidak
      if ((timAkreditasiId && !pjId) || (!timAkreditasiId && pjId)) {
        return ResponseResult.error(
          res,
          400,
          "tim akreditasi id dan pj id harus diisi bersamaan",
        );
      }

      // jika timAkreditasiId dikirim
      if (timAkreditasiId) {
        // cari tim
        const timAkreditasi =
          await TimAkreditasiService.readById(timAkreditasiId);

        if (!timAkreditasi) {
          return ResponseResult.error(res, 404, "tim akreditasi not found");
        }

        // jika pjId dikirim dan tidak kosong
        if (pjId && pjId.length > 0) {
          const userIdsInTim = new Set(timAkreditasi.user.map((u) => u.id));

          // cek apakah ada pjId yang tidak ada di tim
          const invalidPj = pjId.find((id) => !userIdsInTim.has(id));

          if (invalidPj) {
            return ResponseResult.error(
              res,
              404,
              `user dengan id ${invalidPj} tidak ada dalam tim akreditasi`,
            );
          }
        }
      }

      // call service
      const service = await PicService.update(checkId as number, {
        kebutuhanDokumenId,
        keterangan,
        pjId,
        timAkreditasiId,
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "pic not found");
      }

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
      return ResponseResult.success<null>(null, res, 200, "success delete pic");
    } catch (error) {
      next(error);
    }
  }
}
