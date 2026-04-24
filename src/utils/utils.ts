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
