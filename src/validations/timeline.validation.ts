import z from "zod";
import {
  CreateTimelineType,
  UpdateTimelineType,
} from "../models/timeline.model";

export class TimelineValidation {
  // update
  static readonly UPDATE = z
    .object({
      deadline_kebutuhan_dokumentasi: z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
          message: "deadline kebutuhan dokumentasi harus berupa tanggal valid",
        })
        .optional(),
      deadline_dokumentasi_borang: z
        .string()
        .transform((val) => new Date(val))
        .refine((date) => !isNaN(date.getTime()), {
          message: "deadline kebutuhan dokumentasi harus berupa tanggal valid",
        })
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateTimelineType>;
}
