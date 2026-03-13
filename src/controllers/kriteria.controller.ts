import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaService } from "../services/kriteria.service";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import checkParamsId from "../utils/checkParamsId";
import { NotifikasiService } from "../services/notifikasi.service";

export class KriteriaController {
  // create
  static async create(
    req: Request<{}, {}, CreateKriteriaType>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { kriteria, namaKriteria } = req.body;

      // call service
      const service = await KriteriaService.create({ kriteria, namaKriteria });

      // push notifikasi
      await NotifikasiService.notifyKriteriaDitambah(
        service?.namaKriteria ?? "",
      );

      //   return
      return ResponseResult.success<ResponseKriteriaType | null>(
        service,
        res,
        201,
        "success create kriteria",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read detail by id
  static async readById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const checkId = checkParamsId(res, id);

      // call service
      const service = await KriteriaService.readById(checkId as number);

      //   check
      if (!service) {
        return ResponseResult.error(res, 404, "kriteria not found");
      }

      //   return
      return ResponseResult.success<ResponseKriteriaType | null>(
        service,
        res,
        200,
        "success read kriteria by id",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read all
  static async readAll(
    req: Request<{}, {}, {}, PaginationType & { status?: "baru" | "revisi" }>,
    res: Response<ResponseStructure<ResponseKriteriaWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, status, sort } = req.query;

      // check sort
      if (sort) {
        if (sort !== "asc" && sort !== "desc") {
          return ResponseResult.error(res, 400, "sort must be asc or desc");
        }
      }

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // check query status
      if (status) {
        if (status !== "baru" && status !== "revisi") {
          return ResponseResult.error(
            res,
            400,
            "status must be baru or revisi",
          );
        }
      }

      // call service
      const service = await KriteriaService.readAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        status,
        sort,
      });

      // return
      return ResponseResult.success<ResponseKriteriaWithMetaType | null>(
        service,
        res,
        200,
        "success read all kriteria",
      );
    } catch (error) {
      next(error);
    }
  }

  //   update
  static async update(
    req: Request<{ id: string }, {}, UpdateKriteriaType>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const checkId = checkParamsId(res, id);

      // find kriteria by id
      const kriteria = await KriteriaService.readById(checkId as number);

      // check kriteria
      if (!kriteria)
        return ResponseResult.error(res, 404, "kriteria not found");

      // call service
      const service = await KriteriaService.update(
        Number(id),
        kriteria.revisi,
        req.body,
      );

      // push notifikasi
      await NotifikasiService.notifyKriteriaDiedit(service?.namaKriteria ?? "");

      // return
      return ResponseResult.success<ResponseKriteriaType | null>(
        service,
        res,
        200,
        "success update kriteria",
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
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return ResponseResult.error(res, 400, "Bad request");
      }

      // call service
      const service = await KriteriaService.delete(Number(id));

      //   check
      if (!service) return ResponseResult.error(res, 404, "kriteria not found");

      // push notifikasi
      await NotifikasiService.notifyKriteriaDihapus(service.namaKriteria);

      // return
      return ResponseResult.successNoContent(null, res, "success delete");
    } catch (error) {
      next(error);
    }
  }
}
