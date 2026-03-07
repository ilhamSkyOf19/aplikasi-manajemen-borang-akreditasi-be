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
import { Status, UserRole } from "../utils/contstanst";

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
        keterangan: req.keterangan,
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        riwayat: {
          select: {
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
            userTimAkreditasi: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      statusRiwayat: (result.riwayat[0]?.status ?? null) as Status | null,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      timAkreditasi: {
        id: result.timAkreditasi.id,
        namaTimAkreditasi: result.timAkreditasi.namaTimAkreditasi,
        createdAt: result.timAkreditasi.createdAt,
        updatedAt: result.timAkreditasi.updatedAt,
        anggota: result.timAkreditasi.userTimAkreditasi.map((item) => ({
          id: item.user.id,
          nama: item.user.nama,
          email: item.user.email,
          role: item.user.role as UserRole,
        })),
      },
    });
  }

  //   find by id
  static async findById(id: number): Promise<ResponsePicType | null> {
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
        riwayat: {
          select: {
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
            userTimAkreditasi: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      statusRiwayat: (result.riwayat[0]?.status ?? null) as Status | null,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      timAkreditasi: {
        id: result.timAkreditasi.id,
        namaTimAkreditasi: result.timAkreditasi.namaTimAkreditasi,
        createdAt: result.timAkreditasi.createdAt,
        updatedAt: result.timAkreditasi.updatedAt,
        anggota: result.timAkreditasi.userTimAkreditasi.map((item) => ({
          id: item.user.id,
          nama: item.user.nama,
          email: item.user.email,
          role: item.user.role as UserRole,
        })),
      },
    });
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
        riwayat: {
          select: {
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
            userTimAkreditasi: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
          statusRiwayat: (item.riwayat[0]?.status ?? null) as Status | null,
          kebutuhanDokumen: {
            ...item.kebutuhanDokumen,
            status: item.kebutuhanDokumen.status as Status,
          },
          timAkreditasi: {
            id: item.timAkreditasi.id,
            namaTimAkreditasi: item.timAkreditasi.namaTimAkreditasi,
            createdAt: item.timAkreditasi.createdAt,
            updatedAt: item.timAkreditasi.updatedAt,
            anggota: item.timAkreditasi.userTimAkreditasi.map((item) => ({
              id: item.user.id,
              nama: item.user.nama,
              email: item.user.email,
              role: item.user.role as UserRole,
            })),
          },
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
        riwayat: {
          select: {
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
            userTimAkreditasi: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      statusRiwayat: (result.riwayat[0]?.status ?? null) as Status | null,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      timAkreditasi: {
        id: result.timAkreditasi.id,
        namaTimAkreditasi: result.timAkreditasi.namaTimAkreditasi,
        createdAt: result.timAkreditasi.createdAt,
        updatedAt: result.timAkreditasi.updatedAt,
        anggota: result.timAkreditasi.userTimAkreditasi.map((user) => ({
          id: user.user.id,
          nama: user.user.nama,
          email: user.user.email,
          role: user.user.role as UserRole,
        })),
      },
    });
  }

  //   update
  static async update(
    id: number,
    req: Omit<UpdatePicType, "keteranganUpdate">,
  ): Promise<ResponsePicType | null> {
    // destroy pj
    // call db
    const result = await prisma.pic.update({
      where: {
        id,
      },
      data: {
        ...req,
        status: "menunggu",
      },
      select: {
        id: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        riwayat: {
          select: {
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        timAkreditasi: {
          select: {
            id: true,
            namaTimAkreditasi: true,
            createdAt: true,
            updatedAt: true,
            userTimAkreditasi: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
      },
    });

    // check
    if (!result) return null;

    // return
    return toResponsePicType({
      ...result,
      status: result.status as Status,
      statusRiwayat: (result.riwayat[0]?.status ?? null) as Status | null,
      kebutuhanDokumen: {
        ...result.kebutuhanDokumen,
        status: result.kebutuhanDokumen.status as Status,
      },
      timAkreditasi: {
        id: result.timAkreditasi.id,
        namaTimAkreditasi: result.timAkreditasi.namaTimAkreditasi,
        createdAt: result.timAkreditasi.createdAt,
        updatedAt: result.timAkreditasi.updatedAt,
        anggota: result.timAkreditasi.userTimAkreditasi.map((user) => ({
          id: user.user.id,
          nama: user.user.nama,
          email: user.user.email,
          role: user.user.role as UserRole,
        })),
      },
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
            userTimAkreditasi: {
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
        },
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
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
      timAkreditasi: {
        id: result.timAkreditasi.id,
        namaTimAkreditasi: result.timAkreditasi.namaTimAkreditasi,
        anggota: result.timAkreditasi.userTimAkreditasi.map((user) => ({
          id: user.user.id,
          nama: user.user.nama,
        })),
      },
    });
  }

  // update status many
  static async updateManyStatus(
    picId: number[],
    status: Status,
  ): Promise<boolean> {
    const result = await prisma.pic.updateMany({
      where: {
        id: {
          in: picId,
        },
      },
      data: {
        status: {
          set: status,
        },
      },
    });

    return result.count > 0;
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
  //       picPj: {
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
