import z from "zod";
import {
  CreateTimAkreditasiType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";

export class TimAkreditasiValidation {
  // string schema
  private static stringSchema(min: number = 1, max: number = 100) {
    return z.string().trim().min(min).max(max);
  }

  // array schema
  private static numberArraySchema() {
    return z.array(z.number().int().positive()).nonempty();
  }

  // array schema update
  private static numberArraySchemaUpdate() {
    return z.array(z.number().int().positive());
  }

  // create
  static readonly CREATE = z
    .object({
      namaTimAkreditasi: this.stringSchema(),
      users: this.numberArraySchema(),
    })
    .strict() satisfies z.ZodType<CreateTimAkreditasiType>;

  // update
  static readonly UPDATE = z
    .object({
      namaTimAkreditasi: this.stringSchema().optional(),
      users: this.numberArraySchemaUpdate().optional(),
    })
    .strict() satisfies z.ZodType<UpdateTimAkreditasiType>;
}
