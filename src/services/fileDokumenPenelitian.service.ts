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
  static async findByIdForDetail(params: {
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }): Promise<ResponseFileDokumenPenelitianForDetailType | null> {
    const { dokumentasi_borang_id, file_dokumen_id } = params;
    // call db
    const result = await prisma.dokumentasiBorangFile.findUnique({
      where: {
        dokumentasi_borang_id_file_dokumen_id: {
          dokumentasi_borang_id,
          file_dokumen_id,
        },
      },
      select: {
        dokumentasi_borang: {
          select: {
            id: true,
            status: true,
            kebutuhan_dokumentasi: {
              select: {
                kriteria: {
                  select: {
                    id: true,
                    nama_kriteria: true,
                    kode_kriteria: true,
                  },
                },
                pendekatan: {
                  select: {
                    id: true,
                    tahap: true,
                    keterangan: true,
                  },
                },
              },
            },
          },
        },
        file_dokumen: {
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
            keterangan: true,
            tipe_file: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            penelitian_detail: {
              select: {
                id: true,
                judul_penelitian: true,
                link_publikasi: true,
                tahun: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // get jumlah file
    const getJumlahFileDigunakan = await prisma.dokumentasiBorangFile.count({
      where: {
        file_dokumen_id: result.file_dokumen.id,
      },
    });

    return {
      id: result.file_dokumen.id,
      dokumentasi_borang_id: result.dokumentasi_borang.id,
      nama_file: result.file_dokumen.nama_file,
      kriteria: result.dokumentasi_borang.kebutuhan_dokumentasi.kriteria,
      pendekatan: result.dokumentasi_borang.kebutuhan_dokumentasi.pendekatan,
      storage_provider: result.file_dokumen.storage_provider as StorageProvider,
      file_id: result.file_dokumen.file_id,
      uploaded_by: result.file_dokumen.uploaded_by,
      keterangan: result.file_dokumen.keterangan,
      tipe_file: result.file_dokumen.tipe_file as TipeDokumentasi,
      created_at: result.file_dokumen.created_at,
      updated_at: result.file_dokumen.updated_at,
      dokumentasi_penelitian: {
        judul_penelitian:
          result.file_dokumen.penelitian_detail?.judul_penelitian!,
        link_publikasi: result.file_dokumen.penelitian_detail?.link_publikasi!,
        tahun: result.file_dokumen.penelitian_detail?.tahun!,
      },
      total_digunakan: getJumlahFileDigunakan,
      status: result.dokumentasi_borang.status as Status,
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
