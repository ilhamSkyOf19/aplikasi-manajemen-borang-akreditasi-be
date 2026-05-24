import z from "zod";
import {
  CreateDosenType,
  LoginDosenType,
  ResetPasswordType,
  UpdateDosenType,
  UpdatePasswordType,
  UpdateSelfDataType,
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

  static readonly UPDATE_PASSWORD = z
    .object({
      newPassword: this.passwordSchema(),
      oldPassword: this.passwordSchema(),
      confirmNewPassword: this.passwordSchema(),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.confirmNewPassword) {
        ctx.addIssue({
          code: "custom",
          message: "password tidak sama",
          path: ["newPassword"],
        });
        ctx.addIssue({
          code: "custom",
          message: "password tidak sama",
          path: ["confirmPassword"],
        });
      }
      if (data.newPassword === data.oldPassword) {
        ctx.addIssue({
          code: "custom",
          message: "password tidak boleh sama dengan password lama",
          path: ["newPassword"],
        });
        ctx.addIssue({
          code: "custom",
          message: "password tidak boleh sama dengan password lama",
          path: ["oldPassword"],
        });
      }
    })
    .strict() satisfies z.ZodType<UpdatePasswordType>;

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

  // update
  static readonly UPDATE_SELF_DATA = z
    .object({
      nama: this.onlyCharSchema().optional(),
      email: this.emailSchema().optional(),
      nidn: this.nidnSchema().optional(),
    })
    .strict() satisfies z.ZodType<UpdateSelfDataType>;

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

  // switch role
  static readonly SWITCH_ROLE = z
    .object({
      role: z.enum(DosenRole),
    })
    .strict() satisfies z.ZodType<{ role: DosenRole }>;

  // reset password
  static readonly RESET_PASSWORD = z
    .object({
      password: this.passwordSchema(),
      confirmPassword: this.passwordSchema(),
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
    .strict() satisfies z.ZodType<ResetPasswordType>;
}
