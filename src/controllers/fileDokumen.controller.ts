import { NextFunction, Request, Response } from "express";
import { ResponseResult, ResponseStructure } from "../types/response";
import {
  ResponseFileDokumenForChooseWithMetaType,
  ResponseFileDokumenForDetailType,
  ResponseUpdateFileType,
  UpdateFileDefaultType,
} from "../models/fileDokumen.model";
import { PaginationType } from "../types/pagination";
import { FileDokumenService } from "../services/fileDokumen.service";
import { AuthRequest } from "../types/authRequest";
import path from "node:path";
import fsSync from "fs";
import { DriveApiService } from "../services/driveapi.service";
import { meta } from "zod/v4/core";
import { TipeDokumentasi } from "../utils/contstanst";

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

  // find for detail
  static async findForDetail(
    _req: Request,
    res: Response<
      ResponseStructure<ResponseFileDokumenForDetailType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get id
      const { id } = res.locals.validatedParams;

      // call service
      const service = await FileDokumenService.findByIdForDetail(id);

      // check
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return
      return ResponseResult.success<ResponseFileDokumenForDetailType | null>(
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
      ResponseStructure<ResponseUpdateFileType | null>,
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
      const service = await FileDokumenService.updateFileDefault({
        id,
        data: body,
      });

      return ResponseResult.success<ResponseUpdateFileType | null>(
        service,
        res,
        200,
        "berhasil update file default",
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

  // delete file
  static async deleteFromDokumentasiBorang(
    req: AuthRequest,
    res: Response<
      ResponseStructure<null>,
      { validatedParams: { file_id: number; dokumentasi_borang_id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get dosen id
      const dosenId = req?.data?.id;

      // get params id
      const { file_id, dokumentasi_borang_id } = res.locals.validatedParams;

      // call service
      const service = await FileDokumenService.deleteFromDokumentasiBorang({
        dokumentasi_borang_id,
        file_id,
      });

      // check service
      if (!service) {
        return ResponseResult.error(res, 400, "data not found");
      }

      // return response
      return ResponseResult.successNoContent(res, "success delete file");
    } catch (error) {
      next(error);
    }
  }
}
