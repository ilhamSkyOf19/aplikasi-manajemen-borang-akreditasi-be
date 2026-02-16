import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumenType,
  ResponseKebutuhanDokumenType,
  ResponseKebutuhanDokumenWithMetaType,
  toResponseKebutuhanDokumenType,
  toResponseKebutuhanDokumenWithMetaType,
  UpdateKebutuhanDokumenType,
} from "../models/kebutuhanDokumen.model";
import { PaginationType } from "../types/pagination";
import { Status } from "../utils/contstanst";

export class KebutuhanDokumenService {
  // create
  static async create(
    req: CreateKebutuhanDokumenType,
  ): Promise<ResponseKebutuhanDokumenType | null> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.create({
      data: {
        namaDokumen: req.namaDokumen,
        keterangan: req.keterangan,
        kriteria: {
          connect: {
            id: req.kriteriaId,
          },
        },
        pendekatan: {
          connect: {
            id: req.pendekatanId,
          },
        },
      },
      select: {
        id: true,
        namaDokumen: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kriteria: {
          select: {
            id: true,
            kriteria: true,
            namaKriteria: true,
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
      },
    });

    return toResponseKebutuhanDokumenType(result);
  }

  // read by id
  static async readById(
    id: number,
  ): Promise<ResponseKebutuhanDokumenType | null> {
    //   call db
    const result = await prisma.kebutuhan_Dokumen.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        namaDokumen: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kriteria: {
          select: {
            id: true,
            kriteria: true,
            namaKriteria: true,
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
      },
    });

    // check
    if (!result) return null;

    return toResponseKebutuhanDokumenType(result);
  }

  //   read all
  static async readAll(
    query: PaginationType & {
      kriteria: string;
      status: Status;
    },
  ): Promise<ResponseKebutuhanDokumenWithMetaType | null> {
    const { limit = 8, page = 1, search, kriteria, status } = query;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional = {
      where: {
        AND: [
          search
            ? {
                OR: [{ namaDokumen: { contains: search } }],
              }
            : {},
          kriteria ? { kriteria: { namaKriteria: kriteria } } : {},
          status ? { status: status } : {},
        ],
      },
    };

    // get count data
    const totalData = await prisma.kebutuhan_Dokumen.count(conditional);

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.kebutuhan_Dokumen.findMany({
      ...conditional,
      select: {
        id: true,
        namaDokumen: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kriteria: {
          select: {
            id: true,
            kriteria: true,
            namaKriteria: true,
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    // return
    return toResponseKebutuhanDokumenWithMetaType({
      data: result.map((item) => toResponseKebutuhanDokumenType(item)),
      meta: {
        totalData,
        totalPage,
        currentPage,
        limit,
      },
    });
  }

  //   update
  static async update(
    id: number,
    req: UpdateKebutuhanDokumenType,
  ): Promise<ResponseKebutuhanDokumenType | null> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.update({
      where: {
        id,
      },
      data: req,
      select: {
        id: true,
        namaDokumen: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kriteria: {
          select: {
            id: true,
            kriteria: true,
            namaKriteria: true,
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
      },
    });

    return toResponseKebutuhanDokumenType(result);
  }

  //   delete
  static async delete(id: number): Promise<boolean> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.delete({
      where: {
        id,
      },
    });

    // check
    if (!result) return false;

    return true;
  }
}
