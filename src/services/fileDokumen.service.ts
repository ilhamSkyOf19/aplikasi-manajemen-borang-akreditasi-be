import prisma from "../libs/prisma";

export class FileDokumenService {
  // find by ids
  static async findByIds(ids: number[]): Promise<number> {
    const result = await prisma.fileDokumen.count({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return result;
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
