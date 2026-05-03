import z from "zod";
import { PaginationType } from "../types/pagination";

export class NamaKebutuhanDokumentasiValidation {
  static readonly QUERY = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(10),

      search: z.string().min(1).max(1000).optional(),

      sort: z.enum(["asc", "desc"]).catch("desc"),
    })
    .strict() satisfies z.ZodType<PaginationType>;
}
