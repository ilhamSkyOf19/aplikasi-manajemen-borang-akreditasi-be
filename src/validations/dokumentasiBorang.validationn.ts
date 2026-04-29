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
      const hasKeterangan =
        data.keterangan !== undefined && data.keterangan !== null;

      // jika pakai old file , maka nama file dan storage provider tidak boleh di isi
      if (hasOldFile) {
        if (hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika old file ada maka keterangan tidak boleh diisi",
          });
        }

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
      new_folder: z.string().trim().optional(),
      old_folder: z.number().int().positive().max(2147483647).optional(),
      files: z.array(this.FILE_REQUEST_SCHEMA).min(1).max(4),
    })
    .strict()
    .superRefine((data, ctx) => {
      // check new folder and old folder
      const hasNewFolder =
        data.new_folder !== undefined && data.new_folder !== null;
      const hasOldFolder =
        data.old_folder !== undefined && data.old_folder !== null;

      // jika new folder ada maka old folder tidak boleh ada
      if (hasNewFolder) {
        if (hasOldFolder) {
          ctx.addIssue({
            code: "custom",
            path: ["old_folder"],
            message: "jika new folder ada maka old folder tidak boleh ada",
          });
        }
      }

      // jika old folder ada maka new folder tidak boleh ada
      if (hasOldFolder) {
        if (hasNewFolder) {
          ctx.addIssue({
            code: "custom",
            path: ["new_folder"],
            message: "jika old folder ada maka new folder tidak boleh ada",
          });
        }
      }
    }) satisfies z.ZodType<
    Omit<CreateDokumentasiBorangDefaultRequestType, "files"> & {
      files: FilesRequest[];
    }
  >;

  // params kebutuhan dokumentasi by id
  static readonly PARAMS_KEBUTUHAN_DOKUMENTASI_PIC_ID = z
    .object({
      kebutuhan_dokumentasi_id: z.coerce
        .number()
        .int()
        .positive()
        .max(2147483647),
    })
    .strict() satisfies z.ZodType<{ kebutuhan_dokumentasi_id: number }>;
}
