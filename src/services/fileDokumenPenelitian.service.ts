import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import { ResponseFileDokumenForChooseWithMetaType } from "../models/fileDokumen.model";
import {
  ResponseFileDokumenDefaultForDetailType,
  ResponseUpdateFileDefaultType,
  UpdateFileDefaultType,
} from "../models/fileDokumenDefault.model";
import {
  ResponseFileDokumenPenelitianForDetailType,
  ResponseUpdateFilePenelitanType,
  UpdateFilePenelitianType,
} from "../models/fileDokumenPenelitian.model";
import { PaginationType } from "../types/pagination";
import {
  SortOrder,
  Status,
  StorageProvider,
  TipeDokumentasi,
} from "../utils/contstanst";

export class FileDokumenPenelitianService {
  // find by id
  static async findByIdForDetail(
    id: number,
  ): Promise<ResponseFileDokumenPenelitianForDetailType | null> {
    // call db
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
        tipe_file: TipeDokumentasi.PENELITIAN,
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
        penelitian_detail: {
          select: {
            judul_penelitian: true,
            tahun: true,
            link_publikasi: true,
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
      dokumentasi_penelitian: {
        judul_penelitian: result.penelitian_detail?.judul_penelitian!,
        link_publikasi: result.penelitian_detail?.link_publikasi!,
        tahun: result.penelitian_detail?.tahun!,
      },
      status: result.dokumentasi_borang_files[0].dokumentasi_borang
        .status as Status,
    };
  }

  // update file default
  static async updateFilePenelitian(params: {
    id: number;
    data: UpdateFilePenelitianType;
  }): Promise<ResponseUpdateFilePenelitanType | null> {
    // get params
    const {
      data: { keterangan, nama_file, judul_penelitian, link_publikasi, tahun },
      id,
    } = params;

    // call db
    const result = await prisma.fileDokumen.update({
      where: {
        id,
        tipe_file: TipeDokumentasi.PENELITIAN,
      },
      data: {
        nama_file,
        keterangan,
        penelitian_detail: {
          update: {
            judul_penelitian,
            link_publikasi,
            tahun,
          },
        },
      },
      select: {
        id: true,
        nama_file: true,
        keterangan: true,
        penelitian_detail: {
          select: {
            judul_penelitian: true,
            link_publikasi: true,
            tahun: true,
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
      dokumentasi_penelitian: {
        judul_penelitian: result.penelitian_detail?.judul_penelitian!,
        link_publikasi: result.penelitian_detail?.link_publikasi!,
        tahun: result.penelitian_detail?.tahun!,
      },
    };
  }
}
