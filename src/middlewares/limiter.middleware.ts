import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ResponseResult, ResponseStructure } from "../types/response";

export default class LimiterMiddleware {
  // login
  static login() {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 6,
      skipSuccessfulRequests: true,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response<ResponseStructure<null>>) => {
        const resetTime = req.rateLimit?.resetTime;

        if (resetTime) {
          const minutesLeft = Math.ceil(
            (resetTime.getTime() - Date.now()) / 60000,
          );

          return ResponseResult.error(
            res,
            429,
            `Terlalu banyak percobaan login. Silakan coba lagi dalam ${minutesLeft} menit.`,
          );
        }

        // Fallback jika resetTime tidak ada
        return ResponseResult.error(
          res,
          429,
          "Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.",
        );
      },
    });
  }

  // api standart
  static apiRegular() {
    return rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req: Request, res: Response<ResponseStructure<null>>) => {
        return ResponseResult.error(
          res,
          429,
          "Akses ditolak. Terlalu banyak permintaan.",
        );
      },
    });
  }
}
