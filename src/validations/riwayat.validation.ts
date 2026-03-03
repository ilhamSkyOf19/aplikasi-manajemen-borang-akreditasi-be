// import z from "zod";
// import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";
// import { UpdateRiwayatType } from "../models/riwayat.model";

// export class RiwayatValidation {
//   // string
//   private static stringSchema(
//     field: string,
//     min: number = 1,
//     max: number = 100,
//   ) {
//     return z
//       .string(`${field} harus berupa karakter`)
//       .trim()
//       .min(min, `${field} minimal ${min} karakter`)
//       .max(max, `${field} maksimal ${max} karakter`);
//   }

//   // update
//   static readonly UPDATE = z
//     .object({
//       jenis: z
//         .enum(
//           ["pic", "kebutuhan_dokumen", "dokumen_borang"] as JenisRiwayat[],
//           "Jenis riwayat tidak valid",
//         )
//         .optional(),
//       status: z
//         .enum(
//           ["menunggu", "revisi", "disetujui"] as Status[],
//           "Status tidak valid",
//         )
//         .optional(),
//       keterangan: this.stringSchema("keterangan", 1, 1000),

//     })
//     .strict() satisfies z.ZodType<UpdateRiwayatType>;
// }
