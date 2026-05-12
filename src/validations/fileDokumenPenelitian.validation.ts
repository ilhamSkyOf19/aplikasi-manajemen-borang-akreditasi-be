import z from "zod";
import { StorageProvider } from "../utils/contstanst";
import {
  CreateDokumentasiBorangPenelitianRequestType,
  UpdateFilePenelitianType,
} from "../models/fileDokumenPenelitian.model";

export class FileDokumenPenelitianValidation {
  private static readonly optionalString = z.preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }

    return value;
  }, z.string().trim().optional());

  private static readonly optionalNumber = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, z.coerce.number().int().positive().max(2147483647).optional());

  private static readonly optionalStorageProvider = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, z.enum(StorageProvider, "storage provider tidak valid").optional());

  // link schema
  private static readonly linkSchema = z
    .string()
    .trim()
    .min(1)
    .max(200)
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;

        try {
          const url = new URL(value);

          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message: "Link publikasi tidak valid",
      },
    );

  static readonly CREATE_PENELITIAN = z
    .object({
      kebutuhan_dokumentasi_id: z.coerce
        .number()
        .int()
        .positive()
        .max(2147483647),

      dokumentasi_borang_id: this.optionalNumber,

      old_file: this.optionalNumber,

      // ini sebagai nama file baru
      new_file: this.optionalString,

      storage_provider: this.optionalStorageProvider,

      judul_penelitian: this.optionalString,

      tahun: z.number().min(1).max(2500).optional(),

      link_publikasi: this.linkSchema.optional(),

      keterangan: this.optionalString,

      folder: this.optionalNumber,
    })
    .strict()
    .superRefine((data, ctx) => {
      const hasNewFile = data.new_file !== undefined && data.new_file !== null;

      const hasOldFile = data.old_file !== undefined && data.old_file !== null;

      const hasStorageProvider =
        data.storage_provider !== undefined && data.storage_provider !== null;

      const hasJudulPenelitian =
        data.judul_penelitian !== undefined && data.judul_penelitian !== null;

      const hasTahun = data.tahun !== undefined && data.tahun !== null;

      const hasLinkPublikasi =
        data.link_publikasi !== undefined && data.link_publikasi !== null;

      const hasKeterangan =
        data.keterangan !== undefined && data.keterangan !== null;

      // wajib pilih salah satu: file lama atau file baru
      if (!hasOldFile && !hasNewFile) {
        ctx.addIssue({
          code: "custom",
          path: ["new_file"],
          message: "pilih file lama atau upload file baru",
        });
      }

      // jika upload file baru
      if (hasNewFile) {
        if (hasOldFile) {
          ctx.addIssue({
            code: "custom",
            path: ["old_file"],
            message: "jika upload file baru, old file tidak boleh ada",
          });
        }

        if (!hasStorageProvider) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message: "jika upload file baru, storage provider wajib ada",
          });
        }

        if (!hasJudulPenelitian) {
          ctx.addIssue({
            code: "custom",
            path: ["judul_penelitian"],
            message: "jika upload file baru, judul penelitian wajib ada",
          });
        }

        if (!hasTahun) {
          ctx.addIssue({
            code: "custom",
            path: ["tahun"],
            message: "jika upload file baru, tahun penelitian wajib ada",
          });
        }

        if (!hasLinkPublikasi) {
          ctx.addIssue({
            code: "custom",
            path: ["link_publikasi"],
            message: "jika upload file baru, link publikasi wajib ada",
          });
        }

        if (!hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika upload file baru, keterangan wajib ada",
          });
        }
      }

      // jika menggunakan file lama
      if (hasOldFile) {
        if (hasNewFile) {
          ctx.addIssue({
            code: "custom",
            path: ["new_file"],
            message: "jika menggunakan file lama, file baru tidak boleh ada",
          });
        }

        if (hasStorageProvider) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message:
              "jika menggunakan file lama, storage provider tidak boleh ada",
          });
        }

        if (hasJudulPenelitian) {
          ctx.addIssue({
            code: "custom",
            path: ["judul_penelitian"],
            message:
              "jika menggunakan file lama, judul penelitian tidak boleh ada",
          });
        }

        if (hasTahun) {
          ctx.addIssue({
            code: "custom",
            path: ["tahun"],
            message: "jika menggunakan file lama, tahun tidak boleh ada",
          });
        }

        if (hasLinkPublikasi) {
          ctx.addIssue({
            code: "custom",
            path: ["link_publikasi"],
            message:
              "jika menggunakan file lama, link publikasi tidak boleh ada",
          });
        }

        if (hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika menggunakan file lama, keterangan tidak boleh ada",
          });
        }
      }
    }) satisfies z.ZodType<CreateDokumentasiBorangPenelitianRequestType>;

  // update file default
  static readonly UPDATE_PENELITIAN = z
    .object({
      nama_file: z.string().trim().min(1).max(100).optional(),
      keterangan: z.string().trim().min(1).max(1000).optional(),
      judul_penelitian: z.string().trim().min(1).max(100).optional(),
      link_publikasi: this.linkSchema.optional(),
      tahun: z.number().min(0).max(3000).optional(),
    })
    .strict() satisfies z.ZodType<UpdateFilePenelitianType>;
}
