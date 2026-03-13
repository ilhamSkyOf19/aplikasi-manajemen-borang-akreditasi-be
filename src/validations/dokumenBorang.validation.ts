import z from "zod";
import { CreateDokumenBorangType } from "../models/dokumenBorang.model";
import { LokasiFile } from "../utils/contstanst";

export class DokumenBorangValidation {
  static readonly fileItemSchema = z.object({
    useOldFile: z.boolean(),
    oldDokumenBorangId: z.number().int().positive().optional(),
    lokasiFile: z
      .enum(["GDRIVE", "SISTEM"] as LokasiFile[], "lokasi file tidak falid")
      .optional(),
    filename: z.string().optional(),
  });

  static readonly CREATE = z
    .object({
      uploadedBy: z.number().int().positive(),
      keterangan: z.string().min(1).max(1000),
      picId: z.number().int().positive(),
      files: z.array(this.fileItemSchema).min(1).max(4),
    })
    .strict() satisfies z.ZodType<Omit<CreateDokumenBorangType, "assignedBy">>;

  static readonly DOWNLOAD = z
    .object({
      filenames: z.array(z.string()),
    })
    .strict() satisfies z.ZodType<{ filenames: string[] }>;

  // DELETE
  static readonly DELETE = z
    .object({
      ids: z.array(z.number().int().positive()),
    })
    .strict() satisfies z.ZodType<{ ids: number[] }>;

  static UPDATE = {};
}
