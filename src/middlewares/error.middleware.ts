import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import multer from "multer";

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

    const modelName = err.meta?.modelName as unknown as string;

    switch (err.code) {
      case "P2002":
        return ResponseResult.error(res, 409, `unique constraint failed `, [
          modelName,
        ]);

      case "P2025":
        return ResponseResult.error(res, 404, `Record not found`, [modelName]);

      default:
        return ResponseResult.error(res, 500, "Internal server error", [
          "prisma",
        ]);
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

  // error from multer
  // ===============================
  // MULTER ERROR
  // ===============================
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return ResponseResult.error(res, 400, "file terlalu besar");

      case "LIMIT_FILE_COUNT":
        return ResponseResult.error(res, 400, "file terlalu banyak");

      case "MISSING_FIELD_NAME":
        return ResponseResult.error(res, 400, "file tidak ada");

      case "LIMIT_UNEXPECTED_FILE":
        return ResponseResult.error(res, 400, "file tidak sesuai");

      default:
        return ResponseResult.error(res, 500, "Internal server error", [
          "multer",
        ]);
    }
  }

  // ===============================
  // CUSTOM FILE TYPE ERROR
  // ===============================
  if (err instanceof Error && err.message === "Invalid file type") {
    return ResponseResult.error(
      res,
      400,
      "Tipe file tidak sesuai, hanya PDF yang diizinkan",
    );
  }

  // error throw
  if (err instanceof Error) {
    return ResponseResult.error(res, 400, err.message);
  }

  // generic error catch
  return ResponseResult.error(
    res,
    err.statusCode || 500,
    err.message || "Internal server error",
  );
};
