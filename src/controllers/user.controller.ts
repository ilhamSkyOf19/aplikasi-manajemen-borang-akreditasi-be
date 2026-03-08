import { PaginationType } from "../types/pagination";
import { UserRole } from "../utils/contstanst";
import { checkQueryPagination } from "../utils/checkQueryPagination";
import {
  PayloadUserType,
  ResponseUserWithMetaType,
  UpdateUserType,
} from "../models/user.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import checkParamsId from "../utils/checkParamsId";

export class UserController {
  static async readAll(
    req: Request<{}, {}, {}, PaginationType & { role?: string }>,
    res: Response<ResponseStructure<ResponseUserWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, role, sort } = req.query;

      // check sort
      if (sort) {
        if (sort !== "asc" && sort !== "desc") {
          return ResponseResult.error(res, 400, "sort tidak valid");
        }
      }

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // check query status
      if (role) {
        if (
          role !== UserRole.wakil_dekan_1 &&
          role !== UserRole.kaprodi &&
          role !== UserRole.tim_akreditasi
        ) {
          return ResponseResult.error(
            res,
            400,
            "status must be baru or revisi",
          );
        }
      }

      // call service
      const service = await UserService.readAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        role: role as UserRole,
        sort,
      });

      // return success
      return ResponseResult.success<ResponseUserWithMetaType | null>(
        service,
        res,
        200,
        "success read user",
      );
    } catch (error) {
      next(error);
    }
  }

  //   read by id
  static async readById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<PayloadUserType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const id = req.params.id;

      // check params
      const checkId = checkParamsId(res, id);

      // call service
      const service = await UserService.findUserById(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "user not found");
      }

      // return success
      return ResponseResult.success<PayloadUserType | null>(
        service,
        res,
        200,
        "success read user by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // update
  static async update(
    req: Request<{ id: string }, {}, UpdateUserType>,
    res: Response<ResponseStructure<PayloadUserType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req.params.id;

      // get body
      const body = req.body;

      // check params
      const checkId = checkParamsId(res, id);

      // check
      if (!checkId) {
        return ResponseResult.error(res, 400, "id must be number");
      }

      // find user
      const findUser = await UserService.findUserById(checkId as number);

      // check user
      if (!findUser) {
        return ResponseResult.error(res, 404, "user not found");
      }

      // update user
      const service = await UserService.update(findUser.id, body);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "user not found");
      }

      // return success
      return ResponseResult.success<PayloadUserType | null>(
        service,
        res,
        200,
        "success update user",
      );
    } catch (error) {
      next(error);
    }
  }

  // delete
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
      const findUser = await UserService.findUserById(checkId as number);

      // check count wakil dekan
      if (findUser?.role === UserRole.wakil_dekan_1) {
        return ResponseResult.error(
          res,
          400,
          "Wakil Dekan 1 tidak boleh dihapus",
        );
      }

      // call service
      const service = await UserService.delete(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "user not found");
      }

      // return success
      return ResponseResult.success<null>(
        null,
        res,
        200,
        "success delete user",
      );
    } catch (error) {
      next(error);
    }
  }
}
