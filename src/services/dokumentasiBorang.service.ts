import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  CreateDokumentasiBorangDefaultType,
  IDokumentasiBorangDefault,
  IFolderDokumentasiBorang,
  ResponseCreateUpdateDokumentasiBorangType,
  ResponseDokumentasiBorangType,
  ResponseDokumentasiBorangWithKebutuhanDokumentasiType,
  ResponseFoldersAndFilesType,
  toResponseCreateUpdateDokumentasiBorangType,
  toResponseDokumentasiBorangType,
  toResponseFoldersAndFilesType,
  UpdateDokumentasiBorangDefaultType,
} from "../models/dokumentasiBorang.model";
import { ResponseResult } from "../types/response";
import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { FileService } from "./file.service";
import { FileDokumenService } from "./fileDokumen.service";

export class DokumentasiBorangServices {
  // create folder
  private static async createFolder(data: {
    new_folder?: string;
    old_folder?: number;
    tx: Prisma.TransactionClient;
    dokumentasi_borang_id: number;
  }): Promise<{ id: number } | null> {
    // get data
    const { new_folder, old_folder, tx, dokumentasi_borang_id } = data;
    // create folder
    let folder: { id: number } | null = null;

    // check folder
    if (new_folder) {
      folder = await tx.folderDokumen.create({
        data: {
          dokumentasi_borang_id,
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

    return folder;
  }

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
        }[];
      }
    >();

    // grouped files not have folder
    const groupedFiles = new Map<
      number,
      {
        id: number;
        nama_file: string;
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
            file_id: item.file_dokumen.file_id ?? undefined,
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

  // update

  // perbaiki !!
  static async updateDefault(
    data: UpdateDokumentasiBorangDefaultType,
  ): Promise<ResponseCreateUpdateDokumentasiBorangType | null> {
    // get data
    const {
      dokumentasi_borang_id,
      file_id,
      file,
      uploaded_by_id,
      new_folder,
      old_folder,
      default_detail,
    } = data;

    // temukan file
    const findFileDokumen = await FileDokumenService.findById(file_id);

    if (!findFileDokumen) throw new Error("file dokumen tidak ada");

    // transaction
    const result = await prisma.$transaction(async (tx) => {
      let fileToDeleteAfterTransaction: {
        id: number;
        nama_file: string;
        storage_provider: StorageProvider;
        file_id?: string;
      } | null = null;

      // find dokumentasi borang by id
      const dokumentasiBorang = await tx.dokumentasiBorang.findUnique({
        where: {
          id: dokumentasi_borang_id,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi: {
            select: {
              tipe_dokumentasi: true,
            },
          },
          status: true,
        },
      });

      // check
      if (!dokumentasiBorang)
        throw new Error("dokumentasi borang tidak ditemukan");

      // create folder
      const folder = await this.createFolder({
        tx,
        dokumentasi_borang_id: dokumentasiBorang.id,
        new_folder,
        old_folder,
      });

      //   create file many
      let resultFiles:
        | (Omit<
            ResponseCreateUpdateDokumentasiBorangType,
            "file_dokumen_id"
          > & { file_dokumen_id: number })
        | null = null;

      // file dokumen id
      let fileDokumenId: number = file_id;

      // check file
      if (file) {
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
              file_id: file.provider_id!,
              uploaded_by_id: uploaded_by_id,
              keterangan: file.keterangan!,
              tipe_file: dokumentasiBorang.kebutuhan_dokumentasi
                .tipe_dokumentasi as TipeDokumentasi,
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

          // push
          fileDokumenId = newFile.id;

          // check file
          if (
            findFileDokumen.is_active === false &&
            findFileDokumen.uploaded_by_id === uploaded_by_id
          ) {
            // set
            fileToDeleteAfterTransaction = {
              id: findFileDokumen.id,
              nama_file: findFileDokumen.nama_file,
              storage_provider:
                findFileDokumen.storage_provider as StorageProvider,
              file_id: findFileDokumen.file_id ?? undefined,
            };
          }
        }
      }

      if (!file && default_detail) {
        await tx.fileDokumen.update({
          where: {
            id: file_id,
          },
          data: {
            default_detail: {
              upsert: {
                create: {
                  nomor_dokumen: default_detail?.nomor_dokumen,
                },
                update: {
                  nomor_dokumen: default_detail?.nomor_dokumen,
                },
              },
            },
          },
        });
      }

      // pivot update
      const pivotUpdate = await tx.dokumentasiBorangFile.update({
        where: {
          dokumentasi_borang_id_file_dokumen_id: {
            dokumentasi_borang_id: dokumentasiBorang.id,
            file_dokumen_id: file_id,
          },
        },
        data: {
          file_dokumen_id: fileDokumenId,
          folder_dokumen_id: folder?.id ?? null,
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

      // delete file if existing file
      if (file) {
        // delete file dokumen
        const deleteFileDokumen = await tx.fileDokumen.delete({
          where: {
            id: file_id,
          },
        });

        // check
        if (!deleteFileDokumen) throw new Error("Gagal menghapus file dokumen");
      }

      resultFiles = {
        id: pivotUpdate.id,
        dokumentasi_borang_id: pivotUpdate.dokumentasi_borang_id,
        file_dokumen_id: fileDokumenId,
        folder_dokumen_id: pivotUpdate.folder_dokumen_id ?? 0,
        status: dokumentasiBorang.status as Status,
        created_at: pivotUpdate.created_at,
        updated_at: pivotUpdate.updated_at,
      };

      return { resultFiles, fileToDeleteAfterTransaction };
    });

    console.log(
      "result storage provider",
      result.fileToDeleteAfterTransaction?.storage_provider,
    );
    console.log("result", result.fileToDeleteAfterTransaction?.file_id);

    if (result.fileToDeleteAfterTransaction) {
      if (
        result.fileToDeleteAfterTransaction.storage_provider ===
        StorageProvider.SISTEM
      ) {
        const deleteFile = await FileService.deleteFormPath(
          result.fileToDeleteAfterTransaction.nama_file,
        );

        if (!deleteFile.success)
          throw new Error(
            `Gagal menghapus file ${findFileDokumen.nama_file} dalam sistem`,
          );
      }

      if (
        result.fileToDeleteAfterTransaction.storage_provider ===
          StorageProvider.GDRIVE &&
        result.fileToDeleteAfterTransaction.file_id
      ) {
        const deleteFile = await FileService.deleteFileFormGDrive(
          result.fileToDeleteAfterTransaction.file_id,
        );

        console.log("delete file gdrive", deleteFile);

        if (!deleteFile.success)
          throw new Error(
            `Gagal menghapus file ${findFileDokumen.nama_file} dalam sistem`,
          );
      }
    }

    // check result
    if (!result) return null;

    // grouped
    const groupedResult = new Map<
      number,
      ResponseCreateUpdateDokumentasiBorangType
    >();

    const kebutuhanDokumentasiId = result.resultFiles.dokumentasi_borang_id;

    // existing data
    const existingData = groupedResult.get(kebutuhanDokumentasiId);

    // file dokumen id
    const fileDokumenId = result.resultFiles.file_dokumen_id;

    // check existing data
    if (existingData) {
      // check file dokumen id and push
      existingData.file_dokumen_id.push(fileDokumenId);
    }

    groupedResult.set(kebutuhanDokumentasiId, {
      ...result.resultFiles,
      file_dokumen_id: [fileDokumenId],
    });

    // final grouped
    const finalGroupedResult = Array.from(groupedResult.values())[0];

    return toResponseCreateUpdateDokumentasiBorangType(finalGroupedResult);
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
}
