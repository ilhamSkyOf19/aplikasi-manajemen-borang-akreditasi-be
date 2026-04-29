import z from "zod";
import { Status } from "../utils/contstanst";
import { VerifikasiKebutuhanDokumentasiPicType } from "../models/kebutuhanDokumentasiPic.model";
import { VerifikasiDokumentasiBorangType } from "../models/dokumentasiBorang.model";

export class VerifikasiValidation {
  // verifikasi kebutuhan dokumentasi pic
  static readonly VERIFIKASI_KEBUTUHAN_DOKUMENTASI_PIC = z
    .object({
      kebutuhan_dokumentasi_pic_id: z.number().int().positive().max(2147483647),
      keterangan_verifikasi: z.string().trim().min(1).max(1000),
      status: z.enum(["PENDING", "REVISION", "APPROVED"] as Status[]),
    })
    .strict() satisfies z.ZodType<VerifikasiKebutuhanDokumentasiPicType>;

  // verifikasi dokumentasi borang
  static readonly VERIFIKASI_DOKUMENTASI_BORANG = z
    .object({
      dokumentasi_borang_id: z.number().int().positive().max(2147483647),
      keterangan_verifikasi: z.string().trim().min(1).max(1000),
      status: z.enum(["PENDING", "REVISION", "APPROVED"] as Status[]),
    })
    .strict() satisfies z.ZodType<VerifikasiDokumentasiBorangType>;
}
