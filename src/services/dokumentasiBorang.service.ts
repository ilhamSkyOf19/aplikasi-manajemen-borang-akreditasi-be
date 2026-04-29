import prisma from "../libs/prisma";
import {
  CreateDokumentasiBorangDefaultType,
  IDokumentasiBorangDefault,
  IFolderDokumentasiBorang,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
  ResponseFoldersAndFilesType,
  toResponseCreateUpdateDokumentasiBorangType,
  toResponseDokumentasiBorangType,
  toResponseFoldersAndFilesType,
} from "../models/dokumentasiBorang.model";
import { ResponseResult } from "../types/response";
import { Status, TipeDokumentasi } from "../utils/contstanst";

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
          tipe_dokumentasi: true,
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
              tipe_file:
                kebutuhanDokumentasi.tipe_dokumentasi as TipeDokumentasi,
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

  // find all by kebutuhan dokumentasi id
  static async findAllByKebutuhanDokumentasiId(
    kebutuhan_dokumentasi_id: number,
  ): Promise<ResponseDokumentasiBorangType | null> {
    // call db
    const result = await prisma.dokumentasiBorang.findUnique({
      where: {
        kebutuhan_dokumentasi_id,
      },
      select: {
        id: true,
        kebutuhan_dokumentasi: {
          select: {
            id: true,
            tipe_dokumentasi: true,
          },
        },
        status: true,
        files: {
          select: {
            folder_dokumen: {
              select: {
                id: true,
                nama_folder: true,
              },
            },
            file_dokumen: {
              select: {
                id: true,
                provider_file_id: true,
                nama_file: true,
                keterangan: true,
                uploaded_by: {
                  select: {
                    id: true,
                    nama: true,
                    nidn: true,
                  },
                },
                default_detail: {
                  select: {
                    nomor_dokumen: true,
                  },
                },
                created_at: true,
                updated_at: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // grouped folder and files in folder
    const groupedFilesByFolder = new Map<number, IFolderDokumentasiBorang>();

    // grouped files not have folder
    const groupedFilesDefaultNotHaveFolder = new Map<
      number,
      IDokumentasiBorangDefault
    >();

    switch (result.kebutuhan_dokumentasi.tipe_dokumentasi) {
      case TipeDokumentasi.DEFAULT:
        for (const item of result.files) {
          const fileDokumentasiDefault: IDokumentasiBorangDefault = {
            id: item.file_dokumen.id,
            nama_file: item.file_dokumen.nama_file,
            keterangan: item.file_dokumen.keterangan,
            uploaded_by: item.file_dokumen.uploaded_by,
            nomor_dokumen:
              item.file_dokumen.default_detail?.nomor_dokumen ?? undefined,
            created_at: item.file_dokumen.created_at,
            updated_at: item.file_dokumen.updated_at,
            provider_file_id: item.file_dokumen.provider_file_id ?? undefined,
          };

          // const folder id
          if (!item.folder_dokumen) {
            // set
            groupedFilesDefaultNotHaveFolder.set(
              fileDokumentasiDefault.id,
              fileDokumentasiDefault,
            );

            continue;
          }

          const folderId = item.folder_dokumen.id;

          // check existing folder
          const existingFolder = groupedFilesByFolder.get(folderId);

          // check existing foler
          if (existingFolder) {
            existingFolder.files_dokumentasi_default?.push(
              fileDokumentasiDefault,
            );

            continue;
          }

          // set
          groupedFilesByFolder.set(folderId, {
            id: folderId,
            nama_folder: item.folder_dokumen.nama_folder,
            files_dokumentasi_default: [fileDokumentasiDefault],
          });
        }
        break;
      default:
        throw null;
    }

    // final grouped
    const finalGroupedFilesByFolder = Array.from(groupedFilesByFolder.values());
    const finalGroupedFilesDefaultNotHaveFolder = Array.from(
      groupedFilesDefaultNotHaveFolder.values(),
    );

    return toResponseDokumentasiBorangType({
      id: result.id,
      kebutuhan_dokumentasi: {
        id: result.kebutuhan_dokumentasi.id,
        tipe_dokumentasi: result.kebutuhan_dokumentasi
          .tipe_dokumentasi as TipeDokumentasi,
      },
      status: result.status as Status,
      files_dokumentasi_default: finalGroupedFilesDefaultNotHaveFolder,
      folders: finalGroupedFilesByFolder,
    });
  }

  // find file by folder id and dokumentasi borang id
  static async findFilesByFolderIdAndDokumentasiBorangId(data: {
    folder_id: number;
    dokumentasi_borang_id: number;
  }): Promise<ResponseFoldersAndFilesType | null> {
    // get data
    const { dokumentasi_borang_id, folder_id } = data;

    // call db
    const result = await prisma.dokumentasiBorangFile.findMany({
      where: {
        folder_dokumen_id: folder_id,
        dokumentasi_borang_id: dokumentasi_borang_id,
      },
      select: {
        folder_dokumen: {
          select: {
            id: true,
            nama_folder: true,
          },
        },
        file_dokumen: {
          select: {
            id: true,
            provider_file_id: true,
            nama_file: true,
            keterangan: true,
            uploaded_by: {
              select: {
                id: true,
                nama: true,
                nidn: true,
              },
            },
            default_detail: {
              select: {
                nomor_dokumen: true,
              },
            },
            created_at: true,
            updated_at: true,
            tipe_file: true,
          },
        },
      },
    });

    // grouped files by folder
    const gorupedFilesByFolder = new Map<number, IFolderDokumentasiBorang>();

    for (const item of result) {
      const dataFolder = {
        id: item.folder_dokumen?.id,
        nama_folder: item.folder_dokumen?.nama_folder,
      };

      // check folder
      if (!dataFolder) throw new Error("Folder tidak ada");

      // existing data
      const existingData = gorupedFilesByFolder.get(data.folder_id);

      switch (item.file_dokumen.tipe_file) {
        case TipeDokumentasi.DEFAULT:
          const fileDokumentasiDefault: IDokumentasiBorangDefault = {
            id: item.file_dokumen.id,
            nama_file: item.file_dokumen.nama_file,
            keterangan: item.file_dokumen.keterangan,
            uploaded_by: item.file_dokumen.uploaded_by,
            nomor_dokumen:
              item.file_dokumen.default_detail?.nomor_dokumen ?? undefined,
            created_at: item.file_dokumen.created_at,
            updated_at: item.file_dokumen.updated_at,
            provider_file_id: item.file_dokumen.provider_file_id ?? undefined,
          };

          // check existing data
          if (existingData) {
            existingData.files_dokumentasi_default?.push(
              fileDokumentasiDefault,
            );

            continue;
          }

          gorupedFilesByFolder.set(dataFolder.id!, {
            id: dataFolder.id!,
            nama_folder: dataFolder.nama_folder!,
            files_dokumentasi_default: [fileDokumentasiDefault],
          });
          break;
        default:
          return null;
      }
    }

    // final grouped
    const finalGrouped = Array.from(gorupedFilesByFolder.values())[0];

    return toResponseFoldersAndFilesType(finalGrouped);
  }
}
