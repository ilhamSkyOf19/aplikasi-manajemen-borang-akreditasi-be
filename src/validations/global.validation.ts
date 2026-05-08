import z from "zod";
import { PaginationType } from "../types/pagination";

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
}
