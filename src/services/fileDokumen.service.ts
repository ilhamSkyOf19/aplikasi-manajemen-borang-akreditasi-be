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
}
