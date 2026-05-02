import z from "zod";
import {
  CreateDosenType,
  LoginDosenType,
  UpdateDosenType,
} from "../models/dosen.model";
import { DosenRole } from "../utils/contstanst";
import { PaginationType } from "../types/pagination";

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
    return z.email();
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
      roles: z.array(
        z.enum(["wakil_dekan_1", "kaprodi", "tim_akreditasi"] as DosenRole[]),
      ),
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
      roles: z
        .array(
          z.enum(["wakil_dekan_1", "kaprodi", "tim_akreditasi"] as DosenRole[]),
        )
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateDosenType>;

  // pagination
  static readonly QUERY_PARAMS = z
    .object({
      page: z
        .string()
        .transform((val) => parseInt(val))
        .optional(),
      limit: z
        .string()
        .transform((val) => parseInt(val))
        .optional(),
      search: z.string().trim().optional(),
      sort: z.enum(["asc", "desc"]).optional(),
      role: z.enum(DosenRole).optional(),
    })
    .strict() satisfies z.ZodType<PaginationType & { role?: DosenRole }>;

  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ id: number }>;

  // query search and page
  static readonly QUERY_SEARCH_AND_PAGE = z
    .object({
      search: z.string().trim().optional(),
      page: z.coerce.number().min(1).max(2147483647).catch(1),
    })
    .strict() satisfies z.ZodType<{ search?: string; page?: number }>;
}
