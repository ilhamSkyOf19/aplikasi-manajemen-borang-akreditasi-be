import prisma from "../libs/prisma";
import {
  CreateRiwayatType,
  ResponseRiwayatType,
  toResponseRiwayatType,
  UpdateRiwayatType,
} from "../models/riwayat.model";
import { JenisRiwayat, Status } from "../utils/contstanst";

export class RiwayatService {
  // create
  static async create(
    data: CreateRiwayatType,
  ): Promise<ResponseRiwayatType | null> {
    const { jenis, keterangan, status, kebutuhanDokumenId, picId } = data;
    // call db
    const result = await prisma.riwayat.create({
      data: {
        jenis,
        keterangan,
        status,
        kebutuhanDokumen: kebutuhanDokumenId
          ? {
              connect: {
                id: kebutuhanDokumenId,
              },
            }
          : undefined,
        pic: picId
          ? {
              connect: {
                id: picId,
              },
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
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
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
        },
      },
    });

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      status: result.status as Status,
      createdData: result.kebutuhanDokumen
        ? result.kebutuhanDokumen.createdAt
        : result.pic
          ? result.pic.createdAt
          : null,
      kebutuhanDokumen: result.kebutuhanDokumen
        ? {
            ...result.kebutuhanDokumen,
            status: result.kebutuhanDokumen.status as Status,
          }
        : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            kebutuhanDokumen: {
              id: result.pic.kebutuhanDokumen.id,
              namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
            },
            timAkreditasi: {
              id: result.pic.timAkreditasi.id,
              namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
            },
            pj: result.pic.pj.map((pj) => ({
              id: pj.user.id,
              nama: pj.user.nama,
            })),
          }
        : null,
    });
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
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
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
        },
      },
    });

    // check result
    if (!result) return [];

    // return
    return result.map((item) =>
      toResponseRiwayatType({
        ...item,
        jenis: item.jenis as JenisRiwayat,
        status: item.status as Status,
        createdData: item.kebutuhanDokumen
          ? item.kebutuhanDokumen.createdAt
          : item.pic
            ? item.pic.createdAt
            : null,
        highlightDataEmpy: item.kebutuhanDokumen?.namaDokumen
          ? item.kebutuhanDokumen?.namaDokumen
          : item.pic?.kebutuhanDokumen?.namaDokumen
            ? item.pic?.kebutuhanDokumen?.namaDokumen
            : "",
        kebutuhanDokumen: item.kebutuhanDokumen
          ? {
              ...item.kebutuhanDokumen,
              status: item.kebutuhanDokumen.status as Status,
            }
          : null,
        pic: item.pic
          ? {
              id: item.pic.id,
              status: item.pic.status as Status,
              kebutuhanDokumen: {
                id: item.pic.kebutuhanDokumen.id,
                namaDokumen: item.pic.kebutuhanDokumen.namaDokumen,
              },
              timAkreditasi: {
                id: item.pic.timAkreditasi.id,
                namaTimAkreditasi: item.pic.timAkreditasi.namaTimAkreditasi,
              },
              pj: item.pic.pj.map((pj) => ({
                id: pj.user.id,
                nama: pj.user.nama,
              })),
            }
          : null,
      }),
    );
  }

  // find riwayat by pic id dan status
  static async findByPicIdAndStatus(picId: number, status: Status) {
    // call db
    const result = await prisma.riwayat.findFirst({
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
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
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
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      status: result.status as Status,
      createdData: result.kebutuhanDokumen
        ? result.kebutuhanDokumen.createdAt
        : result.pic
          ? result.pic.createdAt
          : null,
      kebutuhanDokumen: result.kebutuhanDokumen
        ? {
            ...result.kebutuhanDokumen,
            status: result.kebutuhanDokumen.status as Status,
          }
        : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            kebutuhanDokumen: {
              id: result.pic.kebutuhanDokumen.id,
              namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
            },
            timAkreditasi: {
              id: result.pic.timAkreditasi.id,
              namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
            },
            pj: result.pic.pj.map((pj) => ({
              id: pj.user.id,
              nama: pj.user.nama,
            })),
          }
        : null,
    });
  }

  // update riwayat pic
  static async updateRiwayatPic(
    picId: number,
    riwayatId: number,
    data: UpdateRiwayatType,
  ): Promise<ResponseRiwayatType | null> {
    // call api
    const result = await prisma.riwayat.update({
      where: {
        id: riwayatId,
        picId,
      },
      data,
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
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
        },
      },
    });

    // check
    if (!result) return null;

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      status: result.status as Status,
      createdData: result.kebutuhanDokumen
        ? result.kebutuhanDokumen.createdAt
        : result.pic
          ? result.pic.createdAt
          : null,
      kebutuhanDokumen: result.kebutuhanDokumen
        ? {
            ...result.kebutuhanDokumen,
            status: result.kebutuhanDokumen.status as Status,
          }
        : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            kebutuhanDokumen: {
              id: result.pic.kebutuhanDokumen.id,
              namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
            },
            timAkreditasi: {
              id: result.pic.timAkreditasi.id,
              namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
            },
            pj: result.pic.pj.map((pj) => ({
              id: pj.user.id,
              nama: pj.user.nama,
            })),
          }
        : null,
    });
  }

  // check riwayat pic
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

  // delete pic id & id riwayat
  static async delete(data: {
    picId: number;
    idRiwayat: number;
  }): Promise<boolean> {
    // call db
    const result = await prisma.riwayat.delete({
      where: {
        id: data.idRiwayat,
        picId: data.picId,
      },
    });

    // return
    return result ? true : false;
  }

  // Kebutuhan dokumentasi

  // find riwayat by pic id dan status
  static async findByKebutuhanDokumenIdAndStatus(
    kebutuhanDokumenId: number,
    status: Status,
  ) {
    // call db
    const result = await prisma.riwayat.findFirst({
      where: {
        kebutuhanDokumenId,
        status,
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
            createdAt: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
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
        },
      },
    });

    // check result
    if (!result) return null;

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      status: result.status as Status,
      createdData: result.kebutuhanDokumen
        ? result.kebutuhanDokumen.createdAt
        : result.pic
          ? result.pic.createdAt
          : null,
      kebutuhanDokumen: result.kebutuhanDokumen
        ? {
            ...result.kebutuhanDokumen,
            status: result.kebutuhanDokumen.status as Status,
          }
        : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            kebutuhanDokumen: {
              id: result.pic.kebutuhanDokumen.id,
              namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
            },
            timAkreditasi: {
              id: result.pic.timAkreditasi.id,
              namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
            },
            pj: result.pic.pj.map((pj) => ({
              id: pj.user.id,
              nama: pj.user.nama,
            })),
          }
        : null,
    });
  }

  // delete kebutuhan dokumen id & id riwayat
  static async deleteRiwayatKebutuhanDokumen(data: {
    kebutuhanDokumenId: number;
    idRiwayat: number;
  }): Promise<boolean> {
    // call db
    const result = await prisma.riwayat.delete({
      where: {
        id: data.idRiwayat,
        kebutuhanDokumenId: data.kebutuhanDokumenId,
      },
    });

    // return
    return !!result;
  }
}
