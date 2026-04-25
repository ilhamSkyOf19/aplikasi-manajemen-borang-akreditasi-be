import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  CreateKriteriaPicType,
  ResponseKriteriaPicType,
  ResponseKriteriaPicWithMetaType,
  toKriteriaPicResponse,
  toKriteriaPicWithMetaResponse,
  UpdateKriteriaPicType,
} from "../models/kriteriaPic.model";
import { PaginationType } from "../types/pagination";
import { DosenRole, SortOrder } from "../utils/contstanst";

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

  // find all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseKriteriaPicWithMetaType | null> {
    // get query
    const { page = 1, limit = 8, search, sort } = query;

    // current page
    const currentPage = page < 1 ? 1 : page;

    // contional
    const conditional: Prisma.KriteriaPicWhereInput = {
      ...(search && {
        OR: [
          {
            kriteria: {
              nama_kriteria: {
                contains: search,
              },
            },
          },
          {
            dosen: {
              nama: {
                contains: search,
              },
            },
          },
        ],
      }),
    };

    // get count data
    const totalData = await prisma.kriteriaPic.count({
      where: conditional,
    });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.kriteriaPic.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        kriteria: {
          kode_kriteria: sort ? (sort as SortOrder) : "asc",
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

    // gruped
    const groupedMap = new Map<number, ResponseKriteriaPicType>();

    for (const item of result) {
      const kriteriaId = item.kriteria.id;

      // dosen
      const dosen = {
        id: item.dosen.id,
        email: item.dosen.email,
        nidn: item.dosen.nidn,
        nama: item.dosen.nama,
        roles: item.dosen.dosenRole.map((item) => item.role) as DosenRole[],
      };

      // get exis data by kriteria id
      const existingData = groupedMap.get(kriteriaId);

      // set dosen
      if (existingData) {
        existingData.dosen.push(dosen);

        if (item.updated_at > existingData.updated_at) {
          existingData.updated_at = item.updated_at;
        }

        continue;
      }

      groupedMap.set(kriteriaId, {
        kriteria: {
          id: item.kriteria.id,
          kode_kriteria: item.kriteria.kode_kriteria,
          nama_kriteria: item.kriteria.nama_kriteria,
        },
        dosen: [dosen],
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
    }

    // grouped
    const finalGrouped = Array.from(groupedMap.values());

    // return
    return {
      meta: {
        totalData,
        totalPage,
        currentPage,
        limit,
      },
      data: finalGrouped,
    };
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

  // update kriteria pic
  static async update(
    kriteria_id: number,
    data: UpdateKriteriaPicType,
  ): Promise<ResponseKriteriaPicType | null> {
    // get data
    const { dosen_id } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      await tx.kriteriaPic.deleteMany({
        where: {
          kriteria_id,
        },
      });

      await tx.kriteriaPic.createMany({
        data: dosen_id.map((dosenId) => ({
          kriteria_id,
          dosen_id: dosenId,
        })),
        skipDuplicates: true,
      });

      return tx.kriteriaPic.findMany({
        where: {
          kriteria_id,
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
              email: true,
              dosenRole: {
                select: {
                  role: true,
                },
              },
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

  // delete
  static async delete(kriteria_id: number): Promise<number> {
    const result = await prisma.kriteriaPic.deleteMany({
      where: {
        kriteria_id,
      },
    });

    return result.count;
  }
}
