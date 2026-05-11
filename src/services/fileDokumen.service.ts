import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import { ResponseFileDokumenForChooseWithMetaType } from "../models/fileDokumen.model";
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

  // delete from dokumentasi borang
  static async deleteFromDokumentasiBorang(params: {
    id: number;
    dokumentasi_borang_id: number;
  }): Promise<boolean> {
    console.log(params);
    const result = await prisma.$transaction(async (tx) => {
      // delete from dokumentasi borang files
      const deleteFromDokumentasiBorang =
        await tx.dokumentasiBorangFile.deleteMany({
          where: {
            dokumentasi_borang_id: params.dokumentasi_borang_id,
            file_dokumen_id: params.id,
          },
        });

      // check
      if (!deleteFromDokumentasiBorang.count)
        throw new Error("Data pivot not found");

      const checkActivatedFalse = await tx.fileDokumen.findFirst({
        where: {
          id: params.id,
          is_active: false,
        },
      });

      if (checkActivatedFalse) {
        // delete from file dokumentasi
        const deleteFromFileDokumentasi = await tx.fileDokumen.delete({
          where: {
            id: params.id,
          },
        });
        // check
        if (!deleteFromFileDokumentasi) throw new Error("Data not found");
      }

      return true;
    });

    return !!result;
  }
}
