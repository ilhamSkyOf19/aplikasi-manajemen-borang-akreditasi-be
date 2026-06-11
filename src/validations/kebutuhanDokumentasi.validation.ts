import z from "zod";
import { Status, TipeDokumentasi } from "../utils/contstanst";
import { PaginationType } from "../types/pagination";
import {
  CreateKebutuhanDokumentasiRequestType,
  LokasiRequestType,
  UpdateKebutuhanDokumentasiRequestType,
} from "../models/kebutuhanDokumentasi.model";

export class KebutuhanDokumentasiValidation {
  // schema
  private static readonly lokasiSchema = z
    .object({
      lokasi_old: z.number().int().min(1).max(2147483647).optional(),
      lokasi_new: z.string().min(1).max(100).optional(),
    })
    .superRefine((data, ctx) => {
      const hasLokasiOld =
        data.lokasi_old !== undefined && data.lokasi_old !== null;
      const hasLokasiNew =
        data.lokasi_new !== undefined && data.lokasi_new.trim() !== "";

      // check pic id & pic new
      if (!hasLokasiOld && !hasLokasiNew) {
        ctx.addIssue({
          code: "custom",
          path: ["lokasi_new"],
          message: "lokasi new atau lokasi old harus diisi",
        });
        ctx.addIssue({
          code: "custom",
          path: ["lokasi_old"],
          message: "lokasi old atau lokasi new harus diisi",
        });
      }

      if (hasLokasiOld && hasLokasiNew) {
        ctx.addIssue({
          code: "custom",
          path: ["lokasi_new"],
          message: "lokasi old atau lokasi new tidak boleh diisi bersamaan",
        });
        ctx.addIssue({
          code: "custom",
          path: ["lokasi_old"],
          message: "lokasi old atau lokasi new harus diisi",
        });
      }
    })
    .strict() satisfies z.ZodType<LokasiRequestType>;

  // create
  static readonly CREATE = z
    .object({
      kriteria_id: z.number().int().min(1).max(2147483647),
      pendekatan_id: z.number().int().min(1).max(2147483647),
      nama_dokumentasi_id: z.number().int().min(1).max(2147483647).optional(),
      lokasi: z.array(this.lokasiSchema).min(1),
      nama_dokumentasi_new: z.string().min(1).max(200).optional(),
      tipe_dokumentasi: z.enum(["DEFAULT", "PENELITIAN"] as TipeDokumentasi[]),
      keterangan: z.string().min(1).max(1000),
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasNamaDokumentasiId =
        data.nama_dokumentasi_id !== undefined &&
        data.nama_dokumentasi_id !== null;

      const hasNamaDokumentasiNew =
        data.nama_dokumentasi_new !== undefined &&
        data.nama_dokumentasi_new.trim() !== "";

      if (!hasNamaDokumentasiId && !hasNamaDokumentasiNew) {
        ctx.addIssue({
          code: "custom",
          path: ["nama_dokumentasi_id"],
          message: "nama_dokumentasi_id atau nama_dokumentasi_new harus diisi",
        });
      }

      if (hasNamaDokumentasiId && hasNamaDokumentasiNew) {
        ctx.addIssue({
          code: "custom",
          path: ["nama_dokumentasi_id"],
          message:
            "nama_dokumentasi_id dan nama_dokumentasi_new tidak boleh diisi bersamaan",
        });
      }
    }) satisfies z.ZodType<CreateKebutuhanDokumentasiRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      kriteria_id: z.number().int().min(1).max(2147483647).optional(),
      pendekatan_id: z.number().int().min(1).max(2147483647).optional(),
      nama_dokumentasi_id: z.number().int().min(1).max(2147483647).optional(),
      pic: z.array(this.lokasiSchema).min(1).optional(),
      nama_dokumentasi_new: z.string().min(1).max(200).optional(),
      tipe_dokumentasi: z
        .enum(["DEFAULT", "PENELITIAN"] as TipeDokumentasi[])
        .optional(),
      keterangan: z.string().min(1).max(1000).optional(),
      keterangan_update: z.string().min(1).max(1000),
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasNamaDokumentasiId =
        data.nama_dokumentasi_id !== undefined &&
        data.nama_dokumentasi_id !== null;

      const hasNamaDokumentasiNew =
        data.nama_dokumentasi_new !== undefined &&
        data.nama_dokumentasi_new.trim() !== "";

      if (hasNamaDokumentasiId && hasNamaDokumentasiNew) {
        ctx.addIssue({
          code: "custom",
          path: ["nama_dokumentasi_id"],
          message:
            "nama_dokumentasi_id dan nama_dokumentasi_new tidak boleh diisi bersamaan",
        });
      }
    }) satisfies z.ZodType<UpdateKebutuhanDokumentasiRequestType>;

  // query
  static readonly QUERY = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(8),

      search: z.string().min(1).max(1000).optional(),

      sort: z.enum(["asc", "desc"]).catch("desc"),

      status: z
        .enum(["PENDING", "REVISION", "APPROVED"] as Status[])
        .optional(),
    })
    .strict() satisfies z.ZodType<PaginationType & { status?: Status }>;

  static readonly QUERY_NON_STATUS = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(8),

      search: z.string().min(1).max(1000).optional(),

      sort: z.enum(["asc", "desc"]).catch("desc"),
    })
    .strict() satisfies z.ZodType<PaginationType>;

  // non status and sort
  static readonly QUERY_NON_STATUS_AND_SORT = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(8),

      search: z.string().min(1).max(1000).optional(),
    })
    .strict() satisfies z.ZodType<Omit<PaginationType, "sort">>;

  // params
  static readonly PARAMS = z
    .object({
      kriteria_id: z.coerce.number().min(1).max(2147483647),
      pendekatan_id: z.coerce.number().min(1).max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    kriteria_id: number;
    pendekatan_id: number;
  }>;

  // params update
  static readonly PARAMS_UPDATE = z
    .object({
      kebutuhan_dokumentasi_pic_id: z.coerce.number().min(1).max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    kebutuhan_dokumentasi_pic_id: number;
  }>;

  // params id
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().min(1).max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    id: number;
  }>;
}
