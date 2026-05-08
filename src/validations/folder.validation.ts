import z from "zod";
import { CreateFolderType, UpdateNameFolderType } from "../models/folder.model";

export class FolderValidation {
  // create
  static readonly CREATE = z
    .object({
      dokumentasi_borang_id: z
        .number()
        .int()
        .positive()
        .max(2147483647)
        .optional(),
      kebutuhan_dokumentasi_id: z.number().int().positive().max(2147483647),
      nama_folder: z.array(z.string().trim().min(1).max(100)).nonempty(),
    })
    .strict() satisfies z.ZodType<CreateFolderType>;

  // update nama
  static readonly UPDATE_NAMA_FOLDER = z
    .object({
      nama_folder: z.string().trim().min(1).max(100),
    })
    .strict() satisfies z.ZodType<UpdateNameFolderType>;

  // update
  static readonly PARAMS_ID = z
    .object({
      id: z.coerce.number().int().positive().max(2147483647),
    })
    .strict() satisfies z.ZodType<{ id: number }>;
}
