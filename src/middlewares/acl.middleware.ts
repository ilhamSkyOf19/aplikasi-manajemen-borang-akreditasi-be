import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { DosenServices } from "../services/dosen.service";
import { DosenRole } from "../utils/contstanst";

export const aclMiddleware =
  (allowRoles: DosenRole[]) =>
  async (
    req: AuthRequest,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) => {
    try {
      // get user id
      const dosenId = req.data?.id;

      // role dosen
      const roleDosen = req.data?.role;

      // check db
      const dosen = await DosenServices.findById(dosenId!);
      // check roles
      if (
        !dosen ||
        !dosen.roles.includes(roleDosen!) ||
        !allowRoles.includes(roleDosen!)
      ) {
        return ResponseResult.error(res, 403, "Forbidden");
      }

      return next();
    } catch (error) {
      // return internal server error
      return ResponseResult.error(res, 500, "Internal server error", [
        "aclMiddleware",
      ]);
    }
  };
