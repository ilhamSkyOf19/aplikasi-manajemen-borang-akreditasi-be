import z from "zod";
import {
  CreateDosenType,
  LoginDosenType,
  UpdateDosenType,
} from "../models/dosen.model";
import { DosenRole } from "../utils/contstanst";

export class DosenValidation {
  // only char schema
  private static onlyCharSchema(min: number = 1, max: number = 100) {
    return z
      .string()
      .trim()
      .min(min)
      .max(max)
      .regex(/^[A-Za-z\s.,]+$/);
  }

  // nidn schema
  private static nidnSchema() {
    return z
      .string()
      .regex(/^\d{10}$/, "NIDN harus terdiri dari 10 digit angka");
  }

  // string schema
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  // email schema
  private static emailSchema() {
    return z.string().email();
  }

  // password schema
  private static passwordSchema(min: number = 6, max: number = 50) {
    return z.string().trim().min(min).max(max);
  }

  // create user schema
  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema(),
      email: this.emailSchema(),
      nidn: this.nidnSchema(),
      password: this.passwordSchema(),
      confirmPassword: this.passwordSchema(),
      role: z.enum([
        "wakil_dekan_1",
        "kaprodi",
        "tim_akreditasi",
      ] as DosenRole[]),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "password tidak sama",
          path: ["confirmPassword"],
        });
      }
    })
    .strict() satisfies z.ZodType<CreateDosenType>;

  // login
  static readonly LOGIN = z
    .object({
      identifier: this.stringSchema(),
      password: this.passwordSchema(),
    })
    .strict() satisfies z.ZodType<LoginDosenType>;

  // update
  static readonly UPDATE = z
    .object({
      nama: this.onlyCharSchema().optional(),
      email: this.emailSchema().optional(),
      nidn: this.nidnSchema().optional(),
      password: this.passwordSchema().optional(),
      role: z
        .enum(["kaprodi", "tim_akreditasi"] as Exclude<
          DosenRole,
          "wakil_dekan_1"
        >[])
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateDosenType>;
}
