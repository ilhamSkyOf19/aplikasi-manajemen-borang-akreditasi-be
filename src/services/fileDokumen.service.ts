import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponseFileDokumenForChooseWithMetaType,
  ResponseSearchGlobalType,
  toResponseSearchGlobalType,
} from "../models/fileDokumen.model";
import { PaginationType } from "../types/pagination";
import {
  SortOrder,
  Status,
  StorageProvider,
  TipeDokumentasi,
} from "../utils/contstanst";

export class FileDokumenService {
  // find all get id and nama by active
  static async findAllForChoose(params: {
    tipe_file: TipeDokumentasi;
    query: PaginationType;
  }): Promise<ResponseFileDokumenForChooseWithMetaType | null> {
    // get params
    const {
      query: { limit = 8, page = 1, search, sort },
      tipe_file,
    } = params;

    // current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.FileDokumenWhereInput = {
      ...(search && {
        nama_file: {
          contains: search,
        },
      }),
      tipe_file,
      is_active: true,
    };

    // get count
    const totalData = await prisma.fileDokumen.count({ where: conditional });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.fileDokumen.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        updated_at: sort ? (sort as SortOrder) : "asc",
      },
      select: {
        id: true,
        nama_file: true,
      },
    });

    if (!result) return null;

    return {
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
      data: result.map((item) => ({
        id: item.id,
        nama_file: item.nama_file,
      })),
    };
  }
  // find by ids
  static async findByIdsAndGetTipeAndActive(
    ids: number[],
  ): Promise<{ tipe_file: TipeDokumentasi; is_active: boolean }[]> {
    const result = await prisma.fileDokumen.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        tipe_file: true,
        is_active: true,
      },
    });

    return result.map((item) => ({
      tipe_file: item.tipe_file as TipeDokumentasi,
      is_active: item.is_active,
    }));
  }

  static async findByIdAndGetTipeAndActive(
    id: number,
  ): Promise<{ tipe_file: TipeDokumentasi; is_active: boolean } | null> {
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
      },
      select: {
        tipe_file: true,
        is_active: true,
      },
    });

    // check
    if (!result) return null;

    return {
      is_active: result.is_active,
      tipe_file: result.tipe_file as TipeDokumentasi,
    };
  }

  // find by id and active
  static async findById(id: number): Promise<{
    id: number;
    is_active: boolean;
    storage_provider: StorageProvider;
    file_id: string;
    nama_file: string;
    uploaded_by_id: number;
    tipe_file: TipeDokumentasi;
  } | null> {
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        is_active: true,
        storage_provider: true,
        file_id: true,
        nama_file: true,
        uploaded_by_id: true,
        tipe_file: true,
      },
    });

    // check
    if (!result) return null;

    return {
      id: result.id,
      is_active: result.is_active,
      nama_file: result.nama_file,
      storage_provider: result.storage_provider as StorageProvider,
      file_id: result.file_id ?? undefined,
      uploaded_by_id: result.uploaded_by_id,
      tipe_file: result.tipe_file as TipeDokumentasi,
    };
  }

  // find many by nama file
  static async findByNames(nama_file: string[]): Promise<number> {
    const result = await prisma.fileDokumen.findMany({
      where: {
        nama_file: {
          in: nama_file,
        },
      },
    });

    return result.length;
  }

  // find by name
  static async findByName(nama_file: string): Promise<number | null> {
    const result = await prisma.fileDokumen.findFirst({
      where: {
        nama_file,
      },
      select: {
        id: true,
      },
    });

    // check
    if (!result) return null;

    return result.id;
  }

  // delete file by id and tipe
  static async delete(params: {
    idFileDokumen: number;
    tipe_file: TipeDokumentasi;
  }): Promise<boolean | null> {
    // call db
    const result = await prisma.fileDokumen.delete({
      where: {
        id: params.idFileDokumen,
        tipe_file: params.tipe_file,
      },
    });

    return result ? true : null;
  }

  // delete from dokumentasi borang
  static async deleteFromDokumentasiBorang(params: {
    id: number;
    dokumentasi_borang_id: number;
  }): Promise<boolean> {
    // call db call
    const result = await prisma.dokumentasiBorangFile.delete({
      where: {
        dokumentasi_borang_id_file_dokumen_id: {
          dokumentasi_borang_id: params.dokumentasi_borang_id,
          file_dokumen_id: params.id,
        },
      },
    });

    return !!result;
  }

  // find all by search
  static async findAllBySearchAndPeriode(params: {
    search: string;
    periode_id: number;
  }): Promise<ResponseSearchGlobalType[] | null> {
    // get search
    const { search, periode_id } = params;

    // call db
    const result = await prisma.fileDokumen.findMany({
      where: {
        dokumentasi_borang_files: {
          some: {
            dokumentasi_borang: {
              kebutuhan_dokumentasi: {
                kriteria: {
                  periode_id,
                },
              },
            },
          },
        },
        nama_file: {
          contains: search,
        },
      },
      take: 10,
      select: {
        id: true,
        nama_file: true,
        tipe_file: true,
        dokumentasi_borang_files: {
          where: {
            dokumentasi_borang: {
              status: Status.APPROVED,
            },
          },
          select: {
            dokumentasi_borang: {
              select: {
                id: true,
                kebutuhan_dokumentasi: {
                  select: {
                    id: true,
                    nama_kebutuhan_dokumentasi: {
                      select: {
                        nama_kebutuhan_dokumentasi: true,
                      },
                    },
                    kriteria: {
                      select: {
                        id: true,
                        nama_kriteria: true,
                      },
                    },
                    pendekatan: {
                      select: {
                        id: true,
                        keterangan: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // grouped by kriteria
    const groupedFile = new Map<number, ResponseSearchGlobalType>();

    // mapping
    for (const file of result) {
      // mapping dokumentasi borang files
      for (const dokumentasiBorangFile of file.dokumentasi_borang_files) {
        // dokumentasi borang id
        const dokumentasiBorangId =
          dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi.id;

        // check dokumentasi borang id exist
        const hasDokumentasiBorangId = groupedFile.has(dokumentasiBorangId);

        // mapping
        const result: ResponseSearchGlobalType = {
          kriteria: {
            id: dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
              .kriteria.id,
            nama_kriteria:
              dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
                .kriteria.nama_kriteria,
          },
          pendekatan: {
            id: dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
              .pendekatan.id,
            keterangan:
              dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
                .pendekatan.keterangan,
          },
          dokumentasi_borang_id: dokumentasiBorangFile.dokumentasi_borang.id,
          file: {
            id: file.id,
            nama_file: file.nama_file,
            tipe_file: file.tipe_file as TipeDokumentasi,
          },
          kebutuhan_dokumentasi: {
            id: dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
              .id,
            nama_kebutuhan_dokumentasi:
              dokumentasiBorangFile.dokumentasi_borang.kebutuhan_dokumentasi
                .nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          },
        };

        // not existng
        if (!hasDokumentasiBorangId) {
          groupedFile.set(dokumentasiBorangId, result);
        }

        continue;
      }
    }

    // final groupedFile
    const finalGroupedFile = Array.from(groupedFile.values());

    return finalGroupedFile;
  }
}
