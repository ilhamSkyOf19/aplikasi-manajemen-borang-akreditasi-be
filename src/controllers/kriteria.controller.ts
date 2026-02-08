import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaService } from "../services/kriteira.service";
import { PaginationType } from "../types/pagination";

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
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return ResponseResult.error(res, 400, "Bad request");
      }

      // call service
      const service = await KriteriaService.readById(Number(id));

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
    req: Request<{}, {}, {}, PaginationType>,
    res: Response<ResponseStructure<ResponseKriteriaWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get pagination from query
      const { page, limit, search } = req.query;

      // validasi page & limit jika ada
      if (page || limit) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (isNaN(pageNumber) || isNaN(limitNumber)) {
          return ResponseResult.error(
            res,
            400,
            "page and limit must be numbers",
          );
        }
      }

      // call service
      const service = await KriteriaService.readAll({
        page: Number(page || 1),
        limit: Number(limit || 8),
        search,
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
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return ResponseResult.error(res, 400, "Bad request");
      }

      // find kriteria by id
      const kriteria = await KriteriaService.readById(id);

      // check kriteria
      if (!kriteria)
        return ResponseResult.error(res, 404, "kriteria not found");

      // call service
      const service = await KriteriaService.update(
        Number(id),
        kriteria.revisi,
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

      // return
      return ResponseResult.success<null>(
        null,
        res,
        200,
        "success delete kriteria",
      );
    } catch (error) {
      next(error);
    }
  }
}
