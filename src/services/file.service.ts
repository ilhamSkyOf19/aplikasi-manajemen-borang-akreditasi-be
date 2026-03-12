import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import fs from "fs";
import path from "path";
import fsAsync from "fs/promises";

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
    try {
      // check file
      await fsAsync.access(path);

      // delete file
      await fsAsync.unlink(path);

      console.log("file deleted");
    } catch (error) {
      // cek error
      console.log(error);
      console.warn("file not found");
    }
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
    // cek file path
    if (!filePath || !fileName)
      return {
        success: false,
        message: "File not exist",
      };

    // path file
    const filePathFull = path.join(
      process.cwd(),
      `public/uploads/${filePath}/${fileName}`,
    );

    // delete file
    try {
      // cek file
      await fsAsync.access(filePathFull);
      // delete file
      await fsAsync.unlink(filePathFull);

      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      // cek error
      console.log(error);
      return {
        success: false,
        message: "File not found or failed to delete",
      };
    }
  }
}
