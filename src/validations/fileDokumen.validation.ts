import z from "zod";
import { PaginationType } from "../types/pagination";

export class FileDokumenValidation {
  static readonly QUERY_PARAMS = z
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
}
