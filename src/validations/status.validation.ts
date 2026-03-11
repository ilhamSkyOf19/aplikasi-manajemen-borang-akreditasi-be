import z from "zod";
import { UpdateStatusType } from "../models/status.model";
import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";

export class StatusValidation {
  static readonly UPDATE_STATUS = z
    .object({
      status: z.enum(["menunggu", "revisi", "disetujui"] as Status[]),
      keterangan: z.string().trim().min(1).max(1000),
      jenisRiwayat: z.enum(["pic", "dokumen_borang"] as JenisRiwayat[]),
      flagRevisi: z
        .array(
          z.enum([
            "pic",
            "kebutuhan_dokumen",
            "dokumen_borang",
          ] as FlagRevisi[]),
        )
        .nonempty()
        .optional(),
    })
    .strict() satisfies z.ZodType<UpdateStatusType>;
}
