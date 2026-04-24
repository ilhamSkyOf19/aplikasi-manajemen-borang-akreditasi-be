import { PaginationType } from "../types/pagination";
import { DosenRole } from "../utils/contstanst";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import {
  PayloadDosenType,
  ResponseDosenWithMetaType,
  UpdateDosenType,
} from "../models/dosen.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { NextFunction, Request, Response } from "express";
import { DosenServices } from "../services/dosen.service";
import checkParamsId from "../utils/checkParamsId";
import { checkSort } from "../utils/utils";

export class DosenController {
  // find all dosen
  static async findAll(
    req: Request<{}, {}, {}, PaginationType & { role?: string }>,
    res: Response<ResponseStructure<ResponseDosenWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, role, sort } = req.query;
      // check sort
      const cleanSort = checkSort(sort);

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query status
      if (role) {
        if (
          role !== DosenRole.wakil_dekan_1 &&
          role !== DosenRole.kaprodi &&
          role !== DosenRole.tim_akreditasi
        ) {
          return ResponseResult.error(
            res,
            400,
            "status must be baru or revisi",
          );
        }
      }
      // call service
      const service = await DosenServices.findAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        role: role as DosenRole,
        sort: cleanSort,
      });
      // return success
      return ResponseResult.success<ResponseDosenWithMetaType | null>(
        service,
        res,
        200,
        "success read dosen",
      );
    } catch (error) {
      next(error);
    }
  }

  // //   read by id
  // static async readById(
  //   req: Request<{ id: string }>,
  //   res: Response<ResponseStructure<PayloadUserType | null>>,
  //   next: NextFunction,
  // ) {
  //   try {
  //     // get params
  //     const id = req.params.id;
  //     // check params
  //     const checkId = checkParamsId(res, id);
  //     // call service
  //     const service = await UserService.findUserById(checkId as number);
  //     // check service
  //     if (!service) {
  //       return ResponseResult.error(res, 404, "user not found");
  //     }
  //     // return success
  //     return ResponseResult.success<PayloadUserType | null>(
  //       service,
  //       res,
  //       200,
  //       "success read user by id",
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // // update
  static async update(
    req: Request<{ id: string }, {}, UpdateDosenType>,
    res: Response<ResponseStructure<PayloadDosenType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req.params.id;
      // get body
      const body = req.body;
      // check params
      const cleanId = checkParamsId(res, id);

      // update user
      const service = await DosenServices.update(cleanId as number, body);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "dosen not found");
      }
      // return success
      return ResponseResult.success<PayloadDosenType | null>(
        service,
        res,
        200,
        "success update dosen",
      );
    } catch (error) {
      next(error);
    }
  }
  // // delete
  static async delete(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req.params.id;
      // check params
      const checkId = checkParamsId(res, id);
      // check
      if (!checkId) {
        return ResponseResult.error(res, 400, "id must be number");
      }
      // find user
      const findUser = await DosenServices.findById(checkId as number);
      // check count wakil dekan
      if (findUser?.role === DosenRole.wakil_dekan_1) {
        return ResponseResult.error(
          res,
          400,
          "Wakil Dekan 1 tidak boleh dihapus",
        );
      }
      // call service
      await DosenServices.delete(checkId as number);
      // return success
      return ResponseResult.successNoContent(res, "success delete dosen");
    } catch (error) {
      next(error);
    }
  }
}
