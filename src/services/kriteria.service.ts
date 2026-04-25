import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  CreateKriteriaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  toKriteriaResponse,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { PaginationType } from "../types/pagination";
import { SortOrder } from "../utils/contstanst";

export class KriteriaServices {
  // create kriteria
  static async create(
    req: CreateKriteriaType,
  ): Promise<ResponseKriteriaType | null> {
    // call db
    const result = await prisma.kriteria.create({
      data: {
        ...req,
      },
    });

    return toKriteriaResponse(result);
  }

  // //   read by id
  static async findById(id: number): Promise<ResponseKriteriaType | null> {
    const result = await prisma.kriteria.findUnique({
      where: {
        id,
      },
    });

    //   check
    if (!result) return null;

    return toKriteriaResponse(result);
  }

  // //   read all
  static async findAll(
    query: PaginationType,
  ): Promise<ResponseKriteriaWithMetaType | null> {
    const { page = 1, limit = 8, search, sort } = query;

    // current page
    const currentPage = page < 1 ? 1 : page;

    const conditional: Prisma.KriteriaWhereInput = {
      ...(search && {
        nama_kriteria: {
          contains: search,
        },
      }),
    };

    // get count data
    const totalData = await prisma.kriteria.count({ where: conditional });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.kriteria.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        kode_kriteria: sort ? (sort as SortOrder) : "asc",
      },
    });

    // return
    return {
      meta: {
        totalData,
        currentPage,
        totalPage,
        limit,
      },
      data: result,
    };
  }

  // find uniqe by id
  static async findUniqeById(id: number): Promise<number> {
    const result = await prisma.kriteria.findUnique({
      where: {
        id,
      },
    });

    return result?.id ?? 0;
  }

  // //   update kriteria
  static async update(
    id: number,
    req: UpdateKriteriaType,
  ): Promise<ResponseKriteriaType | null> {
    const result = await prisma.kriteria.update({
      where: {
        id,
      },
      data: {
        ...req,
      },
    });

    return toKriteriaResponse(result);
  }

  // //   delete kriteria
  static async delete(id: number): Promise<ResponseKriteriaType | null> {
    const result = await prisma.kriteria.delete({
      where: {
        id,
      },
    });

    //   check
    if (!result) return null;

    return toKriteriaResponse(result);
  }
}
