import { Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";

const checkParamsId = (
  res: Response,
  value: any,
): number | Response<ResponseStructure<null>> => {
  const id = Number(value);

  if (isNaN(id)) {
    return ResponseResult.error(res, 400, "Id tidak valid");
  }

  return id; // kalau valid, kembalikan ID
};

export default checkParamsId;
