import z from "zod";
import {
  CreateKriteriaType,
  UpdateKriteriaType,
} from "../models/kriteria.model";

export class KriteriaValidation {
  // only char schema
  private static onlyNumberSchema(
    field: string,
    min: number = 1,
    max: number = 100,
  ) {
    return z
      .number(`${field} harus berupa number`)
      .min(min, `${field} minimal ${min}`)
      .max(max, `${field} maksimal ${max}`);
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

  // create user schema
  static readonly CREATE = z
    .object({
      kriteria: this.onlyNumberSchema("kriteria"),
      namaKriteria: this.stringSchema("namaKriteria"),
    })
    .strict() satisfies z.ZodType<CreateKriteriaType>;

  // update user schema
  // update schema (optional per field)
  static readonly UPDATE = z
    .object({
      kriteria: this.onlyNumberSchema("kriteria").optional(),
      namaKriteria: this.stringSchema("namaKriteria").optional(),
    })
    .strict() satisfies z.ZodType<UpdateKriteriaType>;
}
