import prisma from "../libs/prisma";
import {
  CreateTimAkreditasiType,
  ResponseTimAkreditasiType,
  ResponseTimAkreditasiWithMetaType,
  toResponseTimAkreditasiType,
  UpdateTimAkreditasiType,
} from "../models/timAkreditasi.model";
import { PayloadUserType } from "../models/user.model";
import { PaginationType } from "../types/pagination";
import { UserRole } from "../utils/contstanst";

export class TimAkreditasiService {
  // create
  static async create(
    req: CreateTimAkreditasiType,
  ): Promise<ResponseTimAkreditasiType | null> {
    // call db
    const result = await prisma.tim_Akreditasi.create({
      data: {
        namaTimAkreditasi: req.namaTimAkreditasi,
        user: {
          create: req.users.map((userId) => ({
            user: {
              connect: {
                id: userId,
              },
            },
          })),
        },
      },
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return toResponseTimAkreditasiType({
      ...result,
      user: result.user.map((user) => {
        return {
          ...user.user,
          role: user.user.role as UserRole,
        };
      }),
    });
  }

  // read by id
  static async readById(id: number): Promise<ResponseTimAkreditasiType | null> {
    // call db
    const result = await prisma.tim_Akreditasi.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    return toResponseTimAkreditasiType({
      ...result,
      user: result.user.map((user) => {
        return {
          ...user.user,
          role: user.user.role as UserRole,
        };
      }),
    });
  }

  // read all
  static async readAll(
    query: PaginationType,
  ): Promise<ResponseTimAkreditasiWithMetaType | null> {
    const { limit = 8, page = 1, search } = query;
    // get current page
    const currentPage = page < 1 ? 1 : page;

    // get count data
    const totalData = await prisma.tim_Akreditasi.count({
      where: {
        namaTimAkreditasi: {
          contains: search,
          startsWith: search,
        },
      },
    });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.tim_Akreditasi.findMany({
      where: {
        namaTimAkreditasi: {
          contains: search,
        },
      },
      skip: (currentPage - 1) * limit,
      take: limit,
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return {
      data: result.map((item) => {
        return {
          ...item,
          user: item.user.map((user) => {
            return {
              ...user.user,
              role: user.user.role as UserRole,
            };
          }),
        };
      }),
      meta: {
        totalData,
        currentPage,
        totalPage,
        limit,
      },
    };
  }

  // update
  static async update(
    id: number,
    req: UpdateTimAkreditasiType,
  ): Promise<ResponseTimAkreditasiType | null> {
    // call db
    const result = await prisma.tim_Akreditasi.update({
      where: {
        id,
      },
      data: {
        namaTimAkreditasi: req.namaTimAkreditasi,
        user: {
          create:
            req.users &&
            req.users.map((userId) => ({
              user: {
                connect: {
                  id: userId,
                },
              },
            })),
        },
      },
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    return toResponseTimAkreditasiType({
      ...result,
      user: result.user.map((user) => {
        return {
          ...user.user,
          role: user.user.role as UserRole,
        };
      }),
    });
  }

  // delete relasi users by id tim & id users
  static async deleteRelasiUsers(
    idTim: number,
    idUsers: number[],
  ): Promise<ResponseTimAkreditasiType | null> {
    // call db
    const result = await prisma.tim_Akreditasi.update({
      where: {
        id: idTim,
      },
      data: {
        user: {
          deleteMany: [
            {
              userId: {
                in: idUsers,
              },
            },
          ],
        },
      },
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    // return

    return toResponseTimAkreditasiType({
      ...result,
      user: result.user.map((user) => {
        return {
          ...user.user,
          role: user.user.role as UserRole,
        };
      }),
    });
  }

  // delete by id
  static async delete(id: number): Promise<ResponseTimAkreditasiType | null> {
    // call db
    const result = await prisma.tim_Akreditasi.delete({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    // check
    if (!result) return null;

    // return

    return toResponseTimAkreditasiType({
      ...result,
      user: result.user.map((user) => {
        return {
          ...user.user,
          role: user.user.role as UserRole,
        };
      }),
    });
  }
}
