import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { ResponseResult, ResponseStructure } from "../types/response";
import { DistribusiKebutuhanDokumentasiService } from "../services/distribusiKebutuhanDokumentasi.service";
import { DosenRole } from "../utils/contstanst";
export const distribusiMiddleware =
  (disableRoles?: DosenRole[]) =>
  async (
    req: AuthRequest,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) => {
    try {
      // get periode
      const periode = req?.periode;
      // role dosen
      const roleDosen = req.data?.role;

      // check
      if (!periode) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // find distribusi by periode
      if (!disableRoles || !disableRoles.includes(roleDosen!)) {
        const distribusi =
          await DistribusiKebutuhanDokumentasiService.findByPeriode(periode.id);

        // check distribusi
        if (!distribusi?.is_active) {
          return ResponseResult.error(res, 404, "distribusi tidak aktif");
        }
      }

      // next
      next();
    } catch (error) {
      // error handler
      console.log(error);
      next(error);
    }
  };
