import { NextFunction, Request, Response } from "express";
import {
  CreateDokumentasiBorangDefaultRequestType,
  FilesRequest,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
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
      if (checkKebutuhanDokumentasi.tipe_dokumen !== TipeDokumentasi.DEFAULT)
        return ResponseResult.error(
          res,
          404,
          "tipe kebutuhan dokumentasi tidak sesuai",
        );

      // check new folder
      if (new_folder) {
        const findFolder = await FolderService.findUniqeByNama({
          folder: new_folder,
          kebutuhan_dokumentasi_pic_id: kebutuhan_dokumentasi_pic_id,
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
          kebutuhan_dokumentasi_pic_id: kebutuhan_dokumentasi_pic_id,
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
                  checkKebutuhanDokumentasi.tipe_dokumen,
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
      if (!service) return ResponseResult.error(res, 400, "gagal membaca data");

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
}
