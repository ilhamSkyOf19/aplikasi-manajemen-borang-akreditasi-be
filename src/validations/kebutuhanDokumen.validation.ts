import z from "zod";
import {
  CreateKebutuhanDokumenType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { Status } from "../utils/contstanst";

export class KebutuhanDokumenValidation {
  // schema
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

  //   number schema
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

  //   create
  static readonly CREATE = z
    .object({
      namaDokumen: this.stringSchema("kebutuhanDokumen"),
      keterangan: this.stringSchema("keterangan"),
      kriteriaId: this.onlyNumberSchema("kriteria", 1, 99999),
      pendekatanId: this.onlyNumberSchema("pendekatan", 1, 99999),
    })
    .strict() satisfies z.ZodType<CreateKebutuhanDokumenType>;

  //   update
  static readonly UPDATE = z
    .object({
      namaDokumen: this.stringSchema("kebutuhanDokumen").optional(),
      keterangan: this.stringSchema("keterangan").optional(),
      kriteriaId: this.onlyNumberSchema("kriteria", 1, 99999).optional(),
      pendekatanId: this.onlyNumberSchema("pendekatan", 1, 99999).optional(),
      keteranganUpdate: this.stringSchema("keteranganUpdate", 1, 1000),
    })
    .strict() satisfies z.ZodType<UpdateKebutuhanDokumenType>;
}
