import { NextFunction, Request, Response } from "express";
import {
  CreateDokumentasiBorangDefaultRequestType,
  FilesRequest,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
  ResponseDokumentasiBorangWithKebutuhanDokumentasiType,
  ResponseFoldersAndFilesType,
  UpdateDokumentasiBorangDefaultRequestType,
  UpdateDokumentasiBorangDefaultType,
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
import { Status, TipeDokumentasi } from "../utils/contstanst";

export class DokumentasiBorangController {
  // create
  static async createDokumentasiBorangDefatult(
    req: AuthRequest<{}, {}, CreateDokumentasiBorangDefaultRequestType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateDokumentasiBorangType | null>
    >,
    next: NextFunction,
  ) {
    try {
      // validasi
      const body = validation<
        Omit<CreateDokumentasiBorangDefaultRequestType, "files"> & {
          files: FilesRequest[];
        }
      >(DokumentasiBorangValidation.CREATE_DEFAULT, {
        ...req.body,
        kebutuhan_dokumentasi_pic_id: Number(
          req.body.kebutuhan_dokumentasi_pic_id,
        ),
        old_folder: req.body.old_folder
          ? Number(req.body.old_folder)
          : undefined,
        files: JSON.parse(req.body.files),
      });

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
      const { files, kebutuhan_dokumentasi_pic_id, new_folder, old_folder } =
        body.data!;

      // check kebutuhan dokumentasi id
      const checkKebutuhanDokumentasi =
        await KebutuhanDokumentasiPicServices.getExistAndTipeDokumenAndStatus(
          kebutuhan_dokumentasi_pic_id,
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

      // check new folder
      if (new_folder) {
        const findFolder = await FolderService.findUniqeByNama({
          folder: new_folder,
          kebutuhan_dokumentasi_pic_id: checkKebutuhanDokumentasi.id,
        });
        // check
        if (findFolder) {
          return ResponseResult.error(res, 400, "folder name already exist");
        }
      }

      // check old folder
      if (old_folder) {
        const findFolder = await FolderService.findUniqeById({
          id: old_folder,
          kebutuhan_dokumentasi_pic_id: checkKebutuhanDokumentasi.id,
        });

        if (!findFolder) {
          return ResponseResult.error(res, 400, "folder not found");
        }
      }

      // check nama file if exist
      if (files && files.length > 0) {
        // get nama file
        const getNamaFile = files
          .map((item) => item.nama_file?.toLocaleLowerCase() ?? undefined)
          .filter((item) => item !== undefined);

        // check duplicate
        const hasDuplicate = new Set(getNamaFile).size !== getNamaFile.length;

        if (hasDuplicate) {
          return ResponseResult.error(res, 400, "nama file duplicate");
        }

        const findNamaFile = await FileDokumenService.findByNames(getNamaFile);

        // check
        if (findNamaFile > 0) {
          return ResponseResult.error(res, 400, "nama file already exist");
        }
      }

      // files
      const uploadedfiles = (req.files as Express.Multer.File[]) ?? [];

      // get user id
      const dosen_id = req.data?.id!;

      //   find file if existing in request
      if (files && files.length > 0) {
        const oldFiles = files
          .map((item) => item.old_file ?? undefined)
          .filter((item) => item !== undefined);

        // check
        if (oldFiles.length > 0) {
          const findFiles =
            await FileDokumenService.findByIdsAndGetTipeAndActive(oldFiles);

          // check
          if (!findFiles && findFiles === 0)
            return ResponseResult.error(res, 404, "file not found");

          // check tipe
          if (
            !findFiles.some(
              (item) =>
                item.tipe_file.includes(
                  checkKebutuhanDokumentasi.tipe_dokumentasi,
                ) || item.is_active === true,
            )
          )
            return ResponseResult.error(
              res,
              404,
              "tipe file tidak sesuai atau file belum active",
            );
        }
      }

      //   validasi jumlah file upload
      const newFileCount = files.filter((item) => !item.old_file).length;
      if (uploadedfiles.length !== newFileCount) {
        return ResponseResult.error(
          res,
          400,
          "jumlah file upload tidak sesuai",
        );
      }

      //   upload file
      const uploadFiles = await FileService.uploadFilesFromRequest({
        fileRequest: files,
        uploadedFiles: uploadedfiles,
      });

      //   check upload files
      if (!uploadFiles) {
        return ResponseResult.error(res, 400, "gagal upload file");
      }

      //   call service
      const service = await DokumentasiBorangServices.createDefault({
        files: uploadFiles,
        kebutuhan_dokumentasi_pic_id: Number(kebutuhan_dokumentasi_pic_id),
        new_folder,
        old_folder,
        uploaded_by_id: Number(dosen_id),
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

  // find all by kebutuhan dokumentasi pic id and folder id
  static async findFilesByFolderIdAndDokumentasiBorangId(
    req: Request,
    res: Response<
      ResponseStructure<ResponseFoldersAndFilesType | null>,
      {
        validatedParams: {
          dokumentasi_borang_id: number;
          folder_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get params
      const { dokumentasi_borang_id, folder_id } = res.locals.validatedParams;

      // call service
      const service =
        await DokumentasiBorangServices.findFilesByFolderIdAndDokumentasiBorangId(
          {
            folder_id,
            dokumentasi_borang_id,
          },
        );

      // check service
      if (!service)
        return ResponseResult.error(res, 400, "Data tidak ditemukan");

      return ResponseResult.success<ResponseFoldersAndFilesType | null>(
        service,
        res,
        200,
        "success",
      );
    } catch (error) {
      next(error);
    }
  }

  // update
  static async updateDokumentasiBorangDefatult(
    req: AuthRequest<{}, {}, UpdateDokumentasiBorangDefaultRequestType>,
    res: Response<
      ResponseStructure<ResponseCreateUpdateDokumentasiBorangType | null>,
      { validatedParams: { dokumentasi_borang_id: number; file_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // validasi
      const body = validation<
        Omit<UpdateDokumentasiBorangDefaultRequestType, "file"> & {
          file?: FilesRequest;
        }
      >(DokumentasiBorangValidation.UPDATE_DEFAULT, {
        ...req.body,
        old_folder: req.body.old_folder
          ? Number(req.body.old_folder)
          : undefined,
        file: req.body.file ? JSON.parse(req.body.file) : undefined,
      });

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
      const { file, new_folder, old_folder, nomor_dokumen } = body.data!;

      // get params
      const { dokumentasi_borang_id, file_id } = res.locals.validatedParams;

      // check kebutuhan dokumentasi id
      const checkDokumentasiBorang =
        await DokumentasiBorangServices.findDokumentasiBorangGetIdStatusTipeDokumentasi(
          dokumentasi_borang_id,
        );

      // check
      if (!checkDokumentasiBorang)
        return ResponseResult.error(
          res,
          404,
          "dokumentasi borang tidak di temukan",
        );

      // check file id
      const checkFileDokumen = await FileDokumenService.findById(file_id);

      if (!checkFileDokumen)
        return ResponseResult.error(res, 404, "file dokumen tidak ada");

      // check pivot
      const checkPivot =
        await DokumentasiBorangServices.findPivotByDokumentasiBorangAndFileId({
          dokumentasi_borang_id: checkDokumentasiBorang.id,
          file_id: checkFileDokumen.id,
        });

      if (!checkPivot)
        return ResponseResult.error(res, 404, "relasi pivot tidak ditemukan");

      // check status
      if (checkDokumentasiBorang.status !== Status.REVISION)
        return ResponseResult.error(
          res,
          404,
          "status dokumentasi borang belum revisi",
        );

      // check tipe dokumentasi
      if (checkDokumentasiBorang.tipe_dokumentasi !== TipeDokumentasi.DEFAULT)
        return ResponseResult.error(
          res,
          404,
          "tipe kebutuhan dokumentasi tidak sesuai",
        );

      // check new folder
      if (new_folder) {
        const findFolder = await FolderService.findUniqeByNama({
          folder: new_folder,
          dokumentasi_borang_id: checkDokumentasiBorang.id,
        });
        // check
        if (findFolder) {
          return ResponseResult.error(res, 400, "folder name already exist");
        }
      }

      // check old folder
      if (old_folder) {
        const findFolder = await FolderService.findUniqeById({
          id: old_folder,
          dokumentasi_borang_id: checkDokumentasiBorang.id,
        });

        if (!findFolder) {
          return ResponseResult.error(res, 400, "folder not found");
        }
      }

      // result uploaded file
      let resultAfterUploaded:
        | (FilesRequest & { provider_id?: string })
        | null = null;
      // check nama file if exist
      if (file) {
        if (file.nama_file) {
          const findNamaFile = await FileDokumenService.findByName(
            file.nama_file,
          );

          // check
          if (findNamaFile) {
            return ResponseResult.error(res, 400, "nama file already exist");
          }
        }

        // check
        if (file.old_file) {
          const findFiles =
            await FileDokumenService.findByIdAndGetTipeAndActive(file.old_file);

          // check
          if (!findFiles)
            return ResponseResult.error(res, 404, "file not found");

          // check tipe
          if (
            findFiles.is_active === false ||
            findFiles.tipe_file !== TipeDokumentasi.DEFAULT
          )
            return ResponseResult.error(
              res,
              404,
              "tipe file tidak sesuai atau file belum active",
            );

          // check duplicat pivot
          const checkDuplicatPivotOldFile =
            await DokumentasiBorangServices.findPivotByDokumentasiBorangAndFileId(
              {
                dokumentasi_borang_id: checkDokumentasiBorang.id,
                file_id: file.old_file,
              },
            );

          if (checkDuplicatPivotOldFile)
            return ResponseResult.error(
              res,
              404,
              "File sudah digunakan pada dokumentasi yang sama",
            );
        }

        if (!req.file) {
          return ResponseResult.error(res, 400, "file harus diupload");
        }

        //   upload file
        const uploadFile = await FileService.uploadFilesFromRequest({
          fileRequest: [file],
          uploadedFiles: [req.file],
        });

        //   check upload files
        if (!uploadFile) {
          return ResponseResult.error(res, 400, "gagal upload file");
        }

        // set
        resultAfterUploaded = uploadFile[0];
      }

      // get user id
      const dosen_id = req.data?.id!;

      //   call service
      const service = await DokumentasiBorangServices.updateDefault({
        file: resultAfterUploaded ?? undefined,
        dokumentasi_borang_id: checkDokumentasiBorang.id,
        new_folder,
        old_folder,
        uploaded_by_id: Number(dosen_id),
        file_id: checkFileDokumen.id,
        default_detail: nomor_dokumen
          ? {
              nomor_dokumen: nomor_dokumen,
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
}
