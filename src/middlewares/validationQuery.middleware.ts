import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { ResponseResult, ResponseStructure } from "../types/response";

export const zodValidationQuery = <T>(schema: ZodType<T>) => {
  return async (
    req: Request,
    res: Response<ResponseStructure<null>, { validatedQuery: T }>,
    next: NextFunction,
  ) => {
    try {
      // cek validasi
      const data = schema.parse(req.query);

      // set body
      res.locals.validatedQuery = data;

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
