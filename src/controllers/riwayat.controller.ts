import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  ResponseRiwayatType,
  UpdateRiwayatType,
} from "../models/riwayat.model";
import checkParamsId from "../utils/checkParamsId";
import { PicService } from "../services/pic.service";
import { RiwayatService } from "../services/riwayat.service";
import { JenisRiwayat, Status } from "../utils/contstanst";
import { UpdateStatusType } from "../models/status.model";
import { ResponsePicUpdateStatusType } from "../models/pic.model";

export class RiwayatController {
  // update status
  static async updateStatus(
    req: Request<{ id: string }, {}, UpdateStatusType>,
    res: Response<ResponseStructure<ResponsePicUpdateStatusType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { status, keterangan, jenisRiwayat } = req.body;

      // get id from params
      const { id } = req.params;

      // service pic
      let servicePic: ResponsePicUpdateStatusType | null = null;

      let checkStatusSuccess: ResponseRiwayatType | null = null;

      // check jenis riwayat = pic
      if (jenisRiwayat === "pic") {
        // check id
        const checkId = checkParamsId(res, id);

        // find pic
        const pic = await PicService.findById(checkId as number);

        // check
        if (!pic) {
          return ResponseResult.error(res, 404, "pic not found");
        }

        // find status success
        checkStatusSuccess = await RiwayatService.findByPicIdAndStatus(
          checkId as number,
          Status.disetujui,
        );

        // check if reqeust status di setujui
        if (status === Status.disetujui && checkStatusSuccess) {
          return ResponseResult.error(res, 400, "pic sudah disetujui");
        }

        // call service
        servicePic = await PicService.updateStatus(checkId as number, status);

        // check service
        if (!servicePic) {
          return ResponseResult.error(res, 404, "pic not found");
        }
      }

      // check status revisi
      if (servicePic && servicePic.status === "revisi") {
        // check
        if (checkStatusSuccess) {
          // delete status
          await RiwayatService.delete({
            idRiwayat: checkStatusSuccess.id,
            picId: servicePic.id,
          });
        }
      }

      // create riwayat
      const riwayat = await RiwayatService.create({
        jenis: JenisRiwayat.pic,
        keterangan,
        status,
        picId: servicePic ? servicePic.id : 0,
      });

      // check riwayat
      if (!riwayat) {
        return ResponseResult.error(res, 404, "riwayat not found");
      }

      // return success
      return ResponseResult.success<ResponsePicUpdateStatusType | null>(
        servicePic,
        res,
        200,
        "success update status pic",
      );
    } catch (error) {
      next(error);
    }
  }
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
    } catch (error) {
      next(error);
    }
  }

  // update riwayat pic
  static async updateRiwayatPic(
    req: Request<{ picId: string; riwayatId: string }, {}, UpdateRiwayatType>,
    res: Response<ResponseStructure<ResponseRiwayatType | null>>,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const { picId, riwayatId } = req.params;

      // check id
      const checkPicId = checkParamsId(res, picId);

      const checkRiwayatId = checkParamsId(res, riwayatId);

      // find pic id
      const findPic = await PicService.findById(checkPicId as number);

      // check
      if (!findPic) return ResponseResult.error(res, 404, "pic not found");

      // find riwayat
      const findRiwayat = await RiwayatService.checkRiwayatPic(
        checkPicId as number,
        checkRiwayatId as number,
      );

      // check
      if (!findRiwayat)
        return ResponseResult.error(res, 404, "riwayat not found");

      // call service
      const service = await RiwayatService.updateRiwayatPic(
        checkPicId as number,
        checkRiwayatId as number,
        req.body,
      );

      // return
      return ResponseResult.success<ResponseRiwayatType | null>(
        service,
        res,
        200,
        "success update riwayat pic",
      );
    } catch (error) {
      next(error);
    }
  }
}
