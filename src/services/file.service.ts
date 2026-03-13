import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import fsAsync from "fs/promises";
import driveApi from "../configs/driveapi.config";

type FileConfig = {
  allowedMimeTypes?: RegExp;
};

export class FileService {
  // create
  static uploadFile(config: FileConfig = {}) {
    // destructure
    const { allowedMimeTypes = /pdf/ } = config;

    // storage
    const storage = multer.memoryStorage();

    // file filter
    const fileFilter = (
      req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback,
    ) => {
      console.log(req.body);

      const extname = allowedMimeTypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      const mimetype = allowedMimeTypes.test(file.mimetype);

      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error("File type not allowed!"));
      }
    };

    // upload
    const uploader = multer({
      storage,
      fileFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    });

    return {
      single: (field: string) => uploader.single(field),
      array: (field: string, limit?: number) => uploader.array(field, limit),
    };
  }

  //   delete file
  static async deleteFile(path: string): Promise<void> {
    // check file
    await fsAsync.access(path);

    // delete file
    await fsAsync.unlink(path);
    console.log("file deleted");
  }

  static async deleteFiles(files: Express.Multer.File[]): Promise<void> {
    for (const file of files) {
      try {
        // check file
        await fsAsync.access(file.path);

        // delete file
        await fsAsync.unlink(file.path);

        console.log(`file deleted: ${file.path}`);
      } catch (error) {
        console.warn(`file not found: ${file.path}`);
      }
    }
  }

  // delete form path
  static async deleteFormPath(
    fileName: string,
    filePath: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!filePath || !fileName) {
      throw new Error(`Invalid path or filename: ${fileName}`);
    }

    const filePathFull = path.join(
      process.cwd(),
      `public/uploads/${filePath}/${fileName}`,
    );

    await fsAsync.access(filePathFull);
    await fsAsync.unlink(filePathFull);

    return {
      success: true,
      message: "File deleted successfully",
    };
  }

  // delete multiple
  static async deleteMultipleFilesFormPath(
    files: { fileName: string; filePath: string }[],
  ): Promise<{ success: boolean; message: string; file: string }[]> {
    // delete
    const results = await Promise.allSettled(
      files.map(({ fileName, filePath }) =>
        this.deleteFormPath(fileName, filePath),
      ),
    );

    // result
    return results.map((result, index) => {
      const file = files[index].fileName;

      // check
      if (result.status === "fulfilled") {
        return {
          success: true,
          message: result.value.message,
          file,
        };
      }

      // error
      return {
        success: false,
        message: result.reason?.message ?? "Failed to delete",
        file,
      };
    });
  }

  // delete form gdrive
  static async deleteFileFormGDrive(
    fileId: string,
  ): Promise<{ success: boolean; message: string }> {
    const result = await driveApi.files.delete({
      fileId,
    });

    // check result
    if (result.status === 204) {
      return {
        success: true,
        message: "File deleted successfully",
      };
    } else {
      return {
        success: false,
        message: "File not found or failed to delete",
      };
    }
  }
}
