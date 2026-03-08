import { SortOrder } from "../../generated/prisma/internal/prismaNamespaceBrowser";
import prisma from "../libs/prisma";
import {
  CreateKriteriaType,
  ResponseKriteriaType,
  ResponseKriteriaWithMetaType,
  toKriteriaResponse,
  UpdateKriteriaType,
} from "../models/kriteria.model";
import { PaginationType } from "../types/pagination";

export class KriteriaService {
  // create kriteria
  static async create(
    req: CreateKriteriaType,
  ): Promise<ResponseKriteriaType | null> {
    // call db
    const result = await prisma.kriteria.create({
      data: {
        ...req,
        revisi: 0,
      },
    });

    return toKriteriaResponse(result);
  }

  //   read by id
  static async readById(id: number): Promise<ResponseKriteriaType | null> {
    const result = await prisma.kriteria.findUnique({
      where: {
        id,
      },
    });

    //   check
    if (!result) return null;

    return toKriteriaResponse(result);
  }

  //   read all
  static async readAll({
    page = 1,
    limit = 8,
    search,
    status,
    sort = "asc",
  }: PaginationType & {
    status?: "baru" | "revisi";
  }): Promise<ResponseKriteriaWithMetaType | null> {
    // current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const revisiFilter =
      status === "baru"
        ? { revisi: 0 }
        : status === "revisi"
          ? { revisi: { gt: 0 } }
          : {};

    const conditional = {
      where: {
        AND: [
          search
            ? {
                namaKriteria: {
                  contains: search,
                },
              }
            : {},
          revisiFilter ?? {},
        ],
      },
    };

    // get count data
    const totalData = await prisma.kriteria.count(conditional);

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.kriteria.findMany({
      ...conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        kriteria: sort ? (sort as SortOrder) : "asc",
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

  //   update kriteria
  static async update(
    id: number,
    revisi: number,
    req: UpdateKriteriaType,
  ): Promise<ResponseKriteriaType | null> {
    const result = await prisma.kriteria.update({
      where: {
        id,
      },
      data: {
        ...req,
        revisi: revisi + 1,
      },
    });

    return toKriteriaResponse(result);
  }

  //   delete kriteria
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
