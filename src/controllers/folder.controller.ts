import { NextFunction, Request, Response } from "express";
import {
  CreateFolderType,
  ResponseFolderType,
  UpdateNameFolderType,
} from "../models/folder.model";
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

  // update
  static async updateNameFolder(
    req: Request<{}, {}, UpdateNameFolderType>,
    res: Response<
      ResponseStructure<ResponseFolderType | null>,
      { validatedParams: { id: number } }
    >,
    next: NextFunction,
  ) {
    try {
      // get body
      const { nama_folder } = req.body;

      // get id from params
      const { id } = res.locals.validatedParams;

      // call service
      const service = await FolderService.updateName({
        id,
        data: {
          nama_folder,
        },
      });

      // return
      return ResponseResult.success<ResponseFolderType | null>(
        service,
        res,
        200,
        "success update nama folder",
      );
    } catch (error) {
      next(error);
    }
  }
}
