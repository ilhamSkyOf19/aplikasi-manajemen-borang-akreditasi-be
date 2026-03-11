import z from "zod";
import { CreatePicType, UpdatePicType } from "../models/pic.model";

export class PicValidation {
  // create
  static readonly CREATE = z
    .object({
      timAkreditasiId: z.array(z.number().int().positive()).nonempty(),
      kebutuhanDokumenId: z.number().min(1).max(99999),
      keterangan: z.string().trim().min(1).max(1000),
    })
    .strict() satisfies z.ZodType<CreatePicType>;

  // update
  static readonly UPDATE = z
    .object({
      timAkreditasiId: z.array(z.number().int().positive()).optional(),
      kebutuhanDokumenId: z.number().min(1).max(99999).optional(),
      keterangan: z.string().trim().min(1).max(1000).optional(),
      keteranganUpdate: z.string().trim().min(1).max(1000),
    })
    .strict() satisfies z.ZodType<UpdatePicType>;
}
