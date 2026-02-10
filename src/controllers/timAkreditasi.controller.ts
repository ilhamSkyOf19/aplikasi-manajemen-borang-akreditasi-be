import { NextFunction, Request, Response } from "express";
import {
  CreateTimAkreditasiType,
  ResponseTimAkreditasiType,
  ResponseTimAkreditasiWithMetaType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { UserService } from "../services/user.service";
import { TimAkreditasiService } from "../services/timAkreditasi.service";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";
import { checkQueryPagination } from "../utils/checkQueryPagination";

export class TimAkreditasiController {
  // create
  static async create(
    req: Request<{}, {}, CreateTimAkreditasiType>,
    res: Response<ResponseStructure<ResponseTimAkreditasiType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const body = req.body;

      // find users
      const findUsers = await UserService.findUserManyById(body.users);

      // cek find users
      if (!findUsers) {
        return ResponseResult.error(res, 400, "User not found");
      }

      // call service
      const service = await TimAkreditasiService.create(body);

      // cek service
      if (!service) {
        return ResponseResult.error(res, 400, "Failed create tim akreditasi");
      }

      // return success
      return ResponseResult.success<ResponseTimAkreditasiType | null>(
        service,
        res,
        201,
        "Success create tim akreditasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // read by id
  static async readById(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<ResponseTimAkreditasiType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = Number(req.params.id);

      // check params
      const checkId = checkParamsId(res, id);

      // call service
      const service = await TimAkreditasiService.readById(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "Tim akreditasi not found");
      }

      // return success
      return ResponseResult.success<ResponseTimAkreditasiType | null>(
        service,
        res,
        200,
        "Success read tim akreditasi by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // read all
  static async readAll(
    req: Request<{}, {}, {}, PaginationType>,
    res: Response<ResponseStructure<ResponseTimAkreditasiWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search } = req.query;

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // call service
      const service = await TimAkreditasiService.readAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
      });

      // return success
      return ResponseResult.success<ResponseTimAkreditasiWithMetaType | null>(
        service,
        res,
        200,
        "Success read all tim akreditasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // update
  static async update(
    req: Request<{ id: string }, {}, UpdateTimAkreditasiType>,
    res: Response<ResponseStructure<ResponseTimAkreditasiType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req.params.id;

      // get body
      const { namaTimAkreditasi, users } = req.body;

      //check id
      const checkId = checkParamsId(res, id);

      // find tim akreditasi
      const findTim = await TimAkreditasiService.readById(checkId as number);

      // cek tim akreditasi
      if (!findTim) {
        return ResponseResult.error(res, 404, "Tim akreditasi not found");
      }

      // get old users
      const oldUserIds = findTim.user.map((u) => u.id);

      // users update new
      let userNewUpdate: number[] = [];

      // find user
      if (users) {
        const findUsers = await UserService.findUserManyById(users);

        // cek find users
        if (!findUsers) {
          return ResponseResult.error(res, 400, "User not found");
        }

        const toDelete = oldUserIds.filter((id) => !users?.includes(id));

        // set user new
        userNewUpdate = users.filter((id) => !oldUserIds.includes(id));

        // delete relasi
        if (toDelete.length > 0) {
          await TimAkreditasiService.deleteRelasiUsers(
            checkId as number,
            toDelete,
          );
        }
      }

      // call service
      const service = await TimAkreditasiService.update(checkId as number, {
        namaTimAkreditasi,
        users: userNewUpdate,
      });

      // return success
      return ResponseResult.success<ResponseTimAkreditasiType | null>(
        service,
        res,
        200,
        "Success update tim akreditasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // delete by id
  static async delete(
    req: Request<{ id: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = Number(req.params.id);

      // check params
      const checkId = checkParamsId(res, id);

      // call service
      const service = await TimAkreditasiService.delete(checkId as number);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "Tim akreditasi not found");
      }

      // return success
      return ResponseResult.success<null>(
        null,
        res,
        200,
        "Success delete tim akreditasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
