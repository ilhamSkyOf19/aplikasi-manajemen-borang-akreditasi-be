import z from "zod";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import {
  CreateKriteriaPicType,
  UpdateKriteriaPicType,
} from "../models/kriteriaPic.model";

export class KriteriaPicValidation {
  static readonly CREATE = z
    .object({
      kriteria_id: z.number().min(1).max(2147483647),
      dosen_id: z.array(z.number().min(1)).min(1),
    })
    .strict() satisfies z.ZodType<CreateKriteriaPicType>;

  static readonly UPDATE = z
    .object({
      dosen_id: z.array(z.number().min(1)).min(1),
    })
    .strict() satisfies z.ZodType<UpdateKriteriaPicType>;
}
