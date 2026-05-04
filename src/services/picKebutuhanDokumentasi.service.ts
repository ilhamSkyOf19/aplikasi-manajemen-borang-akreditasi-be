import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponsePicKebutuhanDokumentasiWithPaginationType,
  toResponsePicKebutuhanDokumentasiWithPaginationType,
} from "../models/picKebutuhanDokumentasi.model";
import { PaginationType } from "../types/pagination";
import { SortOrder } from "../utils/contstanst";

export class PicKebutuhanDokumentasiServices {
  // create
  static async create(nama: string): Promise<{ id: number; nama: string }> {
    // call db
    const result = await prisma.pic.create({
      data: {
        nama,
      },
    });

    return {
      id: result.id,
      nama: result.nama,
    };
  }

  //   find by id
  static async findByIds(id: number[]): Promise<number> {
    const result = await prisma.pic.findMany({
      where: {
        id: {
          in: id,
        },
      },
    });

    return result?.length ?? 0;
  }
  static async findAll(params: {
    query: PaginationType;
  }): Promise<ResponsePicKebutuhanDokumentasiWithPaginationType> {
    // get params
    const { page = 1, limit = 8, search, sort } = params.query;

    // current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.PicWhereInput = {
      ...(search && {
        nama: {
          contains: search,
        },
      }),
    };

    // get count data
    const totalData = await prisma.pic.count({ where: conditional });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.pic.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        id: sort ? (sort as SortOrder) : "asc",
      },
    });

    return toResponsePicKebutuhanDokumentasiWithPaginationType({
      data: result.map((item) => ({
        id: item.id,
        nama: item.nama,
      })),
      meta: {
        totalData,
        totalPage,
        currentPage,
        limit,
      },
    });
  }
}
