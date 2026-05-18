import z from "zod";
import { CreatePeriodeType } from "../models/periode.model";

export class PeriodeValidation {
  // create
  static readonly CREATE = z
    .object({
      start_date: z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
          message: "start_date harus berupa tanggal valid",
        }),

      end_date: z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
          message: "end_date harus berupa tanggal valid",
        }),
    })
    .superRefine(({ start_date, end_date }, ctx) => {
      if (start_date > end_date) {
        ctx.addIssue({
          code: "custom",
          message: "start_date harus lebih kecil dari end_date",
          path: ["start_date"],
        });

        ctx.addIssue({
          code: "custom",
          message: "end_date harus lebih besar dari start_date",
          path: ["end_date"],
        });
      }
    })
    .strict() satisfies z.ZodType<CreatePeriodeType>;
}
