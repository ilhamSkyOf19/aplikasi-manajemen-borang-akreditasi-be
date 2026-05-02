import { NextFunction, Request, Response } from "express";
import {
  AddPicToKriteriaType,
  ResponseCreateUpdateKriteriaPicType,
} from "../models/kriteriaPic.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { KriteriaPicServices } from "../services/kriteriaPic.service";
import { DosenServices } from "../services/dosen.service";
import { DosenRole } from "../utils/contstanst";
import { KriteriaServices } from "../services/kriteria.service";
import checkParamsId from "../utils/checkParamsId";

export class KriteriaPicController {
  // create
  static async addPicToKriteria(
    req: Request<{}, {}, AddPicToKriteriaType>,
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
      const result = await KriteriaPicServices.addPicToKriteria({
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
}
