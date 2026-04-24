import z from "zod";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";

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
}
