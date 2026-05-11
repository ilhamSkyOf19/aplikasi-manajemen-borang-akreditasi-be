import z from "zod";
import { UpdateFileDefaultType } from "../models/fileDokumen.model";
import { TipeDokumentasi } from "../utils/contstanst";

export class FileDokumenValidation {
  // update file default
  static readonly UPDATE_DEFAULT = z
    .object({
      nama_file: z.string().trim().min(1).max(100).optional(),
      keterangan: z.string().trim().min(1).max(1000).optional(),
      nomor_dokumen: z.string().trim().min(1).max(1000).optional(),
    })
    .strict() satisfies z.ZodType<UpdateFileDefaultType>;

  // params
  static readonly PARAMS_FILE_ID_AND_DOKUMENTASI_BORANG_ID = z
    .object({
      file_id: z.coerce.number().int().positive().max(2147483647),
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    file_id: number;
    dokumentasi_borang_id: number;
  }>;

  //  params tipe file
  static readonly PARAMS_TIPE_FILE = z
    .object({
      tipe_file: z.enum(TipeDokumentasi),
    })
    .strict() satisfies z.ZodType<{ tipe_file: TipeDokumentasi }>;
}
