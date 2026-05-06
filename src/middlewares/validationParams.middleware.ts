import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { ResponseResult, ResponseStructure } from "../types/response";

export const zodValidationParams = <T>(schema: ZodType<T>) => {
  return async (
    req: Request,
    res: Response<ResponseStructure<null>, { validatedParams: T }>,
    next: NextFunction,
  ) => {
    try {
      const data = schema.parse(req.params);

      res.locals.validatedParams = data;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error);
        const message = error.issues[0]?.message ?? "Validation error";
        const path = error.issues[0]?.path.join(".") ?? "";

        return ResponseResult.error(res, 400, message, [path]);
      }

      return ResponseResult.error(res, 500, "Internal server error");
    }
  };
};
