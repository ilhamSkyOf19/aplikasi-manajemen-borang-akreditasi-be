import { NextFunction, Request, Response } from "express";
import { FileItem } from "../models/dokumenBorang.model";
import { FileService } from "../services/file.service";

const uploadIfNeeded = (req: Request, res: Response, next: NextFunction) => {
  const files: FileItem[] = JSON.parse(req.body.files ?? "[]");
  const hasNewFile = files.some((f) => f.useOldFile === false);

  if (hasNewFile) {
    const upload = FileService.uploadFile();
    return upload.array("filename", 4)(req, res, next); // jalankan multer
  }

  next(); // skip multer, langsung next
};

export default uploadIfNeeded;
