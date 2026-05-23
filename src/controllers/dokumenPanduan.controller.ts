import { NextFunction, Request, Response } from "express";
import {
  CreateDokumenPanduanRequestType,
  ResponseDokumenPanduanType,
  UpdateDokumenPanduanRequestType,
} from "../models/dokumenPanduan.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { AuthRequest } from "../types/authRequest";
import { validation } from "../validations/validation";
import { DokumenPanduanValidation } from "../validations/dokumenPanduan.validation";
import { FileService } from "../services/file.service";
import { DokumenPanduanService } from "../services/dokumenPanduan.service";
import { StorageProvider } from "../utils/contstanst";

export class DokumenPanduanController {
  // create
  static async create(
    req: AuthRequest<{}, {}, CreateDokumenPanduanRequestType>,
    res: Response<ResponseStructure<ResponseDokumenPanduanType | null>>,
    next: NextFunction,
  ) {
    try {
      // check file
      if (!req.file) return ResponseResult.error(res, 400, "file not found");

      // files
      const uploadedfile = req.file;

      // get periode id
      const periodeId = req?.periode?.id;

      // check periode id
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // check body
      const validatedBody = validation<CreateDokumenPanduanRequestType>(
        DokumenPanduanValidation.CREATE,
        {
          ...req.body,
        },
      );

      // check body
      if (validatedBody.meta.statusCode !== 200) {
        // return
        return ResponseResult.error(
          res,
          validatedBody.meta.statusCode,
          validatedBody.meta.message,
          validatedBody.meta.customField,
        );
      }

      // get body
      const { nama_file, storage_provider } = validatedBody.data!;

      //   upload file
      const uploadFiles = await FileService.uploadFileFromRequest({
        fileRequest: {
          dokumen_panduan: true,
          storage_provider: storage_provider,
        },
        uploadedFile: uploadedfile,
      });

      //   check upload files
      if (!uploadFiles) {
        return ResponseResult.error(res, 400, "gagal upload file");
      }

      //   create service
      const service = await DokumenPanduanService.create({
        id_file: uploadFiles.file_id,
        nama_file: nama_file,
        periode_id: periodeId,
        storage_provider: storage_provider,
      });

      //   check service
      if (!service) {
        return ResponseResult.error(res, 400, "gagal create dokumen panduan");
      }

      // return
      return ResponseResult.success(
        service,
        res,
        200,
        "success create dokumen panduan",
      );
    } catch (error) {
      next(error);
    }
  }

  //   update
  static async update(
    req: AuthRequest<{}, {}, UpdateDokumenPanduanRequestType>,
    res: Response<ResponseStructure<ResponseDokumenPanduanType | null>>,
    next: NextFunction,
  ) {
    try {
      // get periode id
      const periodeId = req?.periode?.id;

      // check periode id
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // find periode
      const findDokumenPanduan =
        await DokumenPanduanService.findByPeriode(periodeId);

      // check
      if (!findDokumenPanduan) {
        return ResponseResult.error(res, 404, "tidak ada dokumen panduan");
      }

      // check body
      const validatedBody = validation<UpdateDokumenPanduanRequestType>(
        DokumenPanduanValidation.UPDATE,
        {
          ...req.body,
        },
      );

      // check body
      if (validatedBody.meta.statusCode !== 200) {
        // return
        return ResponseResult.error(
          res,
          validatedBody.meta.statusCode,
          validatedBody.meta.message,
          validatedBody.meta.customField,
        );
      }

      // get body
      const { nama_file, storage_provider } = validatedBody.data!;

      //   check request
      let finalUploadedFile: string | null = null;

      if (storage_provider) {
        if (!req.file) {
          return ResponseResult.error(res, 400, "tidak ada file yang diupload");
        }

        //   upload file
        const uploadFiles = await FileService.uploadFileFromRequest({
          fileRequest: {
            dokumen_panduan: true,
            storage_provider: storage_provider,
          },
          uploadedFile: req.file,
        });

        console.log(uploadFiles);

        //   check upload files
        if (!uploadFiles) {
          return ResponseResult.error(res, 400, "gagal upload file");
        }

        // check storage provider old file
        if (findDokumenPanduan.storage_provider === StorageProvider.SISTEM) {
          // delete file
          await FileService.deleteFormPath({
            fileName: findDokumenPanduan.id_file,
            dokumen_panduan: true,
          });
        } else if (
          findDokumenPanduan.storage_provider === StorageProvider.GDRIVE
        ) {
          // delete file
          await FileService.deleteFileFormGDrive(findDokumenPanduan.id_file);
        }

        finalUploadedFile = uploadFiles.file_id;
      }

      //   create service
      const service = await DokumenPanduanService.update({
        periode_id: periodeId,
        nama_file: nama_file,
        ...(finalUploadedFile && {
          id_file: finalUploadedFile,
          storage_provider: storage_provider,
        }),
      });

      //   check service
      if (!service) {
        return ResponseResult.error(res, 400, "gagal update dokumen panduan");
      }

      // return
      return ResponseResult.success(
        service,
        res,
        200,
        "success update dokumen panduan",
      );
    } catch (error) {
      // check req file
      if (req.file) {
        // delete file
        await FileService.deleteFile(req.file.fieldname);
      }

      next(error);
    }
  }

  // find
  static async find(
    req: AuthRequest,
    res: Response<ResponseStructure<ResponseDokumenPanduanType | null>>,
    next: NextFunction,
  ) {
    try {
      // get periode id
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // call service
      const service = await DokumenPanduanService.findByPeriode(periodeId);

      // check service
      if (!service) {
        return ResponseResult.error(res, 404, "tidak ada dokumen panduan");
      }

      // return
      return ResponseResult.success(
        service,
        res,
        200,
        "success find dokumen panduan",
      );
    } catch (error) {
      next(error);
    }
  }
}
