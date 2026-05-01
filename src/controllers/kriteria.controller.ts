import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaType,
  ResponseKriteriaPicWithMetaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaServices } from "../services/kriteria.service";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import checkParamsId from "../utils/checkParamsId";
import { checkSort } from "../utils/utils";

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
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKriteriaType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // parse id
      const { id } = res.locals.validatedParams;

      // call service
      const service = await KriteriaServices.findById(id);

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
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKriteriaWithMetaType | null>,
      { validatedQuery: PaginationType }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await KriteriaServices.findAll({
        limit,
        page,
        search,
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

  // find all with pic
  static async findAllWithPic(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseKriteriaPicWithMetaType | null>,
      { validatedQuery: PaginationType }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // call service
      const service = await KriteriaServices.findAllKriteriaWithPic({
        limit,
        page,
        search,
        sort,
      });

      // return
      return ResponseResult.success<ResponseKriteriaPicWithMetaType | null>(
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
    req: Request<{}, {}, UpdateKriteriaType>,
    res: Response<
      ResponseStructure<ResponseKriteriaType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // parse id
      const { id } = res.locals.validatedParams;

      // call service
      const service = await KriteriaServices.update(id, req.body);

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
