import { PaginationType } from "../types/pagination";
import { DosenRole } from "../utils/contstanst";
import {
  ResponseDosenChooseWithMetaType,
  ResponseDosenType,
  ResponseDosenWithMetaType,
  UpdateDosenType,
} from "../models/dosen.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { NextFunction, Request, Response } from "express";
import { DosenServices } from "../services/dosen.service";

export class DosenController {
  // find all dosen
  static async findAll(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDosenWithMetaType | null>,
      { validatedQuery: PaginationType & { role?: DosenRole } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, role, sort } = res.locals.validatedQuery;

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
        limit,
        page,
        search,
        role: role as DosenRole,
        sort,
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

  // find all by role tim akreditasi
  static async findAllRoleTimAkreditasiForChoose(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDosenChooseWithMetaType | null>,
      {
        validatedQuery: {
          search?: string;
          page?: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { page, search } = res.locals.validatedQuery;

      // call service
      const service = await DosenServices.findAllRoleTimAkreditasiForChoose({
        page,
        search,
      });

      return ResponseResult.success<ResponseDosenChooseWithMetaType | null>(
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
  static async findById(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDosenType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { id } = res.locals.validatedParams;
      // call service
      const service = await DosenServices.findById(id);
      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "user not found");
      }
      // return success
      return ResponseResult.success<ResponseDosenType | null>(
        service,
        res,
        200,
        "success read dosen by id",
      );
    } catch (error) {
      next(error);
    }
  }

  // // update
  static async update(
    req: Request<{}, {}, UpdateDosenType>,
    res: Response<
      ResponseStructure<ResponseDosenType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = res.locals.validatedParams;
      // get body
      const body = req.body;

      // find dosen
      const findDosen = await DosenServices.findById(id);

      if (!findDosen) {
        return ResponseResult.error(res, 400, "dosen not found");
      }

      // check body role
      // if (body.roles?.includes(DosenRole.wakil_dekan_1)) {
      //   // check count wd 1
      const countWd1 = await DosenServices.findCountRole(
        DosenRole.wakil_dekan_1,
      );

      if (countWd1) {
        // check count === 2
        if (countWd1 === 2) {
          return ResponseResult.error(res, 400, "max record wd 1 is 2");
        }

        if (
          countWd1 === 1 &&
          findDosen.roles.includes(DosenRole.wakil_dekan_1) &&
          !body.roles?.includes(DosenRole.wakil_dekan_1)
        ) {
          return ResponseResult.error(res, 400, "min record wd 1 is 1");
        }
      }

      // update user
      const service = await DosenServices.update(id, body);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "dosen not found");
      }
      // return success
      return ResponseResult.success<ResponseDosenType | null>(
        service,
        res,
        200,
        "success update dosen",
      );
    } catch (error) {
      next(error);
    }
  }

  // delete
  static async delete(
    _req: Request,
    res: Response<ResponseStructure<null>, { validatedParams: { id: number } }>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { id } = res.locals.validatedParams;

      // find user by id
      const dosen = await DosenServices.findById(id);
      // check user
      if (!dosen) {
        return ResponseResult.error(res, 404, "dosen not found");
      }

      // check role dosen
      if (dosen.roles.includes(DosenRole.wakil_dekan_1)) {
        // check count role wd 1
        const countWd1 = await DosenServices.findCountRole(
          DosenRole.wakil_dekan_1,
        );

        if (countWd1 === 1) {
          return ResponseResult.error(res, 400, "cannot delete wd 1");
        }
      }

      // call service
      await DosenServices.delete(id);
      // return success
      return ResponseResult.successNoContent(res, "success delete dosen");
    } catch (error) {
      next(error);
    }
  }
}
