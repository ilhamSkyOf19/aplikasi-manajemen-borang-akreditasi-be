import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumenType,
  ResponseKebutuhanDokumenChooseWithMetaType,
  ResponseKebutuhanDokumenType,
  ResponseKebutuhanDokumenWithMetaType,
  toResponseKebutuhanDokumenChooseWithMetaType,
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
        status: "menunggu",
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
        status: true,
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

    return toResponseKebutuhanDokumenType({
      ...result,
      status: result.status as Status,
    });
  }

  // find by id return boolean
  static async findById(id: number): Promise<boolean> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.findUnique({
      where: {
        id,
      },
    });

    return !!result;
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
        status: true,
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

    return toResponseKebutuhanDokumenType({
      ...result,
      status: result.status as Status,
    });
  }

  //   read all
  static async readAll(
    query: PaginationType & {
      kriteria?: string;
      status?: Status;
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
        status: true,
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
      data: result.map((item) =>
        toResponseKebutuhanDokumenType({
          ...item,
          status: item.status as Status,
        }),
      ),
      meta: {
        totalData,
        totalPage,
        currentPage,
        limit,
      },
    });
  }

  // read choose
  static async readChoose(
    query: PaginationType,
  ): Promise<ResponseKebutuhanDokumenChooseWithMetaType | null> {
    // get query
    const { limit = 8, page = 1, search } = query;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // get count
    const totalData = await prisma.kebutuhan_Dokumen.count({
      where: {
        namaDokumen: {
          contains: search,
          startsWith: search,
        },
      },
    });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call prisma
    const result = await prisma.kebutuhan_Dokumen.findMany({
      where: {
        namaDokumen: {
          contains: search,
        },
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        namaDokumen: true,
      },
    });

    return toResponseKebutuhanDokumenChooseWithMetaType({
      data: result,
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
    req: Omit<UpdateKebutuhanDokumenType, "keteranganUpdate">,
  ): Promise<ResponseKebutuhanDokumenType | null> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.update({
      where: {
        id,
      },
      data: {
        ...req,
        status: Status.menunggu,
      },
      select: {
        id: true,
        namaDokumen: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        status: true,
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

    return toResponseKebutuhanDokumenType({
      ...result,
      status: result.status as Status,
    });
  }

  // update status kebutuhan dokumentasi
  static async updateStatusKebutuhanDokumentasi(
    id: number,
    status: Status,
  ): Promise<boolean> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    // return
    return !!result;
  }

  // find status disetujui by id
  static async findStatusDisetujui(
    kebutuhanDokumenId: number,
  ): Promise<boolean> {
    // call db
    const result = await prisma.kebutuhan_Dokumen.findFirst({
      where: {
        id: kebutuhanDokumenId,
        status: "disetujui",
      },
    });

    // return
    return !!result;
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
