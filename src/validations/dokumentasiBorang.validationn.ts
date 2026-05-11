import z from "zod";
import { AjukanRequestType } from "../models/dokumentasiBorang.model";

export class DokumentasiBorangValidation {
  // params dokumentasi borang id and folder id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID_AND_FOLDER_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
      folder_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    folder_id: number;
    dokumentasi_borang_id: number;
  }>;

  // params kebutuhan dokumentasi by id
  static readonly PARAMS_KEBUTUHAN_DOKUMENTASI_ID = z
    .object({
      kebutuhan_dokumentasi_id: z.coerce
        .number()
        .int()
        .positive()
        .max(2147483647),
    })
    .strict() satisfies z.ZodType<{ kebutuhan_dokumentasi_id: number }>;

  // params dokumentasi borang id and folder id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
      file_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    file_id: number;
    dokumentasi_borang_id: number;
  }>;

  // params dokumentasi borang id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ dokumentasi_borang_id: number }>;

  // ajukan
  static readonly AJUKAN = z
    .object({
      keterangan: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<AjukanRequestType>;
}
