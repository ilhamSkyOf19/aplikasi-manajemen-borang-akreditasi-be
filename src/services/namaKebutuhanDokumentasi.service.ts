import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponseNamaKebutuhanDokumentasiWithMetaType,
  toResponseNamaKebutuhanDokumentasiWithMetaType,
} from "../models/namaKebutuhanDokumentasi.model";
import { PaginationType } from "../types/pagination";
import { SortOrder } from "../utils/contstanst";

export class NamaKebutuhanDokumentasiServices {
  // find all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseNamaKebutuhanDokumentasiWithMetaType | null> {
    // get query
    const { page = 1, limit = 8, search, sort } = query;

    // current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.NamaKebutuhanDokumentasiWhereInput = {
      ...(search && {
        nama_kebutuhan_dokumentasi: {
          contains: search,
        },
      }),
    };

    // total data
    const totalData = await prisma.namaKebutuhanDokumentasi.count({
      where: conditional,
    });

    // total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.namaKebutuhanDokumentasi.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        id: sort ? (sort as SortOrder) : "asc",
      },
    });

    return toResponseNamaKebutuhanDokumentasiWithMetaType({
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
      data: result.map((item) => ({
        id: item.id,
        nama_kebutuhan_dokumentasi: item.nama_kebutuhan_dokumentasi,
      })),
    });
  }

  // get count by name
  static async getCountInKebutuhanDokumentasiById(id: number): Promise<number> {
    return await prisma.kebutuhanDokumentasi.count({
      where: {
        nama_kebutuhan_dokumentasi_id: id,
      },
    });
  }

  // delete by id
  static async delete(id: number): Promise<boolean> {
    // call db
    const result = await prisma.namaKebutuhanDokumentasi.deleteMany({
      where: {
        id,
      },
    });

    return result ? true : false;
  }
}
