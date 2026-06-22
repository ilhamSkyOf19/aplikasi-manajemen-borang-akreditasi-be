import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseActivationType } from "../models/activationCode.model";
import { DosenServices } from "../services/dosen.service";
import { ActivationCodeService } from "../services/activationCode.service";
import { generateCode } from "../utils/utils";
import { renderMailHtml, sendEmail } from "../utils/mail/mail";
import { ENV } from "../utils/env";

export class ActivationCodeController {
  // create
  static async create(
    req: Request<{}, {}, { email: string }>,
    res: Response<ResponseStructure<ResponseActivationType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const email = req.body.email;

      // find dosen by email
      const findDosen = await DosenServices.findByEmail(email.trim());

      // chekc
      if (!findDosen) {
        return ResponseResult.error(res, 400, "email tidak ditemukan", [
          "email",
        ]);
      }

      //   check activation code
      const checkExpired = await ActivationCodeService.checkExpired({
        dosen_id: findDosen.id,
      });

      //   check service
      if (checkExpired) {
        return ResponseResult.error(res, 400, "activation code not expired", [
          "not-expired",
        ]);
      }

      //   code
      const code = generateCode();

      // create activation code
      const service = await ActivationCodeService.create({
        code,
        dosen_id: findDosen.id,
      });

      //   check service
      if (!service) {
        return ResponseResult.error(res, 400, "activation code not created");
      }

      //   content email
      const contentEmail = await renderMailHtml({
        template: "reset-password.ejs",
        data: {
          name: findDosen.nama,
          nidn: findDosen.nidn,
          email: findDosen.email,
          activationCode: code,
        },
      });

      // send
      await sendEmail({
        from: `"Aplikasi Manajemen Borang Akreditasi" <noreplay>`,
        to: findDosen.email,
        html: contentEmail,
        subject: "Reset Password",
      });

      // return success
      return ResponseResult.success<ResponseActivationType | null>(
        service,
        res,
        200,
        "success create activation code",
      );
    } catch (error) {
      next(error);
    }
  }

  //   resend
  static async resend(
    req: Request<{}, {}, { email: string }>,
    res: Response<ResponseStructure<ResponseActivationType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const email = req.body.email;

      // find dosen by email
      const findDosen = await DosenServices.findByEmail(email);

      // chekc
      if (!findDosen) {
        return ResponseResult.error(res, 400, "email tidak ditemukan");
      }

      // check expired
      const checkExpired = await ActivationCodeService.checkExpired({
        dosen_id: findDosen.id,
      });

      //   check service
      if (checkExpired) {
        return ResponseResult.error(res, 400, "activation code not expired");
      }

      // generate code
      const code = generateCode();

      // create activation code
      const service = await ActivationCodeService.resend({
        code,
        dosen_id: findDosen.id,
      });

      //   check service
      if (!service) {
        return ResponseResult.error(res, 400, "activation code not created");
      }

      //   content email
      const contentEmail = await renderMailHtml({
        template: "reset-password.ejs",
        data: {
          name: findDosen.nama,
          nidn: findDosen.nidn,
          email: findDosen.email,
          activationCode: code,
        },
      });

      // send
      await sendEmail({
        from: `"Aplikasi Manajemen Borang Akreditasi" <${ENV.EMAIL_SMTP_USER}>`,
        to: findDosen.email,
        html: contentEmail,
        subject: "Reset Password",
      });

      // return success
      return ResponseResult.success<ResponseActivationType | null>(
        service,
        res,
        200,
        "success create activation code",
      );
    } catch (error) {
      next(error);
    }
  }

  //   activation
  static async verifyCode(
    req: Request<{}, {}, { email: string; code: number }>,
    res: Response<ResponseStructure<ResponseActivationType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { code, email } = req.body;

      // find dosen
      const findDosen = await DosenServices.findByEmail(email);

      // check dosen
      if (!findDosen) {
        return ResponseResult.error(res, 400, "email tidak ditemukan");
      }

      // find activation code not expired
      const findActivation = await ActivationCodeService.findActivationCode({
        code,
        dosen_id: findDosen.id,
      });

      // check
      if (!findActivation) {
        return ResponseResult.error(res, 400, "activation code not found");
      }

      // get reset token
      const resetToken = crypto.randomUUID();

      // update
      await ActivationCodeService.updateResetToken({
        id: findActivation.id,
        reset_token: resetToken,
      });

      // set cookie
      res.cookie("reset_token", resetToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        maxAge: 5 * 60 * 1000,
        path: "/api",
      });

      return ResponseResult.success<ResponseActivationType | null>(
        findActivation,
        res,
        200,
        "success  activation code",
      );
    } catch (error) {
      next(error);
    }
  }
}
