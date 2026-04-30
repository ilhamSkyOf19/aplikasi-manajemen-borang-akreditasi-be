import z from "zod";
import { TipeRiwayat } from "../utils/contstanst";

export class RiwayatValidation {
  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().min(1).max(2147483647),
      tipe_riwayat: z.enum(TipeRiwayat),
    })
    .strict() satisfies z.ZodType<{
    id: number;
    tipe_riwayat: TipeRiwayat;
  }>;
}
