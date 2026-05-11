import { NextFunction, Request, Response } from "express";
import {
  AjukanRequestType,
  CreateDokumentasiBorangDefaultRequestType,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
  ResponseDokumentasiBorangWithKebutuhanDokumentasiType,
  ResponseFoldersAndFilesType,
} from "../models/dokumentasiBorang.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { AuthRequest } from "../types/authRequest";
import { FileDokumenService } from "../services/fileDokumen.service";
import { FileService } from "../services/file.service";
import { DokumentasiBorangServices } from "../services/dokumentasiBorang.service";
import { validation } from "../validations/validation";
import { DokumentasiBorangValidation } from "../validations/dokumentasiBorang.validationn";
import { KebutuhanDokumentasiPicServices } from "../services/kebutuhanDokumentasiPic.service";
import { FolderService } from "../services/folder.service";
import {
  Status,
  StorageProvider,
  TipeDokumentasi,
  TipeRiwayat,
} from "../utils/contstanst";
import { ResponseRiwayatType } from "../models/riwayat.model";
import { RiwayatService } from "../services/riwayat.service";

export class DokumentasiBorangController {
  // create
  static async createDokumentasiBorangDefault(
    req: AuthRequest<{}, {}, CreateDokumentasiBorangDefaultRequestType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateDokumentasiBorangType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // validasi
      const body = validation<CreateDokumentasiBorangDefaultRequestType>(
        DokumentasiBorangValidation.CREATE_DEFAULT,
        {
          ...req.body,
          kebutuhan_dokumentasi_id: Number(req.body.kebutuhan_dokumentasi_id),
          dokumentasi_borang_id: req.body.dokumentasi_borang_id
            ? Number(req.body.dokumentasi_borang_id)
            : undefined,
          old_file: req.body.old_file ? Number(req.body.old_file) : undefined,
          folder: req.body.folder ? Number(req.body.folder) : undefined,
        },
      );

      // check body
      if (body.meta.statusCode !== 200) {
        // return
        return ResponseResult.error(
          res,
          body.meta.statusCode,
          body.meta.message,
          body.meta.customField,
        );
      }

      // get body
      const {
        kebutuhan_dokumentasi_id,
        dokumentasi_borang_id,
        folder,
        keterangan,
        new_file,
        old_file,
        nomor_dokumen,
        storage_provider,
      } = body.data!;

      // check kebutuhan dokumentasi id
      const checkKebutuhanDokumentasi =
        await KebutuhanDokumentasiPicServices.getExistAndTipeDokumenAndStatus(
          kebutuhan_dokumentasi_id,
        );

      // check
      if (!checkKebutuhanDokumentasi)
        return ResponseResult.error(
          res,
          404,
          "kebutuhan dokumentasi pic not found",
        );

      // check status
      if (checkKebutuhanDokumentasi.status !== Status.APPROVED)
        return ResponseResult.error(
          res,
          404,
          "status kebutuhan dokumentasi belum disetujui",
        );

      // check tipe dokumentasi
      if (
        checkKebutuhanDokumentasi.tipe_dokumentasi !== TipeDokumentasi.DEFAULT
      )
        return ResponseResult.error(
          res,
          404,
          "tipe kebutuhan dokumentasi tidak sesuai",
        );

      // check old folder
      if (folder) {
        const findFolder = await FolderService.findUniqeById({
          id: folder,
          kebutuhan_dokumentasi_pic_id: checkKebutuhanDokumentasi.id,
        });

        if (!findFolder) {
          return ResponseResult.error(res, 400, "folder not found");
        }
      }

      // result uploaded file
      let resultUploadedFiles: {
        file_id: string;
      } | null = null;

      // check nama file if exist
      if (new_file && storage_provider) {
        // check file
        if (!req.file) return ResponseResult.error(res, 400, "file not found");

        // files
        const uploadedfile = req.file;

        // check name
        const findNamaFile = await FileDokumenService.findByName(new_file);

        // check
        if (findNamaFile) {
          return ResponseResult.error(res, 409, "file name already exist", [
            "file_name_already_exist",
          ]);
        }

        //   upload file
        const uploadFiles = await FileService.uploadFileFromRequest({
          fileRequest: {
            storage_provider: storage_provider,
          },
          uploadedFile: uploadedfile,
        });

        //   check upload files
        if (!uploadFiles) {
          return ResponseResult.error(res, 400, "gagal upload file");
        }

        // set result
        resultUploadedFiles = {
          ...uploadFiles,
        };
      }

      // get user id
      const dosen_id = req.data?.id!;

      //   find file if existing in request
      if (old_file) {
        const findFiles =
          await FileDokumenService.findByIdAndGetTipeAndActive(old_file);

        // check
        if (!findFiles && findFiles === 0)
          return ResponseResult.error(res, 404, "file not found");

        // check tipe
        if (
          findFiles?.tipe_file !== checkKebutuhanDokumentasi.tipe_dokumentasi ||
          !findFiles?.is_active
        )
          return ResponseResult.error(
            res,
            404,
            "tipe file tidak sesuai atau file belum active",
          );
      }

      //   call service
      const service = await DokumentasiBorangServices.createDefault({
        kebutuhan_dokumentasi_id,
        dokumentasi_borang_id,
        uploaded_by_id: dosen_id,
        folder,
        old_file,
        file:
          resultUploadedFiles && storage_provider && keterangan
            ? {
                tipe_dokumentasi:
                  checkKebutuhanDokumentasi.tipe_dokumentasi as TipeDokumentasi,
                storage_provider: storage_provider as StorageProvider,
                nama_file: body.data?.new_file!,
                file_id: resultUploadedFiles.file_id,
                keterangan,
                nomor_dokumen,
              }
            : undefined,
      });

      //   check
      if (!service) {
        return ResponseResult.error(res, 400, "gagal upload file");
      }

      // return
      return ResponseResult.success<ResponseCreateUpdateDokumentasiBorangType | null>(
        service,
        res,
        200,
        "success",
      );
    } catch (error) {
      next(error);
    }
  }

  // find by id with kebutuhan dokumentasi
  static async findByKebutuhanDokumentasiId(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDokumentasiBorangWithKebutuhanDokumentasiType | null>,
      {
        validatedParams: {
          kebutuhan_dokumentasi_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { kebutuhan_dokumentasi_id } = res.locals.validatedParams;

      // call service
      const service =
        await DokumentasiBorangServices.findByKebutuhanDokumentasiId({
          kebutuhan_dokumentasi_id,
        });

      return ResponseResult.success<ResponseDokumentasiBorangWithKebutuhanDokumentasiType | null>(
        service,
        res,
        200,
        "success",
      );
    } catch (error) {
      next(error);
    }
  }

  // find all by kebutuhan dokumentasi pic id
  static async findAllByKebutuhanDokumentasiPicId(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseDokumentasiBorangType | null>,
      { validatedParams: { kebutuhan_dokumentasi_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { kebutuhan_dokumentasi_id } = res.locals.validatedParams;

      // call service
      const service =
        await DokumentasiBorangServices.findAllByKebutuhanDokumentasiId(
          kebutuhan_dokumentasi_id,
        );

      // check
      if (!service) return ResponseResult.error(res, 400, "service gagal");

      // return
      return ResponseResult.success<ResponseDokumentasiBorangType | null>(
        service,
        res,
        200,
        "success",
      );
    } catch (error) {
      next(error);
    }
  }

  static async ajukan(
    req: Request<{}, {}, AjukanRequestType>,
    res: Response<
      ResponseStructure<ResponseRiwayatType | null>,
      { validatedParams: { dokumentasi_borang_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { dokumentasi_borang_id } = res.locals.validatedParams;

      const { keterangan } = req.body;

      // create riwayat
      const service = await RiwayatService.createForDokumentasiBorang({
        dokumentasi_borang_id,
        keterangan,
        tipe_riwayat: TipeRiwayat.DOKUMENTASI_BORANG,
        status: Status.PENDING,
      });

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "gagal ajukan");
      }

      return ResponseResult.success<ResponseRiwayatType | null>(service, res);
    } catch (error) {
      next(error);
    }
  }
}
