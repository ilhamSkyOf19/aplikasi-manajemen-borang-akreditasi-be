import { NextFunction, Request, Response } from "express";
import { CreateUserType, ResponseUserType } from "../models/user.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { UserService } from "../services/user.service";
import argon2 from "argon2";

export class AuthController {
  // register
  static async register(
    req: Request<{}, {}, CreateUserType>,
    res: Response<ResponseStructure<ResponseUserType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const body = req.body;

      // hash password
      const hashedPassword = await argon2.hash(body.password.trim(), {
        type: argon2.argon2id,
        hashLength: 64,
      });

      // call service
      const service = await UserService.create({
        nama: body.nama.trim(),
        email: body.email.trim(),
        password: hashedPassword,
      });

      // response success
      return ResponseResult.success<ResponseUserType | null>(
        service,
        res,
        201,
        "success register user",
      );
    } catch (error) {
      next(error);
    }
  }
}
