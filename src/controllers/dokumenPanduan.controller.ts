import { NextFunction, Response } from "express";
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
import path from "node:path";
import fs from "fs";
import driveApi from "../configs/driveapi.config";

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

  // download file by periode
  static async download(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // get periode id
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // find dokumen panduan
      const findDokumenPanduan =
        await DokumenPanduanService.findByPeriode(periodeId);

      // check dokumen panduan
      if (!findDokumenPanduan) {
        return ResponseResult.error(res, 404, "tidak ada dokumen panduan");
      }

      // stream
      let stream;

      // lokasi path sistem
      if (findDokumenPanduan.storage_provider === StorageProvider.SISTEM) {
        const filePath = path.join(
          process.cwd(),
          "public/uploads/dokumentasi-borang",
          "dokumen_panduan",
          findDokumenPanduan.id_file,
        );

        console.log(filePath);

        if (!fs.existsSync(filePath)) {
          return ResponseResult.error(res, 404, "file tidak ditemukan");
        }

        // return stream
        stream = fs.createReadStream(filePath);
      } else if (
        findDokumenPanduan.storage_provider === StorageProvider.GDRIVE
      ) {
        const response = await driveApi.files.get(
          {
            fileId: findDokumenPanduan.id_file,
            alt: "media",
          },
          {
            responseType: "stream",
          },
        );

        // return
        stream = response.data;
      } else {
        return ResponseResult.error(res, 404, "file tidak ditemukan");
      }

      // return header
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${findDokumenPanduan.nama_file}"`,
      );

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  // preview
  static async preview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // get periode id
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // find dokumen panduan
      const findDokumenPanduan =
        await DokumenPanduanService.findByPeriode(periodeId);

      // check dokumen panduan
      if (!findDokumenPanduan) {
        return ResponseResult.error(res, 404, "tidak ada dokumen panduan");
      }

      // check storage
      if (findDokumenPanduan?.storage_provider === StorageProvider.SISTEM) {
        await FileService.previewFileLocal({
          res,
          req,
          fileName: findDokumenPanduan?.nama_file,
          file_id: findDokumenPanduan?.id_file,
          dokumen_panduan: true,
        });

        return;
      } else {
        await FileService.previewFileGoogleDrive({
          res,
          fileName: findDokumenPanduan?.nama_file,
          file_id: findDokumenPanduan?.id_file,
        });

        return;
      }
    } catch (error) {
      next(error);
    }
  }
}
