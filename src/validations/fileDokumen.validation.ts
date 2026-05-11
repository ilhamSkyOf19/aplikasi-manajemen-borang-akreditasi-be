import z from "zod";
import { TipeDokumentasi } from "../utils/contstanst";

export class FileDokumenValidation {
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
