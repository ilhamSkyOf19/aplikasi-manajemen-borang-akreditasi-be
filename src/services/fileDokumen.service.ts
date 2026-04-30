import prisma from "../libs/prisma";
import { StorageProvider, TipeDokumentasi } from "../utils/contstanst";

export class FileDokumenService {
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
