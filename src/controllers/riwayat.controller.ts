import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseRiwayatType } from "../models/riwayat.model";
import checkParamsId from "../utils/checkParamsId";
import { PicService } from "../services/pic.service";
import { RiwayatService } from "../services/riwayat.service";
import { JenisRiwayat, Status } from "../utils/contstanst";

export class RiwayatController {
  //   read all by pic id
  static async readAllByPicId(
    req: Request<{ picId: string }>,
    res: Response<ResponseStructure<ResponseRiwayatType[] | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { picId } = req.params;

      // check
      const checkPicId = checkParamsId(res, picId);

      // find pic id
      const findPic = await PicService.findById(checkPicId as number);

      //   check pic
      if (!findPic) {
        return ResponseResult.error(res, 404, "pic not found");
      }

      //   call service
      const service = await RiwayatService.readAllByPicId(checkPicId as number);

      //   check
      if (service.length < 1) {
        return ResponseResult.success<ResponseRiwayatType[]>(
          [
            {
              id: 0,
              createdAt: new Date(),
              updatedAt: new Date(),
              jenis: JenisRiwayat.pic,
              keterangan: "",
              status: Status.menunggu,
              createdData: findPic.createdAt,
              highlightDataEmpy: findPic.kebutuhanDokumen.namaDokumen,
            },
          ],
          res,
          200,
          "success read riwayat by pic id",
        );
      }

      return ResponseResult.success<ResponseRiwayatType[]>(
        service,
        res,
        200,
        "success read riwayat by pic id",
      );
    } catch (error) {}
  }
}
