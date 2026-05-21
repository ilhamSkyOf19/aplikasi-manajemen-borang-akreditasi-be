import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  ResponseFileDokumenForChooseWithMetaType,
  ResponseSearchGlobalType,
} from "../models/fileDokumen.model";
import {
  ResponseFileDokumenDefaultForDetailType,
  ResponseUpdateFileDefaultType,
  UpdateFileDefaultType,
} from "../models/fileDokumenDefault.model";
import { PaginationType } from "../types/pagination";
import { FileDokumenService } from "../services/fileDokumen.service";
import { AuthRequest } from "../types/authRequest";
import path from "node:path";
import fsSync from "fs";
import { DriveApiService } from "../services/driveapi.service";
import { meta } from "zod/v4/core";
import {
  Status,
  StorageProvider,
  TipeDokumentasi,
  TipeRiwayat,
} from "../utils/contstanst";
import { FileService } from "../services/file.service";
import { FileDokumenDefaultService } from "../services/fileDokumenDefault.service";
import {
  ResponseFileDokumenPenelitianForDetailType,
  ResponseUpdateFilePenelitanType,
  UpdateFilePenelitianType,
} from "../models/fileDokumenPenelitian.model";
import { FileDokumenPenelitianService } from "../services/fileDokumenPenelitian.service";
import { DokumentasiBorangServices } from "../services/dokumentasiBorang.service";
import { RiwayatService } from "../services/riwayat.service";

export class FileDokumenController {
  // find all for choose
  static async findAllForChoose(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenForChooseWithMetaType | null>,
      {
        validatedParams: { tipe_file: TipeDokumentasi };
        validatedQuery: PaginationType;
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get query
      const { limit, page, search, sort } = res.locals.validatedQuery;

      // get params
      const { tipe_file } = res.locals.validatedParams;

      // call service
      const service = await FileDokumenService.findAllForChoose({
        query: {
          limit,
          page,
          search,
          sort,
        },
        tipe_file,
      });

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenForChooseWithMetaType | null>(
        service,
        res,
        200,
        "berhasil mendapatkan data file dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  // preview file local
  static async previewFileLocal(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = res.locals.validatedParams;

      const file = await FileDokumenService.findById(id);

      if (!file) {
        return res.status(404).json({
          status: "ERR",
          message: "File tidak ditemukan di database",
        });
      }

      const fileName = path.basename(file.file_id);

      const safePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "dokumentasi-borang",
        file.tipe_file.toLowerCase(),
        fileName,
      );

      console.log("safePath:", safePath);

      if (!fsSync.existsSync(safePath)) {
        return res.status(404).json({
          status: "ERR",
          message: "File tidak ditemukan di folder server",
          path: safePath,
        });
      }

      const stat = fsSync.statSync(safePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      const displayFileName = file.nama_file.toLowerCase().endsWith(".pdf")
        ? file.nama_file
        : `${file.nama_file}.pdf`;

      const encodedFileName = encodeURIComponent(displayFileName);

      const contentDisposition = `inline; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const fileStream = fsSync.createReadStream(safePath, { start, end });

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "application/pdf",
          "Content-Disposition": contentDisposition,
        });

        return fileStream.pipe(res);
      }

      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "application/pdf",
        "Accept-Ranges": "bytes",
        "Content-Disposition": contentDisposition,
      });

      return fsSync.createReadStream(safePath).pipe(res);
    } catch (error) {
      next(error);
    }
  }

  static async previewFileGoogleDrive(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = res.locals.validatedParams;

      const file = await FileDokumenService.findById(id);

      console.log(file);

      if (!file) {
        res.status(404).json({
          status: "ERR",
          message: "File tidak ditemukan",
        });
        return;
      }

      if (file.storage_provider !== "GDRIVE") {
        res.status(400).json({
          status: "ERR",
          message: "File ini bukan file Google Drive",
        });
        return;
      }

      if (!file) {
        res.status(400).json({
          status: "ERR",
          message: "Provider file ID tidak ditemukan",
        });
        return;
      }

      const { metadata, stream } = await DriveApiService.getFileForPreview(
        file.file_id,
      );

      res.setHeader("Content-Type", metadata.mimeType ?? "application/pdf");

      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(file.nama_file ?? metadata.name)}"; `,
      );

      res.setHeader("Cache-Control", "private, max-age=0");

      stream.on("error", (error) => {
        next(error);
      });

      stream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  // find for default detail
  static async findFileDefaultForDetail(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenDefaultForDetailType | null>,
      {
        validatedParams: {
          dokumentasi_borang_id: number;
          file_dokumen_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { dokumentasi_borang_id, file_dokumen_id } =
        res.locals.validatedParams;

      // call service
      const service = await FileDokumenDefaultService.findByIdForDetail({
        dokumentasi_borang_id,
        file_dokumen_id,
      });

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenDefaultForDetailType | null>(
        service,
        res,
        200,
        "berhasil mendapatkan data file dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  // update file default
  static async updateFileDefault(
    req: AuthRequest<{}, {}, UpdateFileDefaultType>,
    res: Response<
      ResponseStructure<ResponseUpdateFileDefaultType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { id } = res.locals.validatedParams;

      // get body
      const body = req.body;

      // get dosen id
      const { id: dosenId } = req?.data as { id: number };

      // find file
      const findFile = await FileDokumenService.findById(id);

      // check
      if (!findFile) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // check uploaded
      if (findFile.uploaded_by_id !== dosenId)
        return ResponseResult.forbidden(res, "Forbidden");

      // call service
      const service = await FileDokumenDefaultService.updateFileDefault({
        id,
        data: body,
      });

      return ResponseResult.success<ResponseUpdateFileDefaultType | null>(
        service,
        res,
        200,
        "berhasil update file default",
      );
    } catch (error) {
      next(error);
    }
  }

  // find for penelitian detail
  static async findFilePenelitianForDetail(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenPenelitianForDetailType | null>,
      {
        validatedParams: {
          file_dokumen_id: number;
          dokumentasi_borang_id: number;
        };
      }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { dokumentasi_borang_id, file_dokumen_id } =
        res.locals.validatedParams;

      // call service
      const service = await FileDokumenPenelitianService.findByIdForDetail({
        dokumentasi_borang_id,
        file_dokumen_id,
      });

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenPenelitianForDetailType | null>(
        service,
        res,
        200,
        "berhasil mendapatkan data file dokumen",
      );
    } catch (error) {
      next(error);
    }
  }

  // update file default
  static async updateFilePenelitian(
    req: AuthRequest<{}, {}, UpdateFilePenelitianType>,
    res: Response<
      ResponseStructure<ResponseUpdateFilePenelitanType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { id } = res.locals.validatedParams;

      // get body
      const { judul_penelitian, keterangan, link_publikasi, nama_file, tahun } =
        req.body;

      // get dosen id
      const { id: dosenId } = req?.data as { id: number };

      // find file
      const findFile = await FileDokumenService.findById(id);

      // check
      if (!findFile) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // check uploaded
      if (findFile.uploaded_by_id !== dosenId)
        return ResponseResult.forbidden(res, "Forbidden");

      // call service
      const service = await FileDokumenPenelitianService.updateFilePenelitian({
        id,
        data: {
          judul_penelitian,
          keterangan,
          link_publikasi,
          nama_file,
          tahun,
        },
      });

      return ResponseResult.success<ResponseUpdateFilePenelitanType | null>(
        service,
        res,
        200,
        "berhasil update file penelitian",
      );
    } catch (error) {
      next(error);
    }
  }

  // hapus file secara keseluruhan

  // delete file
  static async deleteFromDokumentasiBorang(
    _req: AuthRequest,
    res: Response<
      ResponseStructure<null>,
      { validatedParams: { file_id: number; dokumentasi_borang_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get params id
      const { file_id: idFileDokumen, dokumentasi_borang_id } =
        res.locals.validatedParams;

      // get activated
      const findFileDokumen = await FileDokumenService.findById(idFileDokumen);

      // check
      if (!findFileDokumen) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // call service
      const service = await FileDokumenService.deleteFromDokumentasiBorang({
        dokumentasi_borang_id,
        id: idFileDokumen,
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // temukan dokumentasi yang mempunyai file dan memiliki status approved  tersebut dan update riwayat nya menjadi revisi
      const getDokumentasi =
        await DokumentasiBorangServices.findDokumentasiByFileDokumenIdAndStatusApprovedOrPending(
          findFileDokumen.id,
        );

      console.log(getDokumentasi);

      // check activated and uploaded
      if (getDokumentasi?.length === 0) {
        if (findFileDokumen.storage_provider === StorageProvider.SISTEM) {
          await FileService.deleteFormPath({
            fileName: findFileDokumen.file_id,
            tipe_file: findFileDokumen.tipe_file,
          });
        } else if (
          findFileDokumen.storage_provider === StorageProvider.GDRIVE
        ) {
          await FileService.deleteFileFormGDrive(findFileDokumen.file_id);
        }

        // delete dari file
        await FileDokumenService.delete({
          idFileDokumen: findFileDokumen.id,
          tipe_file: findFileDokumen.tipe_file,
        });
      }

      // return response
      return ResponseResult.successNoContent(res, "success delete file");
    } catch (error) {
      next(error);
    }
  }

  // find all by search
  static async findAllBySearch(
    req: AuthRequest,
    res: Response<
      ResponseStructure<any>,
      { validatedQuery: { search: string } }
    >,
    next: NextFunction,
  ) {
    try {
      // get periode id
      const periodeId = req?.periode?.id;

      // check periode
      if (!periodeId) {
        return ResponseResult.error(res, 404, "tidak ada periode aktif");
      }

      // get keyword search
      const keyword = res.locals.validatedQuery.search;

      // call service
      const service = await FileDokumenService.findAllBySearchAndPeriode({
        periode_id: periodeId,
        search: keyword,
      });

      // return response
      return ResponseResult.success<any | null>(
        service,
        res,
        200,
        "success find all file dokumentasi",
      );
    } catch (error) {
      next(error);
    }
  }
}
