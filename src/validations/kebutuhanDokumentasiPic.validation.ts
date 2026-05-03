import z from "zod";
import {
  CreateKebutuhanDokumentasiPicRequestType,
  PicRequestType,
  UpdateKebutuhanDokumentasiPicRequestType,
} from "../models/kebutuhanDokumentasiPic.model";
import { Status, TipeDokumentasi } from "../utils/contstanst";
import { PaginationType } from "../types/pagination";

export class KebutuhanDokumentasiPicValidation {
  // schema pic
  private static readonly picSchema = z
    .object({
      pic_old: z.number().int().min(1).max(2147483647).optional(),
      pic_new: z.string().min(1).max(100).optional(),
    })
    .superRefine((data, ctx) => {
      const hasPicId = data.pic_old !== undefined && data.pic_old !== null;
      const hasPicNew =
        data.pic_new !== undefined && data.pic_new.trim() !== "";

      // check pic id & pic new
      if (!hasPicId && !hasPicNew) {
        ctx.addIssue({
          code: "custom",
          path: ["pic_id"],
          message: "pic_id atau pic_new harus diisi",
        });
      }

      if (hasPicId && hasPicNew) {
        ctx.addIssue({
          code: "custom",
          path: ["pic_id"],
          message: "pic_id atau pic_new tidak boleh diisi bersamaan",
        });
      }
    })
    .strict() satisfies z.ZodType<PicRequestType>;

  // create
  static readonly CREATE = z
    .object({
      kriteria_id: z.number().int().min(1).max(2147483647),
      pendekatan_id: z.number().int().min(1).max(2147483647),
      nama_dokumentasi_id: z.number().int().min(1).max(2147483647).optional(),
      pic: z.array(this.picSchema).min(1),
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
    }) satisfies z.ZodType<CreateKebutuhanDokumentasiPicRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      kriteria_id: z.number().int().min(1).max(2147483647).optional(),
      pendekatan_id: z.number().int().min(1).max(2147483647).optional(),
      nama_dokumentasi_id: z.number().int().min(1).max(2147483647).optional(),
      pic: z.array(this.picSchema).min(1).optional(),
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
    }) satisfies z.ZodType<UpdateKebutuhanDokumentasiPicRequestType>;

  // query
  static readonly QUERY = z
    .object({
      page: z.coerce.number().min(1).max(2147483647).catch(1),

      limit: z.coerce.number().min(1).max(2147483647).catch(10),

      search: z.string().min(1).max(1000).optional(),

      sort: z.enum(["asc", "desc"]).catch("desc"),

      status: z
        .enum(["PENDING", "REVISION", "APPROVED"] as Status[])
        .optional(),
    })
    .strict() satisfies z.ZodType<PaginationType & { status?: Status }>;

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
