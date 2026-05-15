import z from "zod";
import { PaginationType } from "../types/pagination";

export class NotifikasiValidation {
  static readonly QUERY = z
    .object({
      page: z.coerce.number().optional(),

      limit: z.coerce.number().optional(),

      search: z.string().trim().optional(),

      sort: z.enum(["asc", "desc"]).optional(),

      isRead: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .optional(),
    })
    .strict() satisfies z.ZodType<
    PaginationType & {
      isRead?: boolean;
    }
  >;
}
