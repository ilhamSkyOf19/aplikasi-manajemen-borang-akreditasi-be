import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import { ResponseFileDokumenForChooseWithMetaType } from "../models/fileDokumen.model";
import {
  ResponseFileDokumenDefaultForDetailType,
  ResponseUpdateFileDefaultType,
  UpdateFileDefaultType,
} from "../models/fileDokumenDefault.model";
import { PaginationType } from "../types/pagination";
import {
  SortOrder,
  Status,
  StorageProvider,
  TipeDokumentasi,
} from "../utils/contstanst";

export class FileDokumenDefaultService {
  // find by id
  static async findByIdForDetail(
    id: number,
  ): Promise<ResponseFileDokumenDefaultForDetailType | null> {
    // call db
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama_file: true,
        storage_provider: true,
        file_id: true,
        uploaded_by: {
          select: {
            id: true,
            nama: true,
            email: true,
            nidn: true,
          },
        },
        dokumentasi_borang_files: {
          select: {
            dokumentasi_borang: {
              select: {
                id: true,
                status: true,
                kebutuhan_dokumentasi: {
                  select: {
                    kriteria: {
                      select: {
                        kode_kriteria: true,
                        nama_kriteria: true,
                      },
                    },
                    pendekatan: {
                      select: {
                        tahap: true,
                        keterangan: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        keterangan: true,
        tipe_file: true,
        created_at: true,
        updated_at: true,
        default_detail: {
          select: {
            nomor_dokumen: true,
          },
        },
      },
    });

    // check
    if (!result) return null;

    return {
      id: result.id,
      dokumentasi_borang_id:
        result.dokumentasi_borang_files[0].dokumentasi_borang.id,
      nama_file: result.nama_file,
      kriteria:
        result.dokumentasi_borang_files[0].dokumentasi_borang
          .kebutuhan_dokumentasi.kriteria,
      pendekatan:
        result.dokumentasi_borang_files[0].dokumentasi_borang
          .kebutuhan_dokumentasi.pendekatan,
      storage_provider: result.storage_provider as StorageProvider,
      file_id: result.file_id,
      uploaded_by: result.uploaded_by,
      keterangan: result.keterangan,
      tipe_file: result.tipe_file as TipeDokumentasi,
      created_at: result.created_at,
      updated_at: result.updated_at,
      dokumentasi_default: result.default_detail?.nomor_dokumen
        ? {
            nomor_dokumentasi: result.default_detail.nomor_dokumen,
          }
        : null,
      status: result.dokumentasi_borang_files[0].dokumentasi_borang
        .status as Status,
    };
  }

  // update file default
  static async updateFileDefault(params: {
    id: number;
    data: UpdateFileDefaultType;
  }): Promise<ResponseUpdateFileDefaultType | null> {
    // get params
    const {
      data: { keterangan, nama_file, nomor_dokumen },
      id,
    } = params;

    // call db
    const result = await prisma.fileDokumen.update({
      where: {
        id,
      },
      data: {
        nama_file,
        keterangan,
        default_detail: {
          update: {
            nomor_dokumen,
          },
        },
      },
      select: {
        id: true,
        nama_file: true,
        keterangan: true,
        default_detail: {
          select: {
            nomor_dokumen: true,
          },
        },
        updated_at: true,
      },
    });

    return {
      id: result.id,
      keterangan: result.keterangan,
      nama_file: result.nama_file,
      updated_at: result.updated_at,
      dokumentasi_default: result.default_detail
        ? {
            nomor_dokumentasi: result.default_detail.nomor_dokumen,
          }
        : null,
    };
  }
}
