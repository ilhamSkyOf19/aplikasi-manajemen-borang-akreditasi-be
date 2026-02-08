import z from "zod";
import { CreateUserType, LoginUserType } from "../models/user.model";
import { UserRole } from "../utils/contstanst";

export class UserValidation {
  // only char schema
  private static onlyCharSchema(
    field: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .string(`${field} harus berupa karakter`)
      .trim()
      .min(min, `${field} minimal ${min} karakter`)
      .max(max, `${field} maksimal ${max} karakter`)
      .regex(/^[A-Za-z\s]+$/, `${field} hanya boleh berisi huruf`);
  }

  // string schema
  private static stringSchema(
    field: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .string(`${field} harus berupa karakter`)
      .trim()
      .min(min, `${field} minimal ${min} karakter`)
      .max(max, `${field} maksimal ${max} karakter`);
  }

  // email schema
  private static emailSchema() {
    return z.email(`Email harus berupa karakter`);
  }

  // password schema
  private static passwordSchema(min: number = 6, max: number = 50) {
    return z
      .string(`Password harus berupa karakter`)
      .trim()
      .min(min, `Password minimal ${min} karakter`)
      .max(max, `Password maksimal ${max} karakter`);
  }

  // create user schema
  static readonly CREATE = z
    .object({
      nama: this.onlyCharSchema("Nama"),
      email: this.emailSchema(),
      password: this.passwordSchema(),
      role: z.enum(
        ["wakil_dekan_1", "kaprodi", "tim_akreditasi"] as UserRole[],
        "Role harus WAKIL DEKAN atau KAPRODI atau TIM AKREDITASI",
      ),
    })
    .strict() satisfies z.ZodType<CreateUserType>;

  // login
  static readonly LOGIN = z
    .object({
      identifier: this.stringSchema("identifier"),
      password: this.passwordSchema(),
    })
    .strict() satisfies z.ZodType<LoginUserType>;
}
