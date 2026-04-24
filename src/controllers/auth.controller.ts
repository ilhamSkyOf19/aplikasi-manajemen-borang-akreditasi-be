import { NextFunction, Request, Response } from "express";
import {
  CreateDosenType,
  LoginDosenType,
  PayloadDosenType,
  ResponseDosenType,
} from "../models/dosen.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { DosenServices } from "../services/dosen.service";
import argon2 from "argon2";
import { generateAccessToken } from "../utils/jwt";
import { AuthRequest } from "../types/authRequest";
import { DosenRole, rolePriority } from "../utils/contstanst";

export class AuthController {
  // register
  static async register(
    req: Request<{}, {}, CreateDosenType>,
    res: Response<ResponseStructure<ResponseDosenType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const body = req.body;

      // check body role
      if (body.roles?.includes(DosenRole.wakil_dekan_1)) {
        // check count wd 1
        const countWd1 = await DosenServices.findCountRole(
          DosenRole.wakil_dekan_1,
        );

        // check count === 2
        if (countWd1 === 2) {
          return ResponseResult.error(res, 400, "max record wd 1 is 2");
        }
      }

      // check password & confirm password
      if (body.password !== body.confirmPassword) {
        return ResponseResult.error(res, 400, "Password not match");
      }

      // hash password
      const hashedPassword = await argon2.hash(body.password.trim(), {
        type: argon2.argon2id,
        hashLength: 64,
      });

      // call service
      const service = await DosenServices.create({
        nama: body.nama.trim(),
        email: body.email.trim(),
        nidn: body.nidn.trim(),
        password: hashedPassword,
        roles: body.roles,
      });

      // response success
      return ResponseResult.success<ResponseDosenType | null>(
        service,
        res,
        201,
        "success register user",
      );
    } catch (error) {
      next(error);
    }
  }

  //  login
  static async login(
    req: Request<{}, {}, LoginDosenType>,
    res: Response<ResponseStructure<PayloadDosenType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const body = req.body;

      // call service
      const service = await DosenServices.findDosenByIdentifier({
        identifier: body.identifier.trim(),
      });

      // cek dosen
      if (!service) return ResponseResult.error(res, 400, "Data tidak valid");

      // compare password
      const isMatch = await argon2.verify(
        service.password,
        body.password.trim(),
      );

      // cek
      if (!isMatch) return ResponseResult.error(res, 400, "Data tidak valid");

      // get payload
      const { password, roles, ...payloadDosen } = service;

      // default role
      const defaultRole = rolePriority.find((role) => roles.includes(role))!;

      // generate token
      const token = generateAccessToken({
        ...payloadDosen,
        role: defaultRole,
      });

      const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000;

      // set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: COOKIE_MAX_AGE,
        path: "/api",
      });

      // return success
      return ResponseResult.success<PayloadDosenType | null>(
        {
          ...payloadDosen,
          role: defaultRole,
        },
        res,
        200,
        "success login user",
      );
    } catch (error) {
      next(error);
    }
  }

  // // // auth me
  // // static async me(
  // //   req: AuthRequest,
  // //   res: Response<ResponseStructure<PayloadUserType | null>>,
  // //   next: NextFunction,
  // // ) {
  // //   try {
  // //     // get res data
  // //     const data = req.data;

  // //     // cek data
  // //     if (!data) return ResponseResult.unauthorized(res, "Token not found");

  // //     // call service
  // //     const service = await UserService.findUserById(data.id);

  // //     // return success
  // //     return ResponseResult.success<PayloadUserType | null>(
  // //       service,
  // //       res,
  // //       200,
  // //       "success login user",
  // //     );
  // //   } catch (error) {
  // //     next(error);
  // //   }
  // // }

  // // // logout
  // // static async logout(
  // //   _req: Request,
  // //   res: Response<ResponseStructure<null>>,
  // //   next: NextFunction,
  // // ) {
  // //   try {
  // //     const isProduction = process.env.NODE_ENV === "production";

  // //     // Clear cookie
  // //     res.clearCookie("token", {
  // //       httpOnly: true,
  // //       secure: isProduction,
  // //       sameSite: isProduction ? "none" : "lax",
  // //     });

  // //     return ResponseResult.success<null>(null, res, 200, "success logout");
  // //   } catch (error) {
  // //     next(error);
  // //   }
  // // }
}
