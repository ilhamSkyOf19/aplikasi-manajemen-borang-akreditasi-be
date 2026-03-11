import { Request } from "express";
import { ZodType } from "zod";
import { ResponseStructure } from "../types/response";

// cek validasi
export const validation = <T>(
  schema: ZodType<T>,
  req: T,
): ResponseStructure<T | null> => {
  // cek result
  const result = schema.safeParse(req);

  // cek error
  if (!result.success) {
    const errorMessages = result.error.issues.map((err) => err.message)[0];

    const errorPath = result.error.issues.map((err) => err.path)[0];
    return {
      meta: {
        message: `${errorPath} : ${errorMessages}`,
        statusCode: 400,
      },
      data: null,
    };
  }

  return {
    meta: {
      message: "success",
      statusCode: 200,
    },
    data: result.data,
  };
};
