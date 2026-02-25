import prisma from "../libs/prisma";
import {
  CreatePicType,
  ResponsePicType,
  ResponsePicUpdateStatusType,
  ResponsePicWithMetaType,
  toResponsePicType,
  toResponsePicUpdateStatusType,
  UpdatePicType,
} from "../models/pic.model";
import { PaginationType } from "../types/pagination";
import { ResponseStructure } from "../types/response";
import { Status } from "../utils/contstanst";

export class PicService {
  // create
  static async create(req: CreatePicType): Promise<ResponsePicType | null> {
    // call db
    const result = await prisma.pic.create({
      data: {
        timAkreditasi: {
          connect: {
            id: req.timAkreditasiId,
          },
        },
        kebutuhanDokumen: {
          connect: {
            id: req.kebutuhanDokumenId,
          },
        },
        pj: {
          create: req.pjId.map((id: number) => ({
            user: {
              connect: {
                id,
              },
            },
          })),
        },
        keterangan: req.keterangan,
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            keterangan: true,
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
        },
        pj: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      pj: result.pj.map((item) => ({
        id: item.user.id,
        email: item.user.email,
        nama: item.user.nama,
      })),
    });
  }

  //   find by id
  static async findById(id: number): Promise<boolean> {
    // call db
    const result = await prisma.pic.findFirst({
      where: {
        id,
      },
    });

    // check
    if (!result) return false;

    return true;
  }

  //   read all
  static async readAll(
    query: PaginationType & {
      status?: Status;
      kriteriaId?: string;
      pendekatanId?: string;
      sort?: string;
    },
  ): Promise<ResponsePicWithMetaType | null> {
    // destruct query
    const {
      limit = 8,
      page: currentPage = 1,
      search,
      status,
      kriteriaId,
      pendekatanId,
      sort,
    } = query;

    // conditional
    const conditional = {
      where: {
        AND: [
          search
            ? {
                OR: [
                  {
                    timAkreditasi: {
                      namaTimAkreditasi: {
                        contains: search,
                      },
                    },
                  },
                  {
                    kebutuhanDokumen: {
                      namaDokumen: {
                        contains: search,
                      },
                    },
                  },
                ],
              }
            : {},
          status ? { status: status } : {},
          kriteriaId
            ? {
                kebutuhanDokumen: {
                  kriteria: {
                    id: +kriteriaId,
                  },
                },
              }
            : {},
          pendekatanId
            ? {
                kebutuhanDokumen: {
                  pendekatan: {
                    id: +pendekatanId,
                  },
                },
              }
            : {},
        ],
      },
    };

    // get count data
    const totalData = await prisma.pic.count(conditional);

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.pic.findMany({
      ...conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            keterangan: true,
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
        },
        pj: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
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
      data: result.map((item) =>
        toResponsePicType({
          ...item,
          status: item.status as Status,
          kebutuhanDokumen: {
            ...item.kebutuhanDokumen,
            status: item.kebutuhanDokumen.status as Status,
          },
          pj: item.pj.map((item) => ({
            id: item.user.id,
            email: item.user.email,
            nama: item.user.nama,
          })),
        }),
      ),
    };
  }

  //   read by id
  static async readById(id: number): Promise<ResponsePicType | null> {
    // call db
    const result = await prisma.pic.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            keterangan: true,
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
        },
        pj: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      pj: result.pj.map((item) => ({
        id: item.user.id,
        email: item.user.email,
        nama: item.user.nama,
      })),
    });
  }

  //   update
  static async update(
    id: number,
    req: UpdatePicType,
  ): Promise<ResponsePicType | null> {
    // destroy pj
    const { pjId, ...rest } = req;
    // call db
    const result = await prisma.pic.update({
      where: {
        id,
      },
      data: {
        ...rest,
        pj: pjId
          ? {
              deleteMany: {},
              create: pjId.map((userId) => ({
                user: {
                  connect: { id: userId },
                },
              })),
            }
          : undefined,
        status: "menunggu",
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            keterangan: true,
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
        },
        pj: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      pj: result.pj.map((item) => ({
        id: item.user.id,
        email: item.user.email,
        nama: item.user.nama,
      })),
    });
  }

  // update status
  static async updateStatus(
    id: number,
    status: Status,
  ): Promise<ResponsePicUpdateStatusType | null> {
    // call db
    const result = await prisma.pic.update({
      where: {
        id,
      },
      data: {
        status,
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
          },
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
          },
        },
        pj: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicUpdateStatusType({
      ...result,
      status: result.status as Status,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
      },
      pj: result.pj.map((item) => ({
        id: item.user.id,
        nama: item.user.nama,
      })),
    });
  }

  //   delete
  static async delete(id: number): Promise<boolean> {
    // call db
    const result = await prisma.pic.delete({
      where: {
        id,
      },
    });

    // check
    if (!result) return false;

    return true;
  }

  // // delete user in pic
  // static async deleteUserInPic(
  //   picId: number,
  //   userId: number,
  // ): Promise<boolean> {
  //   const result = await prisma.pic.update({
  //     where: { id: picId },
  //     data: {
  //       pj: {
  //         delete: {
  //           picId_userId: {
  //             picId,
  //             userId,
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return !!result;
  // }
}
