import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";

import { ActivationCodeService } from "../services/activationCode.service";
import { rolePriority } from "../utils/contstanst";
export const resetPasswordMiddleware = async (
  req: AuthRequest,
  res: Response<ResponseStructure<null>>,
  next: NextFunction,
) => {
  try {
    // get token from cookie
    const reset_token = req.cookies?.reset_token;

    // cek token
    if (!reset_token)
      return ResponseResult.unauthorized(res, "Token not found");

    // get payload
    const payload = await ActivationCodeService.findByResetToken({
      reset_token,
    });

    // cek payload
    if (!payload) return ResponseResult.unauthorized(res, "Token not found");

    const defaultRole = rolePriority.find((role) =>
      payload.dosen.roles!.includes(role),
    );

    // set request user
    req.data = {
      id: payload.dosen.id,
      name: payload.dosen.nama,
      email: payload.dosen.email,
      role: defaultRole!,
    };

    // next
    next();
  } catch (error) {
    // error handler
    console.log(error);
    next(error);
  }
};
