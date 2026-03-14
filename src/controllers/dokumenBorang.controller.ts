import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { DokumenBorangService } from "../services/dokumenBorang.service";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  CreateDokumenBorangType,
  DaftarDokumenBorangByKriteriaWithMeta,
  DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta,
  FileItem,
  ResponseCreateDokumenBorangType,
  ResponseDaftarDokumenBorangByKebutuhanDokumenType,
  ResponseDokumenBorangType,
} from "../models/dokumenBorang.model";
import checkParamsId from "../utils/checkParamsId";
import { PaginationType } from "../types/pagination";
import { validation } from "../validations/validation";
import { DokumenBorangValidation } from "../validations/dokumenBorang.validation";
import { FileService } from "../services/file.service";
import { PicService } from "../services/pic.service";
import { KebutuhanDokumenService } from "../services/kebutuhanDokumen.service";

export class DokumenBorangController {
  // create
  static async create(
    req: AuthRequest<
      {},
      {},
      Omit<CreateDokumenBorangType, "assignedBy" | "files" | "uploadedBy"> & {
        files: string;
      }
    >,
    res: Response<ResponseStructure<ResponseCreateDokumenBorangType | null>>,
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

      // check filename by filename if filename existing
      if (body?.data?.files.some((item) => item.filename)) {
        const filenames = body?.data?.files
          .filter((item) => !item.useOldFile && item.filename)
          .map((item) => item.filename!);

        // check filename
        const filenamesCheck =
          await DokumenBorangService.findFileNamesByFilename(filenames);

        // check filename length
        if (filenamesCheck.length > 0) {
          return ResponseResult.error(
            res,
            400,
            "Filename sudah digunakan",
            filenamesCheck,
          );
        }
      }

      // check pic
      const pic = await PicService.checkPicById(body?.data?.picId!);

      if (!pic) {
        return ResponseResult.error(res, 400, "Pic tidak ditemukan");
      }

      // find dokumen borang by id
      if (body?.data && body?.data?.files.length > 0) {
        const oldDokumenIds = body?.data?.files
          .map((f) => f.oldDokumenBorangId)
          .filter((f) => f !== undefined);

        // check
        if (oldDokumenIds.length > 0) {
          const findDokumenBorang = await DokumenBorangService.findByIds(
            oldDokumenIds as number[],
          );

          if (
            findDokumenBorang &&
            findDokumenBorang.length !== oldDokumenIds.length
          ) {
            return ResponseResult.error(res, 400, "File lama tidak ditemukan");
          }
        }
      }

      // Validasi file baru wajib ada filename & lokasiFile
      const invalidNewFile = body?.data?.files.some(
        (f) => !f.useOldFile && (!f.filename || !f.lokasiFile || !f.keterangan),
      );
      if (invalidNewFile) {
        if (uploadedFiles.length > 0)
          await FileService.deleteFiles(uploadedFiles);
        return ResponseResult.error(
          res,
          400,
          "File baru wajib menyertakan filename, lokasiFile dan keterangan",
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

      // create
      const result = await DokumenBorangService.create(
        {
          ...body.data!,
          uploadedBy: id!,
          assignedBy: id!,
          files: body?.data?.files as FileItem[],
        },
        uploadedFiles,
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
      // Fallback delete jika ada file yang lolos
      if (req.files) {
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
      const service = await DokumenBorangService.findDaftarDokumen(id!, {});

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

  // find dokumen borang by kebutuhan dokumen
  static async findDokumenBorangByKebutuhanDokumenId(
    req: Request<{ kebutuhanDokumenId: string }>,
    res: Response<
      ResponseStructure<ResponseDaftarDokumenBorangByKebutuhanDokumenType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // get kebutuhan dokumen from params
      const kebutuhanDokumenId = req.params.kebutuhanDokumenId;

      // check id
      const checkId = checkParamsId(res, kebutuhanDokumenId);

      // check kebutuhan dokumentasi
      const checkKebutuhanDokumentasi = await KebutuhanDokumenService.findById(
        checkId as number,
      );

      if (!checkKebutuhanDokumentasi) {
        return ResponseResult.error(
          res,
          404,
          "kebutuhan dokumentasi not found",
        );
      }

      // call service
      const service =
        await DokumenBorangService.findDokumenBorangByKebutuhanDokumentasiId(
          checkId as number,
        );

      // return success
      return ResponseResult.success<ResponseDaftarDokumenBorangByKebutuhanDokumenType | null>(
        service,
        res,
        200,
      );
    } catch (error) {
      next(error);
    }
  }

  // download file
  static async downloadSingleFile(
    req: Request<{ filename: string }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get data from params
      const { filename } = req.params;

      // download
      await DokumenBorangService.downloadSingleFile(filename, res);
    } catch (error) {
      next(error);
    }
  }

  // download multiple files
  static async downloadMultipleFile(
    req: Request<{}, {}, { filenames: string[] }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      const { filenames } = req.body;

      // call service
      await DokumenBorangService.downloadMultipleFile(filenames, res);
    } catch (error) {
      next(error);
    }
  }

  // delete dokumen borang
  static async deleteDokumenBorang(
    req: Request<{}, {}, { ids: number[] }>,
    res: Response<ResponseStructure<null>>,
    next: NextFunction,
  ) {
    try {
      // get data from body
      const { ids } = req.body;

      // find dokumen borang
      const findDokumenBorang = await DokumenBorangService.findByIds(ids);

      // check
      if (!findDokumenBorang) {
        return ResponseResult.error(res, 404, "dokumen borang not found");
      }

      // check
      if (findDokumenBorang.length === 0) {
        return ResponseResult.error(res, 404, "dokumen borang not found");
      }

      // delete dokumen borang
      await DokumenBorangService.deleteByIds(ids);

      // get filename
      const filenameFormSistem = findDokumenBorang
        .filter((item) => item.dokumen.filename && !item.dokumen.fileId)
        .map((item) => item.dokumen.filename);

      // delete dokumen borang by filename
      if (filenameFormSistem && filenameFormSistem.length > 0) {
        const resultDeleteFromSistem =
          await FileService.deleteMultipleFilesFormPath(
            filenameFormSistem.map((item) => ({
              fileName: item,
              filePath: "dokumen-borang",
            })),
          );

        // error
        const catchError = resultDeleteFromSistem.find((item) => !item.success);

        // check
        if (catchError) {
          return ResponseResult.error(
            res,
            404,
            `${catchError.file} : ${catchError.message}`,
          );
        }
      }

      // get file id
      const fileId = findDokumenBorang
        .filter((item) => item.dokumen.fileId)
        .map((item) => item.dokumen.fileId);

      // check
      if (fileId && fileId.length > 0) {
        const result = await Promise.all(
          fileId.map((item) => FileService.deleteFileFormGDrive(item!)),
        );

        // check
        const catchError = result.find((item) => item.success === false);

        // check error
        if (catchError) {
          return ResponseResult.error(res, 404, catchError.message);
        }
      }

      // return success
      return ResponseResult.successNoContent(null, res, "success delete");
    } catch (error) {
      next(error);
    }
  }
}
