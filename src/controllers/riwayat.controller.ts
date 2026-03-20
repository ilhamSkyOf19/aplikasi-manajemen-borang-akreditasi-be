import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import { ResponseRiwayatType } from "../models/riwayat.model";
import checkParamsId from "../utils/checkParamsId";
import { PicService } from "../services/pic.service";
import { RiwayatService } from "../services/riwayat.service";
import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";
import { UpdateStatusType } from "../models/status.model";
import { ResponsePicUpdateStatusType } from "../models/pic.model";
import { KebutuhanDokumenService } from "../services/kebutuhanDokumen.service";
import { NotifikasiService } from "../services/notifikasi.service";

export class RiwayatController {
  // update status
  static async updateStatus(
    req: Request<{ id: string }, {}, UpdateStatusType>,
    res: Response<ResponseStructure<ResponseRiwayatType | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { status, keterangan, jenisRiwayat, flagRevisi } = req.body;

      // get id from params
      const { id } = req.params;

      // check id
      const checkId = checkParamsId(res, id);

      // check status
      if (status === Status.menunggu || status === Status.revisi) {
        if (!flagRevisi) {
          return ResponseResult.error(res, 400, "flag revisi harus diisi");
        }
      }

      // service pic
      let servicePic: ResponsePicUpdateStatusType | null = null;

      let checkStatusSuccess: ResponseRiwayatType[] | null = null;

      // check status revisi
      let checkStatusRevisi: ResponseRiwayatType[] | null = null;

      // check jenis riwayat = pic
      if (jenisRiwayat === "pic") {
        // find pic
        const pic = await PicService.findById(checkId as number);

        // check
        if (!pic) {
          return ResponseResult.error(res, 404, "pic not found");
        }

        // check status  revisi
        if (pic.status === "revisi" && status === "revisi") {
          // find status revisi
          checkStatusRevisi = await RiwayatService.findByPicIdAndStatus(
            pic.id,
            Status.revisi,
          );
        } else {
          // find status success
          checkStatusSuccess = await RiwayatService.findByPicIdAndStatus(
            pic.id,
            Status.disetujui,
          );
        }

        // check if request status di setujui
        if (
          status === Status.disetujui &&
          checkStatusSuccess &&
          checkStatusSuccess.length > 0
        ) {
          return ResponseResult.error(res, 400, "pic sudah disetujui");
        }

        // call service
        servicePic = await PicService.updateStatus(pic.id, status);

        // check service
        if (!servicePic) {
          return ResponseResult.error(res, 404, "pic not found");
        }

        // check status success or status revisi
        if (status === "disetujui" || status === "revisi") {
          // check find pic by id and status menunggu
          const findPicByIdAndStatus =
            await RiwayatService.findByPicIdAndStatus(
              servicePic.id,
              Status.menunggu,
            );

          if (findPicByIdAndStatus && findPicByIdAndStatus?.length > 0) {
            // data delete riwayat menunggu
            const dataDeleteRiwayatMenunggu = findPicByIdAndStatus.map(
              (item) => item.id,
            );

            // delete many status menunggu
            const deleteManyStatusMenunggu = await RiwayatService.deleteMany(
              dataDeleteRiwayatMenunggu,
            );

            // check delete many status menunggu
            if (!deleteManyStatusMenunggu) {
              return ResponseResult.error(
                res,
                500,
                "gagal delete many status menunggu",
              );
            }
          }
        }
      }

      // check status revisi
      if (servicePic && servicePic.status === "revisi") {
        // check
        if (checkStatusSuccess && checkStatusSuccess.length > 0) {
          // delete status
          await RiwayatService.delete({
            idRiwayat: checkStatusSuccess[0].id,
            picId: servicePic.id,
          });
        }

        // check status revisi
        if (checkStatusRevisi && checkStatusRevisi.length > 0) {
          // delete status revisi terbaru
          await RiwayatService.delete({
            idRiwayat: checkStatusRevisi[0].id,
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
        // tambahkan dokumen borang
        flagRevisi,
      });

      // check riwayat
      if (!riwayat) {
        return ResponseResult.error(res, 404, "riwayat not found");
      }

      // check
      if (servicePic) {
        // push notifikasi
        if (servicePic.status === Status.disetujui) {
          await NotifikasiService.notifyPicDisetujuiWD1(
            servicePic.id,
            servicePic.namaDokumen,
          );
        }

        if (servicePic.status === Status.revisi) {
          await NotifikasiService.notifyPicDirevisiWD1(
            servicePic.id,
            servicePic.namaDokumen,
            keterangan,
          );
        }
      }

      // return success
      return ResponseResult.success<ResponseRiwayatType | null>(
        riwayat,
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
              highlightDataEmpy: findPic.namaDokumen,
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

  // // update riwayat pic
  // static async updateRiwayatPic(
  //   req: Request<{ picId: string; riwayatId: string }, {}, UpdateRiwayatType>,
  //   res: Response<ResponseStructure<ResponseRiwayatType | null>>,
  //   next: NextFunction,
  // ) {
  //   try {
  //     // get id from params
  //     const { picId, riwayatId } = req.params;

  //     // check id
  //     const checkPicId = checkParamsId(res, picId);

  //     const checkRiwayatId = checkParamsId(res, riwayatId);

  //     // find pic id
  //     const findPic = await PicService.findById(checkPicId as number);

  //     // check
  //     if (!findPic) return ResponseResult.error(res, 404, "pic not found");

  //     // find riwayat
  //     const findRiwayat = await RiwayatService.checkRiwayatPic(
  //       checkPicId as number,
  //       checkRiwayatId as number,
  //     );

  //     // check
  //     if (!findRiwayat)
  //       return ResponseResult.error(res, 404, "riwayat not found");

  //     // call service
  //     const service = await RiwayatService.updateRiwayatPic(
  //       checkPicId as number,
  //       checkRiwayatId as number,
  //       req.body,
  //     );

  //     // return
  //     return ResponseResult.success<ResponseRiwayatType | null>(
  //       service,
  //       res,
  //       200,
  //       "success update riwayat pic",
  //     );
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
