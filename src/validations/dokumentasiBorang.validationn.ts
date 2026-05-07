import z from "zod";
import {
  CreateDokumentasiBorangDefaultRequestType,
  FilesRequest,
  IFolderDokumentasiBorang,
  UpdateDokumentasiBorangDefaultRequestType,
} from "../models/dokumentasiBorang.model";
import { StorageProvider } from "../utils/contstanst";

export class DokumentasiBorangValidation {
  static readonly FILE_REQUEST_SCHEMA = z
    .object({
      old_file: z.number().int().positive().max(2147483647).optional(),
      storage_provider: z
        .enum(StorageProvider, "storage provider tidak falid")
        .optional(),
      nama_file: z.string().max(100).optional(),
      keterangan: z.string().min(1).max(1000).optional(),
      nomor_dokumen: z.string().min(1).max(100).optional(),
    })
    .superRefine((data, ctx) => {
      const hasOldFile = data.old_file !== undefined && data.old_file !== null;
      const hasNewFile =
        data.nama_file !== undefined && data.nama_file !== null;
      const hasKeterangan =
        data.keterangan !== undefined && data.keterangan !== null;
      const hasNomorDokumen =
        data.nomor_dokumen !== undefined && data.nomor_dokumen !== null;

      // jika pakai old file , maka nama file dan storage provider tidak boleh di isi
      if (hasOldFile) {
        // nomor dokumen
        if (hasNomorDokumen) {
          ctx.addIssue({
            code: "custom",
            path: ["nomor_dokumen"],
            message: "jika old file ada maka nomor dokumen tidak boleh diisi",
          });
        }

        // keterangan
        if (hasKeterangan) {
          ctx.addIssue({
            code: "custom",
            path: ["keterangan"],
            message: "jika old file ada maka keterangan tidak boleh diisi",
          });
        }

        // new file
        if (hasNewFile) {
          ctx.addIssue({
            code: "custom",
            path: ["nama_file"],
            message:
              "jika old file ada maka nama file dan storage provider tidak boleh diisi",
          });
        }

        // data storage
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
    })
    .strict() satisfies z.ZodType<FilesRequest>;

  // create
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

      // has folder
      const hasFolder = data.folder !== undefined && data.folder !== null;

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

        // check has folder
        if (hasFolder) {
          ctx.addIssue({
            code: "custom",
            path: ["folder"],
            message: "jika old file ada maka folder tidak boleh ada",
          });
        }
      }
    }) satisfies z.ZodType<CreateDokumentasiBorangDefaultRequestType>;

  // update
  static readonly UPDATE_DEFAULT = z
    .object({
      nomor_dokumen: z.string().trim().optional(),
      new_file: z.string().trim().optional(),
      old_file: z.number().int().positive().max(2147483647).optional(),
      file: this.FILE_REQUEST_SCHEMA.optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
      // check new folder and old folder
      const hasNewFolder =
        data.new_file !== undefined && data.new_file !== null;
      const hasOldFolder =
        data.old_file !== undefined && data.old_file !== null;

      // jika new folder ada maka old folder tidak boleh ada
      if (hasNewFolder) {
        if (hasOldFolder) {
          ctx.addIssue({
            code: "custom",
            path: ["old_file"],
            message: "jika new folder ada maka old folder tidak boleh ada",
          });
        }
      }

      // jika old folder ada maka new folder tidak boleh ada
      if (hasOldFolder) {
        if (hasNewFolder) {
          ctx.addIssue({
            code: "custom",
            path: ["new_file"],
            message: "jika old folder ada maka new folder tidak boleh ada",
          });
        }
      }
    }) satisfies z.ZodType<
    Omit<UpdateDokumentasiBorangDefaultRequestType, "file"> & {
      file?: FilesRequest;
    }
  >;

  // params kebutuhan dokumentasi by id
  static readonly PARAMS_KEBUTUHAN_DOKUMENTASI_ID = z
    .object({
      kebutuhan_dokumentasi_id: z.coerce
        .number()
        .int()
        .positive()
        .max(2147483647),
    })
    .strict() satisfies z.ZodType<{ kebutuhan_dokumentasi_id: number }>;

  // params dokumentasi borang id and folder id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID_AND_FOLDER_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
      folder_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    folder_id: number;
    dokumentasi_borang_id: number;
  }>;

  // params dokumentasi borang id and folder id
  static readonly PARAMS_DOKUMENTASI_BORANG_ID_AND_FILE_ID = z
    .object({
      dokumentasi_borang_id: z.coerce.number().int().positive().max(2147483647),
      file_id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{
    file_id: number;
    dokumentasi_borang_id: number;
  }>;
}
