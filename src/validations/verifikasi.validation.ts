import z from "zod";
import { Status } from "../utils/contstanst";
import {
  VerifikasiType,
  VerifikasiUpdateType,
} from "../models/verifikasi.model";

export class VerifikasiValidation {
  // verifikasi kebutuhan dokumentasi pic
  static readonly VERIFIKASI = z
    .object({
      dokumentasi_borang_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      kebutuhan_dokumentasi_pic_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      keterangan_verifikasi: z.string().trim().min(1).max(1000),
      status: z.enum([Status.APPROVED, Status.REVISION] as Exclude<
        Status,
        "PENDING"
      >[]),
    })
    .superRefine((data, ctx) => {
      // dokumentasi borang id
      const hasDokumentasiBorangId =
        data.dokumentasi_borang_id !== undefined &&
        data.dokumentasi_borang_id !== null;
      const hasKebutuhanDokumentasiPicId =
        data.kebutuhan_dokumentasi_pic_id !== undefined &&
        data.kebutuhan_dokumentasi_pic_id !== null;

      // check exist dokumentasi borang id or kebutuhan dokumentasi pic id
      if (!hasDokumentasiBorangId && !hasKebutuhanDokumentasiPicId)
        ctx.addIssue({
          code: "custom",
          message:
            "dokumentasi borang id or kebutuhan dokumentasi pic id is required",
        });

      // check dokumentasi borang id or kebutuhan dokumentasi pic id
      if (hasDokumentasiBorangId && hasKebutuhanDokumentasiPicId)
        ctx.addIssue({
          code: "custom",
          message:
            "dokumentasi borang id or kebutuhan dokumentasi pic id is required",
        });
    })
    .strict() satisfies z.ZodType<VerifikasiType>;

  // update
  static readonly UPDATE_VERIFIKASI = z
    .object({
      dokumentasi_borang_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      kebutuhan_dokumentasi_pic_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      keterangan_verifikasi: z.string().trim().min(1).max(1000).optional(),
      status: z
        .enum([Status.APPROVED, Status.REVISION] as Exclude<
          Status,
          "PENDING"
        >[])
        .optional(),
    })
    .superRefine((data, ctx) => {
      // dokumentasi borang id
      const hasDokumentasiBorangId =
        data.dokumentasi_borang_id !== undefined &&
        data.dokumentasi_borang_id !== null;
      const hasKebutuhanDokumentasiPicId =
        data.kebutuhan_dokumentasi_pic_id !== undefined &&
        data.kebutuhan_dokumentasi_pic_id !== null;

      // check exist dokumentasi borang id or kebutuhan dokumentasi pic id
      if (!hasDokumentasiBorangId && !hasKebutuhanDokumentasiPicId)
        ctx.addIssue({
          code: "custom",
          message:
            "dokumentasi borang id or kebutuhan dokumentasi pic id is required",
        });

      // check dokumentasi borang id or kebutuhan dokumentasi pic id
      if (hasDokumentasiBorangId && hasKebutuhanDokumentasiPicId)
        ctx.addIssue({
          code: "custom",
          message:
            "dokumentasi borang id or kebutuhan dokumentasi pic id is required",
        });
    })
    .strict() satisfies z.ZodType<VerifikasiUpdateType>;

  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ id: number }>;
}
