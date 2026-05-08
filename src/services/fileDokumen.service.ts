import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponseFileDokumenForChooseWithMetaType,
  ResponseFileDokumenForDetailType,
} from "../models/fileDokumen.mode";
import { PaginationType } from "../types/pagination";
import {
  SortOrder,
  StorageProvider,
  TipeDokumentasi,
} from "../utils/contstanst";

export class FileDokumenService {
  // find all get id and nama by active
  static async findAllForChoose(
    query: PaginationType,
  ): Promise<ResponseFileDokumenForChooseWithMetaType | null> {
    // get query
    const { limit = 8, page = 1, search, sort } = query;

    // current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.FileDokumenWhereInput = {
      ...(search && {
        nama_file: {
          contains: search,
        },
      }),
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
    provider_file_id?: string;
    nama_file: string;
    uploaded_by_id: number;
  } | null> {
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        is_active: true,
        storage_provider: true,
        provider_file_id: true,
        nama_file: true,
        uploaded_by_id: true,
      },
    });

    // check
    if (!result) return null;

    return {
      id: result.id,
      is_active: result.is_active,
      nama_file: result.nama_file,
      storage_provider: result.storage_provider as StorageProvider,
      provider_file_id: result.provider_file_id ?? undefined,
      uploaded_by_id: result.uploaded_by_id,
    };
  }

  // find by id
  static async findByIdForDetail(
    id: number,
  ): Promise<ResponseFileDokumenForDetailType | null> {
    // call db
    const result = await prisma.fileDokumen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nama_file: true,
        storage_provider: true,
        provider_file_id: true,
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
      nama_file: result.nama_file,
      storage_provider: result.storage_provider as StorageProvider,
      provider_file_id: result.provider_file_id ?? null,
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
}
