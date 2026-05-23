import z from "zod";
import {
  CreateDokumenPanduanRequestType,
  UpdateDokumenPanduanRequestType,
} from "../models/dokumenPanduan.model";
import { StorageProvider } from "../utils/contstanst";

export class DokumenPanduanValidation {
  // create
  static readonly CREATE = z
    .object({
      nama_file: z.string().trim().min(1).max(100),
      storage_provider: z.enum(StorageProvider, "storage provider tidak falid"),
    })
    .strict() satisfies z.ZodType<CreateDokumenPanduanRequestType>;

  // update
  static readonly UPDATE = z
    .object({
      nama_file: z.string().trim().min(1).max(100).optional(),
      storage_provider: z
        .enum(StorageProvider, "storage provider tidak falid")
        .optional(),
    })
    .superRefine((data, ctx) => {
      // has nama file
      const hasNamaFile =
        data.nama_file !== undefined && data.nama_file !== null;

      // has storage provider
      const hasStorageProvider =
        data.storage_provider !== undefined && data.storage_provider !== null;

      // check has storage provider
      if (hasStorageProvider && hasNamaFile) {
        ctx.addIssue({
          code: "custom",
          path: ["nama_file"],
          message: "nama_file tidak boleh diisi bersamaan",
        });
        ctx.addIssue({
          code: "custom",
          path: ["storage_provider"],
          message: "nama_file tidak boleh diisi bersamaan",
        });
      }
    })
    .strict() satisfies z.ZodType<UpdateDokumenPanduanRequestType>;
}
