import prisma from "../libs/prisma";
import { TipeDokumentasi } from "../utils/contstanst";

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
}
