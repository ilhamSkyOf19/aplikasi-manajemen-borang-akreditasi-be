import z from "zod";
import { PaginationType } from "../types/pagination";
import { TipeDokumentasi } from "../utils/contstanst";

export class GlobalValidation {
  static readonly QUERY = z
    .object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .optional(),
      limit: z
        .string()
        .transform((val) => parseInt(val))
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
  static readonly PARAMS_PREVIEW_FILE = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
      nama_file: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<{ id: number; nama_file: string }>;
}
