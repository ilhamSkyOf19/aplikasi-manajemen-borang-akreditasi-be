import z from "zod";
import {
  CreateDokumentasiBorangDefaultRequestType,
  FilesRequest,
} from "../models/dokumentasiBorang.model";
import { StorageProvider } from "../utils/contstanst";

export class DokumentasiBorangValidation {
  static readonly FILE_REQUEST_SCHEMA = z
    .object({
      old_file: z.number().int().positive().max(2147483647).optional(),
      storage_provider: z
        .enum(
          ["GDRIVE", "SISTEM"] as StorageProvider[],
          "storage provider tidak falid",
        )
        .optional(),
      nama_file: z.string().optional(),
      keterangan: z.string().min(1).max(1000).optional(),
    })
    .superRefine((data, ctx) => {
      const hasOldFile = data.old_file !== undefined && data.old_file !== null;
      const hasNewFile =
        data.nama_file !== undefined && data.nama_file !== null;

      // jika pakai old file , maka nama file dan storage provider tidak boleh di isi
      if (hasOldFile) {
        if (hasNewFile) {
          ctx.addIssue({
            code: "custom",
            path: ["nama_file"],
            message:
              "jika old file ada maka nama file dan storage provider tidak boleh diisi",
          });
        }

        if (data.storage_provider !== undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message:
              "jika old file ada maka nama file dan storage provider tidak boleh diisi",
          });
        }
      }

      // jika upload file baru, storage provider wajib ada dan old file tidak boleh ada
      if (hasNewFile) {
        if (!data.storage_provider) {
          ctx.addIssue({
            code: "custom",
            path: ["storage_provider"],
            message: "jika upload file baru, storage provider wajib ada",
          });
        }

        if (hasOldFile) {
          ctx.addIssue({
            code: "custom",
            path: ["old_file"],
            message: "jika upload file baru, old file tidak boleh ada",
          });
        }
      }

      // wajib memilih salah satu old file atau file new
      if (!hasOldFile && !hasNewFile) {
        ctx.addIssue({
          code: "custom",
          path: ["old_file"],
          message: "old file atau nama file wajib di isi salah satu",
        });
      }
    });

  // create
  static readonly CREATE_DEFAULT = z
    .object({
      kebutuhan_dokumentasi_pic_id: z.number().int().positive().max(2147483647),
      keterangan: z.string().min(1).max(1000),
      new_folder: z.string().optional(),
      files: z.array(this.FILE_REQUEST_SCHEMA).min(1).max(4),
    })
    .strict() satisfies z.ZodType<
    Omit<CreateDokumentasiBorangDefaultRequestType, "files"> & {
      files: FilesRequest[];
    }
  >;
}
