import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response<ResponseStructure<null>>,
  _next: NextFunction,
) => {
  // log
  console.log(err);

  // prisma error catch
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // switch case
    switch (err.code) {
      case "P2002":
        return ResponseResult.error(res, 409, "Duplicate field value entered");

      case "P2025":
        return ResponseResult.error(res, 404, "Resource not found");

      default:
        return ResponseResult.error(res, 500, "Internal server error");
    }
  }

  //   zod error catch
  if (err instanceof ZodError) {
    return ResponseResult.error(
      res,
      400,
      err.issues[0]?.message || "Invalid input",
    );
  }

  // generic error catch
  return ResponseResult.error(
    res,
    err.statusCode || 500,
    err.message || "Internal server error",
  );
};
