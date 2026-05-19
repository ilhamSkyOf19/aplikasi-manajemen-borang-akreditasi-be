import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseDistribusiKebutuhanDokumentasiType } from "../models/distribusiKebutuhanDokumentasi.model";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";
import { AuthRequest } from "../types/authRequest";

export class DistribusiKebutuhanDokumentasiController {
  // find by periode
  static async findByPeriode(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseDistribusiKebutuhanDokumentasiType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // call service
      const service =
        await DistribusiKebutuhanDokumentasiService.findByPeriode(periode_id);

      return ResponseResult.success<ResponseDistribusiKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success find distribusi kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
  // find distribusi
  static async find(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseDistribusiKebutuhanDokumentasiType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // call service
      const service = await DistribusiKebutuhanDokumentasiService.find({
        periode_id,
      });

      return ResponseResult.success<ResponseDistribusiKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success find distribusi kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // active
  static async active(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseDistribusiKebutuhanDokumentasiType | null>,
      {
        validatedParams: { id: number };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get id from params
      const { id } = res.locals.validatedParams;

      // call service
      const service = await DistribusiKebutuhanDokumentasiService.active({
        id,
        periode_id,
      });

      return ResponseResult.success<ResponseDistribusiKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success active distribusi kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }

  // an active
  static async anActive(
    req: AuthRequest,
    res: Response<
      ResponseStructure<ResponseDistribusiKebutuhanDokumentasiType | null>,
      {
        validatedParams: { id: number };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode
      const periode_id = req?.periode?.id;

      // check periode
      if (!periode_id) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get id from params
      const { id } = res.locals.validatedParams;
      // call service
      const service = await DistribusiKebutuhanDokumentasiService.anActive({
        id,
        periode_id,
      });

      return ResponseResult.success<ResponseDistribusiKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success an active distribusi kebutuhan dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
