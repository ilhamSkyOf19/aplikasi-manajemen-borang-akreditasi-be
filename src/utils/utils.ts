import { Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";

export const checkSort = (sort: string | undefined): SortOrder => {
  if (!sort) {
    return "desc";
  }

  if (sort !== "asc" && sort !== "desc") {
    return "desc";
  }

  return sort;
};

// check exist same data
const isFilled = (value: unknown): boolean => {
  return value !== undefined && value !== null && value !== "";
};

export const checkBothFilled = (
  firstData: unknown,
  secondData: unknown,
  res: Response<ResponseStructure<null>>,
) => {
  if (isFilled(firstData) && isFilled(secondData)) {
    return ResponseResult.error(
      res,
      400,
      "Data lama dan data baru tidak boleh diisi bersamaan",
    );
  }

  if (!isFilled(firstData) && !isFilled(secondData)) {
    return ResponseResult.error(
      res,
      400,
      "Data lama dan data baru harus diisi salah satu",
    );
  }

  return null;
};
