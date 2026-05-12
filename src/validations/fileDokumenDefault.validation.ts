import z from "zod";
import { StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import {
  CreateDokumentasiBorangDefaultRequestType,
  UpdateFileDefaultType,
} from "../models/fileDokumenDefault.model";

export class FileDokumenDefaultValidation {
  static readonly CREATE_DEFAULT = z
    .object({
      kebutuhan_dokumentasi_id: z.number().int().positive().max(2147483647),
      dokumentasi_borang_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      old_file: z.number().int().positive().max(2147483647).optional(),
      new_file: z.string().trim().optional(),
      storage_provider: z
        .enum(StorageProvider, "storage provider tidak falid")
        .optional(),
      nomor_dokumen: z.string().trim().optional(),
      keterangan: z.string().trim().optional(),
      folder: z.number().int().positive().max(2147483647).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      // has new file
      const hasNewFile = data.new_file !== undefined && data.new_file !== null;

      // has old file
      const hasOldFile = data.old_file !== undefined && data.old_file !== null;

      // has storage provider
      const hasStorageProvider =
        data.storage_provider !== undefined && data.storage_provider !== null;

      // has nomor dokumen
      const hasNomorDokumen =
        data.nomor_dokumen !== undefined && data.nomor_dokumen !== null;

      // has keterangan
      const hasKeterangan =
        data.keterangan !== undefined && data.keterangan !== null;

      // check has new file
      if (hasNewFile) {
        if (hasOldFile) {
          ctx.addIssue({
            code: "custom",
            path: ["old_file"],
            message: "jika new folder ada maka old folder tidak boleh ada",
          });
        }

        // check storage provider
        if (!hasStorageProvider) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message: "jika upload file baru, storage provider wajib ada",
          });
        }

        // check keterangan
        if (!hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika upload file baru, keterangan wajib ada",
          });
        }
      }

      // file old file
      if (hasOldFile) {
        if (hasNewFile) {
          ctx.addIssue({
            code: "custom",
            path: ["new_file"],
            message: "jika old file ada maka new folder tidak boleh ada",
          });
        }

        // check storage provider
        if (hasStorageProvider) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message: "jika old file ada maka storage provider tidak boleh ada",
          });
        }

        // check keterangan
        if (hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika old file ada maka keterangan tidak boleh ada",
          });
        }

        // nomor dokumen
        if (hasNomorDokumen) {
          ctx.addIssue({
            code: "custom",
            path: ["nomor_dokumen"],
            message: "jika old file ada maka nomor dokumen tidak boleh ada",
          });
        }
      }
    }) satisfies z.ZodType<CreateDokumentasiBorangDefaultRequestType>;

  // update file default
  static readonly UPDATE_DEFAULT = z
    .object({
      nama_file: z.string().trim().min(1).max(100).optional(),
      keterangan: z.string().trim().min(1).max(1000).optional(),
      nomor_dokumen: z.string().trim().min(1).max(1000).optional(),
    })
    .strict() satisfies z.ZodType<UpdateFileDefaultType>;
}
