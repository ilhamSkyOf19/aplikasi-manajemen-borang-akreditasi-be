import z from "zod";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { PaginationType } from "../types/pagination";

export class KriteriaValidation {
  static readonly CREATE = z
    .object({
      kode_kriteria: z.number().min(1).max(100),
      nama_kriteria: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<CreateKriteriaType>;

  static readonly UPDATE = z
    .object({
      kode_kriteria: z.number().min(1).max(100).optional(),
      nama_kriteria: z.string().trim().min(1).max(100).optional(),
    })
    .strict() satisfies z.ZodType<UpdateKriteriaType>;

  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ id: number }>;

  // query
  static readonly QUERY = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(10),

      search: z.string().min(1).max(1000).optional(),

      sort: z.enum(["asc", "desc"]).catch("desc"),
    })
    .strict() satisfies z.ZodType<PaginationType>;
}
