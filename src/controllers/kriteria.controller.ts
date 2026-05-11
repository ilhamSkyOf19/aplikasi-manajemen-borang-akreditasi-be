import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaType,
  ResponseKriteriaChooseType,
  ResponseKriteriaPicWithMetaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaServices } from "../services/kriteria.service";
import { PaginationType } from "../types/pagination";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";

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

      // create distribusi untuk kebutuhan dokumentasi
      await DistribusiKebutuhanDokumentasiService.create();

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

  // find all no pic
  static async findAllForChoose(
    _req: Request,
    res: Response<ResponseStructure<ResponseKriteriaChooseType[] | null>>,
    next: NextFunction,
  ) {
    try {
      // call service
      const service = await KriteriaServices.findAllForChoose();

      // return
      return ResponseResult.success<ResponseKriteriaChooseType[] | null>(
        service,
        res,
        200,
        "success find all kriteria",
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
    _req: Request,
    res: Response<ResponseStructure<null>, { validatedParams: { id: number } }>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id } = res.locals.validatedParams;

      await KriteriaServices.delete(id);

      // return
      return ResponseResult.successNoContent(res, "success delete");
    } catch (error) {
      next(error);
    }
  }
}
