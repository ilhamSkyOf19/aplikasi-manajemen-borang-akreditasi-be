import z from "zod";
import {
  CreateKebutuhanDokumenType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";

export class KebutuhanDokumenValidation {
  // create
  static readonly CREATE = z
    .object({
      namaDokumen: z.string().trim().min(1).max(100),
      keterangan: z.string().trim().min(1).max(100),
      kriteriaId: z.number().min(1).max(99999),
      pendekatanId: z.number().min(1).max(99999),
    })
    .strict() satisfies z.ZodType<CreateKebutuhanDokumenType>;

  // update
  static readonly UPDATE = z
    .object({
      namaDokumen: z.string().trim().min(1).max(100).optional(),
      keterangan: z.string().trim().min(1).max(100).optional(),
      kriteriaId: z.number().min(1).max(99999).optional(),
      pendekatanId: z.number().min(1).max(99999).optional(),
      keteranganUpdate: z.string().trim().min(1).max(1000),
    })
    .strict() satisfies z.ZodType<UpdateKebutuhanDokumenType>;
}
