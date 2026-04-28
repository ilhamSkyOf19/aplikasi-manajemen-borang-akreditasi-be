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

    const path = result.error.issues.map((error) => error.path.join("."));
    return {
      meta: {
        message: errorMessages,
        statusCode: 400,
        customField: path,
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
