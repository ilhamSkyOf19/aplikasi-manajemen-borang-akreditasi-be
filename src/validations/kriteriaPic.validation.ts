import z from "zod";
import { AddPicToKriteriaType } from "../models/kriteriaPic.model";

export class KriteriaPicValidation {
  static readonly ADD_PIC = z
    .object({
      kriteria_id: z.number().min(1).max(2147483647),
      dosen_id: z.array(z.number().min(1)).min(1),
    })
    .strict() satisfies z.ZodType<AddPicToKriteriaType>;

  // params id
  static readonly PARAMS_KRITERIA_ID = z
    .object({
      kriteria_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ kriteria_id: number }>;
}
