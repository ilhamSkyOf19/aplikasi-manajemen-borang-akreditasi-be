import prisma from "../libs/prisma";
import {
  CreateKriteriaPicType,
  ResponseKriteriaPicType,
  toKriteriaPicResponse,
} from "../models/kriteriaPic.model";
import { DosenRole } from "../utils/contstanst";

export class KriteriaPicServices {
  // create
  static async create(
    data: CreateKriteriaPicType,
  ): Promise<ResponseKriteriaPicType | null> {
    // get data
    const { dosen_id, kriteria_id } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      await tx.kriteriaPic.createMany({
        data: dosen_id.map((dosenId) => ({
          kriteria_id,
          dosen_id: dosenId,
        })),
        skipDuplicates: true,
      });

      // return
      return tx.kriteriaPic.findMany({
        where: {
          kriteria_id,
          dosen_id: {
            in: dosen_id,
          },
        },
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          dosen: {
            select: {
              id: true,
              nama: true,
              nidn: true,
              dosenRole: {
                select: {
                  role: true,
                },
              },
              email: true,
            },
          },
          kriteria: {
            select: {
              id: true,
              kode_kriteria: true,
              nama_kriteria: true,
            },
          },
        },
      });
    });

    // check
    if (!result || result.length === 0) return null;

    // return
    return toKriteriaPicResponse({
      kriteria: {
        id: result[0].kriteria.id,
        kode_kriteria: result[0].kriteria.kode_kriteria,
        nama_kriteria: result[0].kriteria.nama_kriteria,
      },
      dosen: result.map((item) => ({
        id: item.dosen.id,
        email: item.dosen.email,
        nidn: item.dosen.nidn,
        nama: item.dosen.nama,
        roles: item.dosen.dosenRole.map((item) => item.role) as DosenRole[],
      })),
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
    });
  }
}
