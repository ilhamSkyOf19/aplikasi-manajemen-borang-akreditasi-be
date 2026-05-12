import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  IFolderDokumentasiBorang,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
  ResponseDokumentasiBorangWithKebutuhanDokumentasiType,
  ResponseFoldersAndFilesType,
  toResponseCreateUpdateDokumentasiBorangType,
  toResponseDokumentasiBorangType,
  toResponseFoldersAndFilesType,
} from "../models/dokumentasiBorang.model";
import {
  CreateDokumentasiBorangDefaultType,
  IDokumentasiBorangDefault,
} from "../models/fileDokumenDefault.model";
import { CreateDokumentasiBorangPenelitianType } from "../models/fileDokumenPenelitian.model";
import { ResponseResult } from "../types/response";
import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { FileService } from "./file.service";
import { FileDokumenService } from "./fileDokumen.service";

export class DokumentasiBorangServices {
  // create
  static async createDefault(
    data: CreateDokumentasiBorangDefaultType,
  ): Promise<ResponseCreateUpdateDokumentasiBorangType | null> {
    // get data
    const {
      kebutuhan_dokumentasi_id,
      uploaded_by_id,
      dokumentasi_borang_id,
      folder,
      old_file,
      file,
    } = data;

    // transaction
    const result = await prisma.$transaction(async (tx) => {
      // dokumentasi borang id
      let dokumentasiBorangId: number | null = dokumentasi_borang_id ?? null;

      // check
      if (!dokumentasi_borang_id) {
        //   create dokumentasi
        const dokumentasiBorang = await tx.dokumentasiBorang.create({
          data: {
            kebutuhan_dokumentasi_id,
          },
          select: {
            id: true,
            kebutuhan_dokumentasi_id: true,
            status: true,
          },
        });

        dokumentasiBorangId = dokumentasiBorang.id;
      }

      // check
      if (!dokumentasiBorangId) throw new Error("Dokumentasi borang tidak ada");

      // file id
      let fileId: number | null = old_file ?? null;

      // check file
      if (file) {
        // create file
        const newFile = await tx.fileDokumen.create({
          data: {
            nama_file: file.nama_file,
            storage_provider: file.storage_provider,
            file_id: file.file_id,
            uploaded_by_id: uploaded_by_id,
            keterangan: file.keterangan!,
            tipe_file: file.tipe_dokumentasi,
            default_detail: {
              create: {
                nomor_dokumen: file.nomor_dokumen,
              },
            },
          },
          select: {
            id: true,
          },
        });

        fileId = newFile.id;
      }

      // check file id
      if (!fileId) throw new Error("File tidak ada");

      // create pivot table
      const pivot = await tx.dokumentasiBorangFile.create({
        data: {
          dokumentasi_borang_id: dokumentasiBorangId,
          file_dokumen_id: fileId,
          folder_dokumen_id: folder,
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

      return pivot;
    });

    // check result
    if (!result) return null;

    return toResponseCreateUpdateDokumentasiBorangType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang_id,
      file_dokumen_id: result.file_dokumen_id,
      folder_dokumen_id: result.folder_dokumen_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // create
  static async createPenelitian(
    data: CreateDokumentasiBorangPenelitianType,
  ): Promise<ResponseCreateUpdateDokumentasiBorangType | null> {
    // get data
    const {
      kebutuhan_dokumentasi_id,
      uploaded_by_id,
      dokumentasi_borang_id,
      folder,
      old_file,
      file,
    } = data;

    // transaction
    const result = await prisma.$transaction(async (tx) => {
      // dokumentasi borang id
      let dokumentasiBorangId: number | null = dokumentasi_borang_id ?? null;

      // check
      if (!dokumentasi_borang_id) {
        //   create dokumentasi
        const dokumentasiBorang = await tx.dokumentasiBorang.create({
          data: {
            kebutuhan_dokumentasi_id,
          },
          select: {
            id: true,
            kebutuhan_dokumentasi_id: true,
            status: true,
          },
        });

        dokumentasiBorangId = dokumentasiBorang.id;
      }

      // check
      if (!dokumentasiBorangId) throw new Error("Dokumentasi borang tidak ada");

      // file id
      let fileId: number | null = old_file ?? null;

      // check file
      if (file) {
        // create file
        const newFile = await tx.fileDokumen.create({
          data: {
            nama_file: file.nama_file,
            storage_provider: file.storage_provider,
            file_id: file.file_id,
            uploaded_by_id: uploaded_by_id,
            keterangan: file.keterangan!,
            tipe_file: file.tipe_dokumentasi,
            penelitian_detail: {
              create: {
                judul_penelitian: file.judul_penelitian,
                tahun: file.tahun,
                link_publikasi: file.link_publikasi,
              },
            },
          },
          select: {
            id: true,
          },
        });

        fileId = newFile.id;
      }

      // check file id
      if (!fileId) throw new Error("File tidak ada");

      // create pivot table
      const pivot = await tx.dokumentasiBorangFile.create({
        data: {
          dokumentasi_borang_id: dokumentasiBorangId,
          file_dokumen_id: fileId,
          folder_dokumen_id: folder,
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

      return pivot;
    });

    // check result
    if (!result) return null;

    return toResponseCreateUpdateDokumentasiBorangType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang_id,
      file_dokumen_id: result.file_dokumen_id,
      folder_dokumen_id: result.folder_dokumen_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find by id with kebutuhan dokumentasi
  static async findByKebutuhanDokumentasiId(params: {
    kebutuhan_dokumentasi_id: number;
  }): Promise<ResponseDokumentasiBorangWithKebutuhanDokumentasiType | null> {
    // get params
    const { kebutuhan_dokumentasi_id } = params;

    // call db
    const result = await prisma.kebutuhanDokumentasi.findUnique({
      where: {
        id: kebutuhan_dokumentasi_id,
      },
      select: {
        id: true,
        keterangan: true,
        nama_kebutuhan_dokumentasi: {
          select: {
            id: true,
            nama_kebutuhan_dokumentasi: true,
          },
        },
        kebutuhan_dokumentasi_pic: {
          select: {
            pic: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        kriteria: {
          select: {
            id: true,
            kode_kriteria: true,
            nama_kriteria: true,
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
        tipe_dokumentasi: true,
        dokumentasi_borang: {
          select: {
            id: true,
            status: true,
            folders: {
              select: {
                id: true,
                nama_folder: true,
              },
            },
            files: {
              select: {
                dokumentasi_borang_id: true,
                file_dokumen: {
                  select: {
                    id: true,
                    nama_file: true,
                  },
                },
                folder_dokumen: {
                  select: {
                    id: true,
                    nama_folder: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) return null;

    // grouped folders
    const groupedFolders = new Map<
      number,
      {
        id: number;
        nama_folder: string;
        files: {
          id: number;
          nama_file: string;
          dokumentasi_borang_id: number;
        }[];
      }
    >();

    // grouped files not have folder
    const groupedFiles = new Map<
      number,
      {
        id: number;
        nama_file: string;
        dokumentasi_borang_id: number;
      }
    >();

    if (result.dokumentasi_borang) {
      // grouped folders

      for (const item of result.dokumentasi_borang.folders) {
        groupedFolders.set(item.id, {
          id: item.id,
          nama_folder: item.nama_folder,
          files: [],
        });
      }

      for (const item of result.dokumentasi_borang.files) {
        // check folder
        if (!item.folder_dokumen) {
          groupedFiles.set(item.file_dokumen.id, {
            id: item.file_dokumen.id,
            nama_file: item.file_dokumen.nama_file,
            dokumentasi_borang_id: item.dokumentasi_borang_id,
          });

          continue;
        }

        // folder id
        const folderId = item.folder_dokumen.id;

        // existing folder
        const existingFolder = groupedFolders.get(folderId);

        // file
        const file = {
          id: item.file_dokumen.id,
          nama_file: item.file_dokumen.nama_file,
          dokumentasi_borang_id: item.dokumentasi_borang_id,
        };

        // check
        if (existingFolder) {
          existingFolder.files.push(file);

          continue;
        }
      }
    }

    // final grouped
    const finalGroupedFolders = Array.from(groupedFolders.values());

    // final grouped
    const finalGroupedFiles = Array.from(groupedFiles.values());

    return {
      dokumentasi_borang_id: result.dokumentasi_borang?.id || null,
      kebutuhan_dokumentasi_pic: {
        nama_kebutuhan_dokumentasi: {
          id: result.nama_kebutuhan_dokumentasi.id,
          nama: result.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
        },
        kriteria: {
          kriteria: result.kriteria,
        },
        pendekatan: result.pendekatan,
        keterangan: result.keterangan,
        tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
        pic: result.kebutuhan_dokumentasi_pic.map((item) => ({
          id: item.pic.id,
          nama: item.pic.nama,
        })),
      },
      folders: finalGroupedFolders,
      files: finalGroupedFiles,
      status: result.dokumentasi_borang?.status
        ? (result.dokumentasi_borang.status as Status)
        : null,
    };
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
        status: true,
        kebutuhan_dokumentasi: {
          select: {
            id: true,
            tipe_dokumentasi: true,
          },
        },
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
                file_id: true,
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
            file_id: item.file_dokumen.file_id,
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

  // // find file by folder id and dokumentasi borang id
  // static async findFilesByFolderIdAndDokumentasiBorangId(data: {
  //   folder_id: number;
  //   dokumentasi_borang_id: number;
  // }): Promise<ResponseFoldersAndFilesType | null> {
  //   // get data
  //   const { dokumentasi_borang_id, folder_id } = data;

  //   // call db
  //   const result = await prisma.dokumentasiBorangFile.findMany({
  //     where: {
  //       folder_dokumen_id: folder_id,
  //       dokumentasi_borang_id: dokumentasi_borang_id,
  //     },
  //     select: {
  //       folder_dokumen: {
  //         select: {
  //           id: true,
  //           nama_folder: true,
  //         },
  //       },
  //       file_dokumen: {
  //         select: {
  //           id: true,
  //           file_id: true,
  //           nama_file: true,
  //           keterangan: true,
  //           uploaded_by: {
  //             select: {
  //               id: true,
  //               nama: true,
  //               nidn: true,
  //             },
  //           },
  //           default_detail: {
  //             select: {
  //               nomor_dokumen: true,
  //             },
  //           },
  //           created_at: true,
  //           updated_at: true,
  //           tipe_file: true,
  //         },
  //       },
  //     },
  //   });

  //   // grouped files by folder
  //   const gorupedFilesByFolder = new Map<number, IFolderDokumentasiBorang>();

  //   for (const item of result) {
  //     const dataFolder = {
  //       id: item.folder_dokumen?.id,
  //       nama_folder: item.folder_dokumen?.nama_folder,
  //     };

  //     // check folder
  //     if (!dataFolder) throw new Error("Folder tidak ada");

  //     // existing data
  //     const existingData = gorupedFilesByFolder.get(data.folder_id);

  //     switch (item.file_dokumen.tipe_file) {
  //       case TipeDokumentasi.DEFAULT:
  //         const fileDokumentasiDefault: IDokumentasiBorangDefault = {
  //           id: item.file_dokumen.id,
  //           nama_file: item.file_dokumen.nama_file,
  //           keterangan: item.file_dokumen.keterangan,
  //           uploaded_by: item.file_dokumen.uploaded_by,
  //           nomor_dokumen:
  //             item.file_dokumen.default_detail?.nomor_dokumen ?? undefined,
  //           created_at: item.file_dokumen.created_at,
  //           updated_at: item.file_dokumen.updated_at,
  //           file_id: item.file_dokumen.file_id ?? undefined,
  //         };

  //         // check existing data
  //         if (existingData) {
  //           existingData.files_dokumentasi_default?.push(
  //             fileDokumentasiDefault,
  //           );

  //           continue;
  //         }

  //         gorupedFilesByFolder.set(dataFolder.id!, {
  //           id: dataFolder.id!,
  //           nama_folder: dataFolder.nama_folder!,
  //           files_dokumentasi_default: [fileDokumentasiDefault],
  //         });
  //         break;
  //       default:
  //         return null;
  //     }
  //   }

  //   // final grouped
  //   const finalGrouped = Array.from(gorupedFilesByFolder.values())[0];

  //   return toResponseFoldersAndFilesType(finalGrouped);
  // }

  // find dokumentasi borang for get id, status, tipe dokumentasi
  static async findDokumentasiBorangGetIdStatusTipeDokumentasi(
    dokumentasi_borang_id: number,
  ): Promise<{
    id: number;
    status: Status;
    tipe_dokumentasi: TipeDokumentasi;
  } | null> {
    // call db
    const result = await prisma.dokumentasiBorang.findUnique({
      where: {
        id: dokumentasi_borang_id,
      },
      select: {
        id: true,
        status: true,
        kebutuhan_dokumentasi: {
          select: {
            tipe_dokumentasi: true,
          },
        },
      },
    });

    // check
    if (!result) return null;
    return {
      id: result.id,
      status: result.status as Status,
      tipe_dokumentasi: result.kebutuhan_dokumentasi
        .tipe_dokumentasi as TipeDokumentasi,
    };
  }

  // find pivot dokumentasi and file id
  static async findPivotByDokumentasiBorangAndFileId(data: {
    dokumentasi_borang_id: number;
    file_id: number;
  }): Promise<number> {
    //  get data
    const { dokumentasi_borang_id, file_id } = data;

    // cal db
    const result = await prisma.dokumentasiBorangFile.findUnique({
      where: {
        dokumentasi_borang_id_file_dokumen_id: {
          dokumentasi_borang_id,
          file_dokumen_id: file_id,
        },
      },
    });

    return result ? 1 : 0;
  }

  // temukan dokumentasi yang memiliki file tertentu dan memiliki status approved
  static async findDokumentasiByFileDokumenIdAndStatusApprovedOrPending(
    file_dokumen_id: number,
  ): Promise<{ dokumentasi_borang_id: number }[] | null> {
    // call db
    const result = await prisma.dokumentasiBorangFile.findMany({
      where: {
        file_dokumen_id: file_dokumen_id,
        dokumentasi_borang: {
          status: Status.APPROVED || Status.PENDING,
        },
      },
      select: {
        dokumentasi_borang_id: true,
      },
    });

    if (!result) return null;

    return result.map((item) => ({
      dokumentasi_borang_id: item.dokumentasi_borang_id,
    }));
  }
}
