import prisma from "../libs/prisma";
import {
  CreateDokumentasiBorangDefaultType,
  ResponseCreateUpdateDokumentasiBorangType,
  toResponseCreateUpdateDokumentasiBorangType,
} from "../models/dokumentasiBorang.model";
import { ResponseResult } from "../types/response";
import { Status } from "../utils/contstanst";

export class DokumentasiBorangServices {
  // create
  static async createDefault(
    data: CreateDokumentasiBorangDefaultType,
  ): Promise<ResponseCreateUpdateDokumentasiBorangType | null> {
    // get data
    const {
      kebutuhan_dokumentasi_pic_id,
      files,
      uploaded_by_id,
      new_folder,
      old_folder,
    } = data;

    // transaction
    const result = await prisma.$transaction(async (tx) => {
      // find kebutuhan dokumentasi by id
      const kebutuhanDokumentasi = await tx.kebutuhanDokumentasi.findUnique({
        where: {
          id: kebutuhan_dokumentasi_pic_id,
        },
        select: {
          id: true,
        },
      });

      // check
      if (!kebutuhanDokumentasi)
        throw new Error("Kebutuhan dokumentasi tidak ada");

      //   create dokumentasi
      const dokumentasiBorang = await tx.dokumentasiBorang.upsert({
        where: {
          kebutuhan_dokumentasi_id: kebutuhanDokumentasi.id,
        },
        update: {},
        create: {
          kebutuhan_dokumentasi_id: kebutuhanDokumentasi.id,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_id: true,
          status: true,
        },
      });

      // check
      if (!dokumentasiBorang) throw new Error("Dokumentasi borang tidak ada");

      // create folder
      let folder: { id: number } | null = null;
      // check folder
      if (new_folder) {
        folder = await tx.folderDokumen.create({
          data: {
            dokumentasi_borang_id: dokumentasiBorang.id,
            nama_folder: new_folder,
          },
          select: {
            id: true,
          },
        });
      }

      // check
      if (old_folder)
        // push
        folder = {
          id: old_folder,
        };

      //   create file many
      const resultFiles: (Omit<
        ResponseCreateUpdateDokumentasiBorangType,
        "file_dokumen_id"
      > & { file_dokumen_id: number })[] = [];

      for (const file of files) {
        // file dokumen id
        let fileDokumenId: number;

        // check
        if (file.old_file) {
          // check
          const existingFile = await tx.fileDokumen.findUnique({
            where: {
              id: file.old_file,
            },
            select: {
              id: true,
            },
          });

          // check
          if (!existingFile) throw new Error("File tidak ada");

          // push
          fileDokumenId = existingFile.id;
        } else {
          const newFile = await tx.fileDokumen.create({
            data: {
              nama_file: file.nama_file!,
              storage_provider: file.storage_provider!,
              provider_file_id: file.provider_id!,
              uploaded_by_id: uploaded_by_id,
              keterangan: file.keterangan!,
              default_detail: {
                create: {},
              },
            },
            select: {
              id: true,
            },
          });

          // push
          fileDokumenId = newFile.id;
        }

        // create pivot table
        const pivot = await tx.dokumentasiBorangFile.create({
          data: {
            dokumentasi_borang_id: dokumentasiBorang.id,
            file_dokumen_id: fileDokumenId,
            folder_dokumen_id: new_folder
              ? folder?.id
              : old_folder
                ? old_folder
                : null,
          },
          select: {
            id: true,
            dokumentasi_borang_id: true,
            file_dokumen_id: true,
            folder_dokumen_id: true,
            created_at: true,
            updated_at: true,
          },
        });

        resultFiles.push({
          id: pivot.id,
          dokumentasi_borang_id: pivot.dokumentasi_borang_id,
          file_dokumen_id: fileDokumenId,
          folder_dokumen_id: pivot.folder_dokumen_id ?? 0,
          status: dokumentasiBorang.status as Status,
          created_at: pivot.created_at,
          updated_at: pivot.updated_at,
        });
      }

      return resultFiles;
    });

    // check result
    if (!result) return null;

    // grouped
    const groupedResult = new Map<
      number,
      ResponseCreateUpdateDokumentasiBorangType
    >();

    for (const item of result) {
      const kebutuhanDokumentasiId = item.dokumentasi_borang_id;

      // existing data
      const existingData = groupedResult.get(kebutuhanDokumentasiId);

      // file dokumen id
      const fileDokumenId = item.file_dokumen_id;

      // check existing data
      if (existingData) {
        // check file dokumen id and push
        existingData.file_dokumen_id.push(fileDokumenId);

        continue;
      }

      groupedResult.set(kebutuhanDokumentasiId, {
        ...item,
        file_dokumen_id: [fileDokumenId],
      });
    }

    // final grouped
    const finalGroupedResult = Array.from(groupedResult.values())[0];

    return toResponseCreateUpdateDokumentasiBorangType(finalGroupedResult);
  }
}
