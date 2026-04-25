import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaServices } from "../services/kriteria.service";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import checkParamsId from "../utils/checkParamsId";
import { NotifikasiService } from "../services/notifikasi.service";
import { checkSort } from "../utils/utils";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";

export class KriteriaController {
  // create
  static async create(
    req: Request<{}, {}, CreateKriteriaType>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { kode_kriteria, nama_kriteria } = req.body;

      // call service
      const service = await KriteriaServices.create({
        kode_kriteria,
        nama_kriteria,
      });

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

  // //   read detail by id
  static async findById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const cleanId = checkParamsId(res, id);

      // call service
      const service = await KriteriaServices.findById(cleanId as number);

      //   check
      if (!service) {
        return ResponseResult.error(res, 404, "Record not found", ["kriteria"]);
      }

      //   return
      return ResponseResult.success<ResponseKriteriaType | null>(
        service,
        res,
        200,
        "success find kriteria by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // //   read all
  static async findAll(
    req: Request<{}, {}, {}, PaginationType>,
    res: Response<ResponseStructure<ResponseKriteriaWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, sort } = req.query;

      // check sort
      const cleanSort = checkSort(sort);

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // call service
      const service = await KriteriaServices.findAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        sort: cleanSort,
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

  // //   update
  static async update(
    req: Request<{ id: string }, {}, UpdateKriteriaType>,
    res: Response<ResponseStructure<ResponseKriteriaType | null>>,
    next: NextFunction,
  ) {
    try {
      // parse id
      const id = req.params.id;

      //check id
      const cleanId = checkParamsId(res, id);

      // call service
      const service = await KriteriaServices.update(
        cleanId as number,
        req.body,
      );

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

  // //   delete
  static async delete(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // check id
      const cleanId = checkParamsId(res, req.params.id);

      // call service
      await KriteriaServices.delete(cleanId as number);

      // return
      return ResponseResult.successNoContent(res, "success delete");
    } catch (error) {
      next(error);
    }
  }
}
