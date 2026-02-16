import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { UserService } from "../services/user.service";

export const aclMiddleware =
  (roles: string[]) =>
  async (
    req: AuthRequest,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) => {
    try {
      // get user id
      const userId = req.data?.id;

      // check db
      const user = await UserService.findUserById(userId!);

      // check roles
      if (!user || !roles.includes(user.role)) {
        return ResponseResult.error(res, 403, "Forbidden");
      }

      return next();
    } catch (error) {
      // return internal server error
      return ResponseResult.error(res, 500, "Internal server error");
    }
  };
