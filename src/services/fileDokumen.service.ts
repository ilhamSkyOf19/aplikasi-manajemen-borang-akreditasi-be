import prisma from "../libs/prisma";
import { TipeDokumentasi } from "../utils/contstanst";

export class FileDokumenService {
  // find by ids
  static async findByIdsAndGetTipe(
    ids: number[],
  ): Promise<{ tipe_file: TipeDokumentasi }[]> {
    const result = await prisma.fileDokumen.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        tipe_file: true,
      },
    });

    return result.map((item) => ({
      tipe_file: item.tipe_file as TipeDokumentasi,
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
