import prisma from "../libs/prisma";
import {
  AddPicToKriteriaType,
  ResponseCreateUpdateKriteriaPicType,
  toResponseCreateUpdateKriteriaPic,
} from "../models/kriteriaPic.model";

export class KriteriaPicServices {
  // create
  static async addPicToKriteria(
    data: AddPicToKriteriaType,
  ): Promise<ResponseCreateUpdateKriteriaPicType | null> {
    const { dosen_id, kriteria_id } = data;

    const result = await prisma.$transaction(async (tx) => {
      // cek apakah kriteria sudah punya PIC
      const existingPic = await tx.kriteriaPic.findMany({
        where: {
          kriteria_id,
        },
        select: {
          id: true,
        },
      });

      // jika sudah ada, hapus PIC lama pada kriteria tersebut
      if (existingPic.length > 0) {
        await tx.kriteriaPic.deleteMany({
          where: {
            kriteria_id,
          },
        });
      }

      // tambahkan PIC baru
      await tx.kriteriaPic.createMany({
        data: dosen_id.map((dosenId) => ({
          kriteria_id,
          dosen_id: dosenId,
        })),
        skipDuplicates: true,
      });

      // ambil data terbaru
      return tx.kriteriaPic.findMany({
        where: {
          kriteria_id,
        },
        select: {
          created_at: true,
          updated_at: true,
          dosen: {
            select: {
              id: true,
            },
          },
          kriteria: {
            select: {
              id: true,
            },
          },
        },
      });
    });

    if (!result || result.length === 0) return null;

    return toResponseCreateUpdateKriteriaPic({
      kriteria_id: result[0].kriteria.id,
      dosen_id: result.map((item) => item.dosen.id),
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    });
  }

  // get count by kriteria id
  static async getCountByKriteriaId(kriteriaId: number): Promise<number> {
    return await prisma.kriteriaPic.count({
      where: {
        kriteria: {
          id: kriteriaId,
        },
      },
    });
  }
}
