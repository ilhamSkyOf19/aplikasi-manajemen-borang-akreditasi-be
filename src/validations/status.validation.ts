import z from "zod";
import { UpdateStatusType } from "../models/status.model";
import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";

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
      jenisRiwayat: z.enum(
        ["pic", "dokumen_borang"] as JenisRiwayat[],
        "jenis riwayat tidak valid",
      ),
      flagRevisi: z
        .array(
          z.enum(
            ["pic", "kebutuhan_dokumen", "dokumen_borang"] as FlagRevisi[],
            "flag revisi tidak valid",
          ),
        )
        .nonempty({
          message: `flag revisi harus berupa array yang tidak kosong`,
        })
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateStatusType>;
}
