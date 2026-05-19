import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { PayloadDosenType } from "../models/dosen.model";
import { ENV } from "../utils/env";
import { PeriodeServices } from "../services/periode.service";
export const periodeMiddleware = async (
  req: AuthRequest,
  res: Response<ResponseStructure<null>>,
  next: NextFunction,
) => {
  try {
    // get periode
    const periode = await PeriodeServices.findIsActive();

    // set request user
    req.periode = periode ?? undefined;

    // next
    next();
  } catch (error) {
    // error handler
    console.log(error);
    next(error);
  }
};
