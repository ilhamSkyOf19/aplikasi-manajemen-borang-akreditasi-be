import { NextFunction, Request, Response } from "express";
import {
  CreateUserType,
  LoginUserType,
  PayloadUserType,
  ResponseUserType,
  ResponseUserWithMetaType,
} from "../models/user.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { UserService } from "../services/user.service";
import argon2 from "argon2";
import { generateAccessToken } from "../utils/jwt";
import { AuthRequest } from "../types/authRequest";
import { PaginationType } from "../types/pagination";
import { UserRole } from "../utils/contstanst";
import { checkQueryPagination } from "../utils/checkQueryPagination";

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
        role: body.role,
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

  // login
  static async login(
    req: Request<{}, {}, LoginUserType>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const body = req.body;

      console.log("body:", req.body);

      // call service
      const service = await UserService.findUser({
        identifier: body.identifier.trim(),
      });

      // cek user
      if (!service)
        return ResponseResult.error(
          res,
          400,
          "Email or nama or password is wrong",
        );

      // compare
      const isMatch = await argon2.verify(
        service.password,
        body.password.trim(),
      );

      // cek
      if (!isMatch)
        return ResponseResult.error(
          res,
          400,
          "Email or nama or password is wrong",
        );

      // generate token
      const token = generateAccessToken(service);

      // set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 24 * 60 * 60 * 1000,
      });

      // return success
      return ResponseResult.success<null>(null, res, 200, "success login user");
    } catch (error) {
      next(error);
    }
  }

  // auth me
  static async me(
    req: AuthRequest,
    res: Response<ResponseStructure<PayloadUserType | null>>,
    next: NextFunction,
  ) {
    try {
      // get res data
      const data = req.data;

      // cek data
      if (!data) return ResponseResult.unauthorized(res, "Token not found");

      // call service
      const service = await UserService.findUserById(data.id);

      // return success
      return ResponseResult.success<PayloadUserType | null>(
        service,
        res,
        200,
        "success login user",
      );
    } catch (error) {
      next(error);
    }
  }

  // read all
  static async readAll(
    req: Request<{}, {}, {}, PaginationType & { role?: string }>,
    res: Response<ResponseStructure<ResponseUserWithMetaType | null>>,
    next: NextFunction,
  ) {
    try {
      // get params
      const { limit, page, search, role } = req.query;

      // check query
      const checkQuery = checkQueryPagination(page, limit);

      // check query
      if (!checkQuery?.status) {
        return ResponseResult.error(res, 400, "page and limit must be numbers");
      }

      // check query status
      if (role) {
        if (
          role !== UserRole.wakil_dekan_1 &&
          role !== UserRole.kaprodi &&
          role !== UserRole.tim_akreditasi
        ) {
          return ResponseResult.error(
            res,
            400,
            "status must be baru or revisi",
          );
        }
      }

      // call service
      const service = await UserService.readAll({
        limit: checkQuery.limit,
        page: checkQuery.page,
        search,
        role: role as UserRole,
      });

      // return success
      return ResponseResult.success<ResponseUserWithMetaType | null>(
        service,
        res,
        200,
        "success read user",
      );
    } catch (error) {
      next(error);
    }
  }

  // logout
  static async logout(
    _req: Request,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      const isProduction = process.env.NODE_ENV === "production";

      // Clear cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });

      return ResponseResult.success<null>(null, res, 200, "success logout");
    } catch (error) {
      next(error);
    }
  }
}
