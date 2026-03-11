import z from "zod";
import { CreateDokumenBorangType } from "../models/dokumenBorang.model";
import { LokasiFile } from "../utils/contstanst";

export class DokumenBorangValidation {
  static readonly fileItemSchema = z.object({
    useOldFile: z.boolean(),
    oldDokumenBorangId: z.number().int().positive().optional(),
  });

  static readonly CREATE = z
    .object({
      uploadedBy: z.number().int().positive(),
      keterangan: z.string().min(1).max(1000),
      picId: z.number().int().positive(),
      filename: z.array(z.string()).min(1).max(4),
      lokasiFile: z.enum(
        ["GDRIVE", "SISTEM"] as LokasiFile[],
        "lokasi file tidak falid",
      ),
      files: z.array(this.fileItemSchema).min(1).max(4),
    })
    .strict() satisfies z.ZodType<Omit<CreateDokumenBorangType, "assignedBy">>;

  static UPDATE = {};
}
