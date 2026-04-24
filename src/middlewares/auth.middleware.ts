import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { PayloadUserType } from "../models/dosen.model";
import { ENV } from "../utils/env";
export const authMiddleware = (
  req: AuthRequest,
  res: Response<ResponseStructure<null>>,
  next: NextFunction,
) => {
  try {
    // get token from cookie
    const token: string = req.cookies?.token;

    // cek token
    if (!token) return ResponseResult.unauthorized(res, "Token not found");

    // get payload
    const payload = jwt.verify(token, ENV.SECRET_KEY) as PayloadUserType;

    // set request user
    req.data = {
      id: payload.id,
      name: payload.nama,
      email: payload.email,
      role: payload.role,
    };

    // next
    next();
  } catch (error) {
    // error handler
    console.log(error);
    next(error);
  }
};
