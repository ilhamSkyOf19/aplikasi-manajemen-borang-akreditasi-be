import z from "zod";
import { UpdateStatusType } from "../models/status.model";
import { Status } from "../utils/contstanst";

export class StatusValidation {
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
  // update status
  static readonly UPDATE_STATUS = z
    .object({
      status: z.enum(
        ["menunggu", "revisi", "disetujui"] as Status[],
        "Status tidak valid",
      ),
      keterangan: this.stringSchema("keterangan", 1, 1000),
    })
    .strict() satisfies z.ZodType<UpdateStatusType>;
}
