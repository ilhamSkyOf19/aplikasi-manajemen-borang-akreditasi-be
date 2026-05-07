import { NextFunction, Request, Response } from "express";
import { CreateFolderType, ResponseFolderType } from "../models/folder.model";
import { ResponseResult, ResponseStructure } from "../types/response";
import { FolderService } from "../services/folder.service";

export class FolderController {
  // create
  static async create(
    req: Request<{}, {}, CreateFolderType>,
    res: Response<ResponseStructure<number | null>>,
    next: NextFunction,
  ) {
    try {
      // get body
      const { dokumentasi_borang_id, nama_folder, kebutuhan_dokumentasi_id } =
        req.body;

      // call service
      const service = await FolderService.createMany({
        dokumentasi_borang_id,
        nama_folder,
        kebutuhan_dokumentasi_id,
      });

      // return
      return ResponseResult.success<number | null>(
        service,
        res,
        201,
        "success create folder",
      );
    } catch (error) {
      next(error);
    }
  }
}
