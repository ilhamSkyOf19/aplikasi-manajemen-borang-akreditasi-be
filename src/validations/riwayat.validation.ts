import z from "zod";

export class RiwayatValidation {
  // params id
  static readonly PARAMS_ID = z
    .object({
      kebutuhan_dokumentasi_pic_id: z.coerce.number().min(1).max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    kebutuhan_dokumentasi_pic_id: number;
  }>;
}
