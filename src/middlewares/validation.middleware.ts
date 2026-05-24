import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { ResponseResult, ResponseStructure } from "../types/response";

export const zodValidation = <T>(schema: ZodType<T>) => {
  return async (
    req: Request<{}, {}, T>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) => {
    try {
      // cek body
      if (!req.body) {
        return ResponseResult.error(res, 400, "body not found");
      }

      // cek validasi
      const data = schema.parse(req.body);

      // set body
      req.body = data;

      // next
      return next();
    } catch (error) {
      // cek error
      if (error instanceof ZodError) {
        // cek
        console.log(error);

        const message = error.issues.map((error) => error.message)[0];
        const path = error.issues.map((error) => error.path.join("."))[0];
        return ResponseResult.error(res, 400, message, [path]);
      }

      return ResponseResult.error(res, 500, "Internal server error");
    }
  };
};
