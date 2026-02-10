import z from "zod";
import {
  CreateTimAkreditasiType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";

export class TimAkreditasivalidation {
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

  //   json schema
  private static numberArraySchema(field: string) {
    return z
      .array(z.number().int().positive())
      .nonempty({ message: `${field} harus berupa array yang tidak kosong` })
      .refine((arr) => arr.every((n) => typeof n === "number"), {
        message: `${field} harus berupa array of number`,
      });
  }

  // create
  static readonly CREATE = z
    .object({
      namaTimAkreditasi: this.stringSchema("namaTimAkreditasi"),
      users: this.numberArraySchema("users"),
    })
    .strict() satisfies z.ZodType<CreateTimAkreditasiType>;

  // update
  static readonly UPDATE = z
    .object({
      namaTimAkreditasi: this.stringSchema("namaTimAkreditasi").optional(),
      users: this.numberArraySchema("users").optional(),
    })
    .strict() satisfies z.ZodType<UpdateTimAkreditasiType>;
}
