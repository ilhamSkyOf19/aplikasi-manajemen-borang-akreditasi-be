import { NextFunction, Request, Response } from "express";
import {
  CreateKriteriaPicType,
  ResponseCreateUpdateKriteriaPicType,
  ResponseKriteriaPicType,
  ResponseKriteriaPicWithMetaType,
  UpdateKriteriaPicType,
} from "../models/kriteriaPic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaPicServices } from "../services/kriteriaPic.service";
import { DosenServices } from "../services/dosen.service";
import { DosenRole } from "../utils/contstanst";
import { KriteriaServices } from "../services/kriteria.service";
import { PaginationType } from "../types/pagination";
import { checkSort } from "../utils/utils";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import checkParamsId from "../utils/checkParamsId";

export class KriteriaPicController {
  // create
  static async create(
    req: Request<{}, {}, CreateKriteriaPicType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateKriteriaPicType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get data
      const { body } = req;

      //   find kriteria
      const findKriteria = await KriteriaServices.findUniqeById(
        body.kriteria_id,
      );

      //   check kriteria
      if (!findKriteria) {
        return ResponseResult.error(res, 400, "Kriteria tidak ditemukan");
      }

      //   find dosen
      const findDosen = await DosenServices.findDosenManyById(body.dosen_id);

      //   check role
      if (
        findDosen.some(
          (dosen) => !dosen.roles.includes(DosenRole.tim_akreditasi),
        )
      ) {
        return ResponseResult.error(
          res,
          400,
          "dosen tidak memiliki role tim akreditasi",
        );
      }

      // call service
      const result = await KriteriaPicServices.create({
        dosen_id: findDosen.map((dosen) => dosen.id),
        kriteria_id: findKriteria,
      });

      //   check result
      if (!result) {
        return ResponseResult.error(res, 400, "Kriteria PIC gagal dibuat");
      }

      // response
      return ResponseResult.success<ResponseCreateUpdateKriteriaPicType | null>(
        result,
        res,
        201,
        "Kriteria PIC berhasil dibuat",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all
  static async findAll(
    req: Request<{}, {}, {}, PaginationType>,
    res: Response<ResponseStructure<ResponseKriteriaPicWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get data
      const { limit, page, search, sort } = req.query;

      // check sort
      const cleanSort = checkSort(sort);

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      //   find kriteria pic
      const service = await KriteriaPicServices.findAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        sort: cleanSort,
      });

      // response
      return ResponseResult.success<ResponseKriteriaPicWithMetaType | null>(
        service,
        res,
        200,
        "success read all kriteria pic",
      );
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request<{ kriteria_id: string }, {}, UpdateKriteriaPicType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateKriteriaPicType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get data
      const { dosen_id } = req.body;

      // get params
      const { kriteria_id } = req.params;

      // check
      const cleanKriteriaId = checkParamsId(res, kriteria_id);

      //   find kriteria
      const findKriteriaPic = await KriteriaPicServices.getCountByKriteriaId(
        cleanKriteriaId as number,
      );

      //   check kriteria
      if (!findKriteriaPic) {
        return ResponseResult.error(res, 400, "Kriteria PIC tidak ditemukan");
      }

      //   find dosen
      const findDosen = await DosenServices.findDosenManyById(dosen_id);
      console.log(findDosen);
      //   check role
      if (
        findDosen.length === 0 ||
        findDosen.some(
          (dosen) => !dosen.roles.includes(DosenRole.tim_akreditasi),
        )
      ) {
        return ResponseResult.error(
          res,
          400,
          "dosen tidak memiliki role tim akreditasi",
        );
      }

      // call service
      const result = await KriteriaPicServices.update(
        cleanKriteriaId as number,
        {
          dosen_id: findDosen.map((dosen) => dosen.id),
        },
      );

      //   check result
      if (!result) {
        return ResponseResult.error(res, 400, "Kriteria PIC gagal diupdate");
      }

      // response
      return ResponseResult.success<ResponseCreateUpdateKriteriaPicType | null>(
        result,
        res,
        200,
        "Kriteria PIC berhasil diupdate",
      );
    } catch (error) {
      next(error);
    }
  }

  // delete
  static async delete(
    req: Request<{ kriteria_id: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { kriteria_id } = req.params;

      // check id
      const checkId = checkParamsId(res, kriteria_id);

      // call service
      const service = await KriteriaPicServices.delete(checkId as number);

      // check service
      if (service === 0) {
        return ResponseResult.error(res, 404, "Kriteria PIC not found");
      }

      // return success
      return ResponseResult.successNoContent(
        res,
        "success delete kriteria pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
