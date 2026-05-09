import z from "zod";
import { UpdateFileDefaultType } from "../models/fileDokumen.model";

export class FileDokumenValidation {
  // update file default
  static readonly UPDATE_DEFAULT = z
    .object({
      nama_file: z.string().trim().min(1).max(100).optional(),
      keterangan: z.string().trim().min(1).max(1000).optional(),
      nomor_dokumen: z.string().trim().min(1).max(1000).optional(),
    })
    .strict() satisfies z.ZodType<UpdateFileDefaultType>;
}
