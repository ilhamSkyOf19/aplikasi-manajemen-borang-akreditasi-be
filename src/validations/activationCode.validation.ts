import z from "zod";

export class ActivationCodeValidation {
  static readonly CREATE = z
    .object({
      email: z.email(),
    })
    .strict() satisfies z.ZodType<{ email: string }>;

  // verify
  static readonly VERIFY = z
    .object({
      email: z.email(),
      code: z
        .number()
        .refine((val) => val.toString().length === 6, "Code harus 6 digit"),
    })
    .strict() satisfies z.ZodType<{ email: string; code: number }>;
}
