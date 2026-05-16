import z from "zod";
import { PaginationType } from "../types/pagination";
import { TipeDokumentasi } from "../utils/contstanst";

export class GlobalValidation {
  static readonly QUERY = z
    .object({
      page: z.coerce.number().optional(),

      limit: z.coerce
        .number()
        .transform((val) => {
          return val > 24 ? 24 : val;
        })
        .optional(),

      search: z.string().trim().optional(),

      sort: z.enum(["asc", "desc"]).optional(),
    })
    .strict() satisfies z.ZodType<PaginationType>;

  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ id: number }>;

  // params id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_DOKUMEN_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
      file_dokumen_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }>;

  // params id
  static readonly PARAMS_PREVIEW_FILE = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
      nama_file: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<{ id: number; nama_file: string }>;
}
