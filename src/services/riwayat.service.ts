import prisma from "../libs/prisma";
import {
  CreateRiwayatType,
  ResponseRiwayatType,
  toResponseRiwayatType,
} from "../models/riwayat.model";
import {
  FlagRevisi,
  JenisRiwayat,
  Status,
  UserRole,
} from "../utils/contstanst";

export class RiwayatService {
  // create
  static async create(
    data: CreateRiwayatType,
  ): Promise<ResponseRiwayatType | null> {
    const { jenis, keterangan, status, picId } = data;
    // call db
    const result = await prisma.riwayat.create({
      data: {
        jenis,
        keterangan,
        status,
        pic: picId
          ? {
              connect: {
                id: picId,
              },
            }
          : undefined,
        flagRevisi: data.flagRevisi
          ? {
              create: data.flagRevisi.map((item) => ({
                flagRevisi: item,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        flagRevisi: {
          select: {
            flagRevisi: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            namaDokumen: true,
            picTimAkreditasi: {
              include: {
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
                            email: true,
                            role: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      flagRevisi: result.flagRevisi?.map(
        (item) => item.flagRevisi as FlagRevisi,
      ) as FlagRevisi[] | null,
      status: result.status as Status,
      createdData: result.pic ? result.pic.createdAt : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            namaDokumen: result.pic.namaDokumen,
            timAkreditasi: result.pic.picTimAkreditasi.map((item) => ({
              id: item.timAkreditasi.id,
              namaTimAkreditasi: item.timAkreditasi.namaTimAkreditasi,
              anggota: item.timAkreditasi.userTimAkreditasi.map((user) => ({
                id: user.user.id,
                nama: user.user.nama,
                email: user.user.email,
                role: user.user.role as UserRole,
              })),
            })),
          }
        : null,
    });
  }

  // create many
  static async createMany(data: CreateRiwayatType[]): Promise<boolean> {
    const results = await prisma.$transaction(
      data.map((item) =>
        prisma.riwayat.create({
          data: {
            jenis: item.jenis,
            keterangan: item.keterangan,
            status: item.status,
            picId: item.picId ?? null,
            flagRevisi: {
              create:
                item.flagRevisi?.map((flag) => ({
                  flagRevisi: flag,
                })) ?? [],
            },
          },
        }),
      ),
    );

    return results.length > 0;
  }

  // read all riwayat by pic id
  static async readAllByPicId(picId: number): Promise<ResponseRiwayatType[]> {
    // call db
    const result = await prisma.riwayat.findMany({
      where: {
        picId,
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        flagRevisi: {
          select: {
            flagRevisi: true,
          },
        },
        pic: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
            picTimAkreditasi: {
              select: {
                timAkreditasi: {
                  select: {
                    id: true,
                    namaTimAkreditasi: true,
                    userTimAkreditasi: {
                      select: {
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // check result
    if (!result) return [];

    // return
    return result.map((item) =>
      toResponseRiwayatType({
        ...item,
        jenis: item.jenis as JenisRiwayat,
        flagRevisi: item.flagRevisi?.map(
          (item) => item.flagRevisi as FlagRevisi,
        ) as FlagRevisi[] | null,
        status: item.status as Status,
        createdData: item.pic ? item.pic.createdAt : null,
        highlightDataEmpy: item.pic?.namaDokumen ?? "",
        pic: item.pic
          ? {
              id: item.pic.id,
              status: item.pic.status as Status,
              namaDokumen: item.pic.namaDokumen,
              timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
                id: tim.timAkreditasi.id,
                namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
                anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
                  id: user.user.id,
                  nama: user.user.nama,
                  email: user.user.email,
                  role: user.user.role as UserRole,
                })),
              })),
            }
          : null,
      }),
    );
  }

  // find riwayat by pic id dan status
  static async findByPicIdAndStatus(
    picId: number,
    status: Status,
  ): Promise<ResponseRiwayatType[] | null> {
    // call db
    const result = await prisma.riwayat.findMany({
      where: {
        picId,
        status,
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        flagRevisi: {
          select: {
            flagRevisi: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            namaDokumen: true,
            picTimAkreditasi: {
              select: {
                timAkreditasi: {
                  select: {
                    id: true,
                    namaTimAkreditasi: true,
                    userTimAkreditasi: {
                      select: {
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
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // check result
    if (!result) return null;

    return result.map((item) =>
      toResponseRiwayatType({
        ...item,
        jenis: item.jenis as JenisRiwayat,
        flagRevisi: item.flagRevisi?.map(
          (item) => item.flagRevisi as FlagRevisi,
        ) as FlagRevisi[] | null,
        status: item.status as Status,
        createdData: item.pic ? item.pic.createdAt : null,
        highlightDataEmpy: item.pic?.namaDokumen ?? "",
        pic: item.pic
          ? {
              id: item.pic.id,
              status: item.pic.status as Status,
              namaDokumen: item.pic.namaDokumen,
              timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
                id: tim.timAkreditasi.id,
                namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
                anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
                  id: user.user.id,
                  nama: user.user.nama,
                  email: user.user.email,
                  role: user.user.role as UserRole,
                })),
              })),
            }
          : null,
      }),
    );
  }

  // read by pic id
  static async findAllRiwayatByPicId(
    picId: number,
  ): Promise<ResponseRiwayatType[] | null> {
    // call db
    const result = await prisma.riwayat.findMany({
      where: {
        pic: {
          id: picId,
        },
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        flagRevisi: {
          select: {
            flagRevisi: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            namaDokumen: true,
            picTimAkreditasi: {
              include: {
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
                            email: true,
                            role: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return result.map((item) =>
      toResponseRiwayatType({
        ...item,
        jenis: item.jenis as JenisRiwayat,
        flagRevisi: item.flagRevisi?.map(
          (item) => item.flagRevisi as FlagRevisi,
        ) as FlagRevisi[] | null,
        status: item.status as Status,
        createdData: item.pic ? item.pic.createdAt : null,
        highlightDataEmpy: item.pic?.namaDokumen ?? "",
        pic: item.pic
          ? {
              id: item.pic.id,
              status: item.pic.status as Status,
              namaDokumen: item.pic.namaDokumen,
              timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
                id: tim.timAkreditasi.id,
                namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
                anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
                  id: user.user.id,
                  nama: user.user.nama,
                  email: user.user.email,
                  role: user.user.role as UserRole,
                })),
              })),
            }
          : null,
      }),
    );
  }

  static async checkRiwayatPic(
    picId: number,
    riwayatId: number,
  ): Promise<boolean> {
    // call db
    const result = await prisma.riwayat.findFirst({
      where: {
        id: riwayatId,
        picId,
      },
    });

    // return
    return result ? true : false;
  }

  // // update riwayat pic
  // static async updateRiwayatPic(
  //   picId: number,
  //   riwayatId: number,
  //   data: UpdateRiwayatType,
  // ): Promise<ResponseRiwayatType | null> {
  //   // call api
  //   const result = await prisma.riwayat.update({
  //     where: {
  //       id: riwayatId,
  //       picId,
  //     },
  //     data: {
  //       ...data,
  //       flagRevisi: data.flagRevisi
  //         ? {
  //             create: data.flagRevisi.map((item) => ({
  //               flagRevisi: item,
  //             })),
  //           }
  //         : undefined,
  //     },
  //     select: {
  //       id: true,
  //       jenis: true,
  //       status: true,
  //       keterangan: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       flagRevisi: {
  //         select: {
  //           flagRevisi: true,
  //         },
  //       },
  //       pic: {
  //         select: {
  //           id: true,
  //           status: true,
  //           createdAt: true,
  //           kebutuhanDokumen: {
  //             select: {
  //               id: true,
  //               namaDokumen: true,
  //             },
  //           },
  //           timAkreditasi: {
  //             select: {
  //               id: true,
  //               namaTimAkreditasi: true,
  //             },
  //           },
  //           picPj: {
  //             include: {
  //               user: {
  //                 select: {
  //                   id: true,
  //                   nama: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   // check
  //   if (!result) return null;

  //   return toResponseRiwayatType({
  //     ...result,
  //     jenis: result.jenis as JenisRiwayat,
  //     status: result.status as Status,
  //     flagRevisi: result.flagRevisi?.map(
  //       (item) => item.flagRevisi as FlagRevisi,
  //     ) as FlagRevisi[] | null,
  //     createdData: result.pic ? result.pic.createdAt : null,
  //     pic: result.pic
  //       ? {
  //           id: result.pic.id,
  //           status: result.pic.status as Status,
  //           kebutuhanDokumen: {
  //             id: result.pic.kebutuhanDokumen.id,
  //             namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
  //           },
  //           timAkreditasi: {
  //             id: result.pic.timAkreditasi.id,
  //             namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
  //           },
  //           pj: result.pic.picPj.map((pj) => ({
  //             id: pj.user.id,
  //             nama: pj.user.nama,
  //           })),
  //         }
  //       : null,
  //   });
  // }

  // delete riwayat many
  static async deleteMany(id: number[]): Promise<boolean> {
    // call db
    const result = await prisma.riwayat.deleteMany({
      where: {
        id: {
          in: id,
        },
      },
    });

    return result.count > 0;
  }

  // delete pic id & id riwayat
  static async delete(data: {
    picId?: number;
    idRiwayat: number;
  }): Promise<boolean> {
    // call db
    const result = await prisma.riwayat.delete({
      where: {
        id: data.idRiwayat,
        picId: data.picId || undefined,
      },
    });

    // return
    return result ? true : false;
  }
}
