import z from "zod";
import { CreatePicType, UpdatePicType } from "../models/pic.model";
import { Status } from "../utils/contstanst";

export class PicValidation {
  // only number
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

  // string
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

  // number array schema
  private static numberArraySchema(field: string) {
    return z
      .array(z.number().int().positive())
      .nonempty({ message: `${field} harus berupa array yang tidak kosong` })
      .refine((arr) => arr.every((n) => typeof n === "number"), {
        message: `${field} harus berupa array of number`,
      });
  }

  //   create
  static readonly CREATE = z
    .object({
      timAkreditasiId: this.onlyNumberSchema("tim akreditasi", 1, 99999),
      kebutuhanDokumenId: this.onlyNumberSchema("kebutuhan dokumen", 1, 99999),
      keterangan: this.stringSchema("keterangan", 1, 1000),
      pjId: this.numberArraySchema("penanggung jawab"),
    })
    .strict() satisfies z.ZodType<CreatePicType>;

  // update
  static readonly UPDATE = z
    .object({
      timAkreditasiId: this.onlyNumberSchema(
        "tim akreditasi",
        1,
        99999,
      ).optional(),
      pjId: this.numberArraySchema("penanggung jawab").optional(),
      kebutuhanDokumenId: this.onlyNumberSchema(
        "kebutuhan dokumen",
        1,
        99999,
      ).optional(),
      keterangan: this.stringSchema("keterangan", 1, 1000).optional(),
    })
    .strict() satisfies z.ZodType<UpdatePicType>;
}
