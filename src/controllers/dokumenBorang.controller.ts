import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { DokumenBorangService } from "../services/dokumenBorang.service";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  CreateDokumenBorangType,
  DaftarDokumenBorangByKriteriaWithMeta,
  DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta,
  FileItem,
} from "../models/dokumenBorang.model";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";
import { validation } from "../validations/validation";
import { DokumenBorangValidation } from "../validations/dokumenBorang.validation";
import { FileService } from "../services/file.service";
import path from "path";
import fs from "fs";

export class DokumenBorangController {
  // create
  static async create(
    req: AuthRequest<
      {},
      {},
      Omit<
        CreateDokumenBorangType,
        "assignedBy" | "files" | "uploadedBy" | "filename"
      > & {
        files: string;
        filename: string;
      }
    >,
    res: Response<ResponseStructure<any | null>>,
    next: NextFunction,
  ) {
    // filenames
    let filenamesGlobal: Express.Multer.File[] = [];
    try {
      // files
      const uploadedFiles = (req.files as Express.Multer.File[]) ?? [];

      // get id from req data
      const id = req.data?.id;

      // check body
      const body = validation<Omit<CreateDokumenBorangType, "assignedBy">>(
        DokumenBorangValidation.CREATE,
        {
          ...req.body,
          picId: Number(req.body.picId),
          uploadedBy: id!,
          files: JSON.parse(req.body.files),
          filename: JSON.parse(req.body.filename),
        },
      );

      // check body
      if (body.meta.statusCode !== 200) {
        // check file req
        if (req.files) {
          await FileService.deleteFiles(req.files as Express.Multer.File[]);
        }
        // return
        return ResponseResult.error(
          res,
          body.meta.statusCode,
          body.meta.message,
        );
      }

      // Validasi jumlah file upload sesuai jumlah useOldFile: false
      const newFileCount = body?.data?.files.filter(
        (f) => !f.useOldFile,
      ).length;
      if (uploadedFiles.length !== newFileCount) {
        // delete file
        if (req.files) {
          await FileService.deleteFiles(req.files as Express.Multer.File[]);
        }
        return ResponseResult.error(res, 400, "Jumlah file tidak sesuai");
      }

      // Validasi file lama wajib ada oldDokumenBorangId
      const invalidOldFile = body?.data?.files.some(
        (f) => f.useOldFile && !f.oldDokumenBorangId,
      );
      if (invalidOldFile) {
        // delete file
        if (req.files) {
          await FileService.deleteFiles(req.files as Express.Multer.File[]);
        }
        return ResponseResult.error(res, 400, "File lama wajib ada");
      }

      // replace file name
      const filenames: string[] = body?.data?.filename ?? [];

      // check filenames length
      if (filenames.length !== uploadedFiles.length) {
        // delete file
        if (req.files) {
          await FileService.deleteFiles(req.files as Express.Multer.File[]);
        }
        return ResponseResult.error(res, 400, "Jumlah file tidak sesuai");
      }

      // renamed files
      const renamedFiles = uploadedFiles.map((file, index) => {
        const customFilename = filenames[index];

        if (customFilename) {
          const ext = path.extname(file.originalname);
          const suffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const newFilename = customFilename + "-" + suffix + ext;
          const newPath = path.join(path.dirname(file.path), newFilename);

          // renamed
          fs.renameSync(file.path, newPath);

          return { ...file, filename: newFilename, path: newPath };
        }

        // push filename
        filenamesGlobal.push(file);

        // return
        return file;
      });

      // create
      const result = await DokumenBorangService.create(
        {
          ...body.data!,
          uploadedBy: id!,
          assignedBy: id!,
          files: body?.data?.files as FileItem[],
        },
        renamedFiles,
      );

      // check result
      if (!result) {
        // delete files
        if (req.files) {
          await FileService.deleteFiles(filenamesGlobal);
        }
        return ResponseResult.error(res, 400, "Gagal membuat dokumen");
      }

      return ResponseResult.success<any>(result, res, 200);
    } catch (error) {
      // delete files
      if (filenamesGlobal?.length > 0) {
        await FileService.deleteFiles(filenamesGlobal);
      } else if (req.files) {
        await FileService.deleteFiles(req.files as Express.Multer.File[]);
      }
      next(error);
    }
  }

  // read daftar dokumen by user id
  static async readDaftarDokumen(
    req: AuthRequest,
    res: Response<
      ResponseStructure<DaftarDokumenBorangByKriteriaWithMeta | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      // call service
      const service = await DokumenBorangService.readDaftarDokumen(id!, {});

      return ResponseResult.success<DaftarDokumenBorangByKriteriaWithMeta | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  //   get daftar kebutuhan dokumentasi by user id & krieria, pendekatan
  static async readDaftarKebutuhanDokumentasiByKriteriaAndPendekatan(
    req: AuthRequest<
      { kriteria: string; pendekatan: string },
      {},
      {},
      PaginationType
    >,
    res: Response<
      ResponseStructure<DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get id from params
      const id = req?.data?.id;

      //   get params
      const { kriteria, pendekatan } = req.params;

      //   check kriteria
      const checkKriteria = checkParamsId(res, kriteria);

      // get data from query
      const { limit = 10, page, search } = req.query;

      // call service
      const service =
        await DokumenBorangService.findKebutuhanDokumentasiByUserAndKriteriaAndPendekatan(
          id!,
          checkKriteria as number,
          pendekatan,
          { page, limit, search },
        );

      return ResponseResult.success<DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }
}
