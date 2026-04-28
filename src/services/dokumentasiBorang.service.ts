import prisma from "../libs/prisma";
import { CreateDokumentasiBorangDefaultType } from "../models/dokumentasiBorang.model";
import { CreateKebutuhanDokumentasiPic } from "../models/kebutuhanDokumentasiPic.model";

export class DokumentasiBorangServices {
  // create
  static async createDefault(
    data: CreateDokumentasiBorangDefaultType,
  ): Promise<any | null> {
    // get data
    const {
      keterangan,
      kebutuhan_dokumentasi_pic_id,
      files,
      uploaded_by_id,
      new_folder,
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
      if (!kebutuhanDokumentasi) return null;

      //   create dokumentasi
      const dokumentasiBorang = await tx.dokumentasiBorang.create({
        data: {
          kebutuhan_dokumentasi_id: kebutuhanDokumentasi.id,
          keterangan,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_id: true,
        },
      });

      // check
      if (!dokumentasiBorang) return null;

      // create folder
      let folder: { id: number; nama_folder: string } | null = null;
      // check folder
      if (new_folder) {
        folder = await tx.folderDokumen.create({
          data: {
            dokumentasi_borang_id: kebutuhanDokumentasi.id,
            nama_folder: new_folder,
          },
          select: {
            id: true,
            nama_folder: true,
          },
        });
      }

      //   create file many
      const resultFiles = [];

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
          if (!existingFile) return null;

          // push
          fileDokumenId = existingFile.id;
        } else {
          const newFile = await tx.fileDokumen.create({
            data: {
              nama_file: file.nama_file!,
              storage_provider: file.storage_provider!,
              provider_file_id: file.provider_id!,
              uploaded_by_id: uploaded_by_id,
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
            folder_dokumen_id: folder?.id ?? null,
            keterangan: keterangan,
          },
          select: {
            id: true,
            dokumentasi_borang_id: true,
            file_dokumen_id: true,
            folder_dokumen_id: true,
            keterangan: true,
            status: true,
          },
        });

        resultFiles.push(pivot);
      }

      return resultFiles;
    });

    return result;
  }
}
