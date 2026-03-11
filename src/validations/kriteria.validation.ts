import z from "zod";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";

export class KriteriaValidation {
  static readonly CREATE = z
    .object({
      kriteria: z.number().min(1).max(100),
      namaKriteria: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<CreateKriteriaType>;

  static readonly UPDATE = z
    .object({
      kriteria: z.number().min(1).max(100).optional(),
      namaKriteria: z.string().trim().min(1).max(100).optional(),
    })
    .strict() satisfies z.ZodType<UpdateKriteriaType>;
}
