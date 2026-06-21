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
import { FileDokumenService } from "./fileDokumen.service";

export class FileDokumenDefaultService {
  // find by id
  static async findByIdForDetail(params: {
    dokumentasi_borang_id: number;
    file_dokumen_id: number;
  }): Promise<ResponseFileDokumenDefaultForDetailType | null> {
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
            default_detail: {
              select: {
                nomor_dokumen: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // get jumlah file
    const getJumlahFileDigunakan =
      await FileDokumenService.findCountInDokumentasiBorang(
        result.file_dokumen.id,
      );

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
      dokumentasi_default: result.file_dokumen.default_detail?.nomor_dokumen
        ? {
            nomor_dokumentasi: result.file_dokumen.default_detail.nomor_dokumen,
          }
        : null,
      total_digunakan: getJumlahFileDigunakan,
      status: result.dokumentasi_borang.status as Status,
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
        tipe_file: TipeDokumentasi.DEFAULT,
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
