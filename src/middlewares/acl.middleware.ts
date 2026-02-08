import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";

export const aclMiddleware =
  (roles: string[]) =>
  (
    req: AuthRequest,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) => {
    try {
      // get user roles from request
      const userRoles = req.data?.role;

      // check roles
      if (!userRoles || !roles.includes(userRoles)) {
        return ResponseResult.error(res, 403, "Forbidden");
      }

      return next();
    } catch (error) {
      // return internal server error
      return ResponseResult.error(res, 500, "Internal server error");
    }
  };
