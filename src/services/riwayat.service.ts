import prisma from "../libs/prisma";
import { ResponseKriteriaPicType } from "../models/kriteriaPic.model";
import {
  CreateRiwayatDokumentasiBorangType,
  CreateRiwayatKebutuhanDokumentasiPicType,
  ResponseRiwayatType,
  toResponseRiwayatType,
  UpdateRiwayatDokumentasiBorangType,
  UpdateRiwayatKebutuhanDokumentasiPicType,
} from "../models/riwayat.model";
import {
  TipeDokumentasi,
  Status,
  DosenRole,
  TipeRiwayat,
} from "../utils/contstanst";

export class RiwayatService {
  // create
  static async createForKebutuhanDokumentasiPic(
    data: CreateRiwayatKebutuhanDokumentasiPicType,
  ): Promise<ResponseRiwayatType | null> {
    const { tipe_riwayat, keterangan, kebutuhan_dokumentasi_pic_id, status } =
      data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.kebutuhanDokumentasi.update({
        where: {
          id: kebutuhan_dokumentasi_pic_id,
        },
        data: {
          status,
        },
      });

      // create riwayat
      const riwayat = await tx.riwayat.create({
        data: {
          tipe_riwayat,
          keterangan,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
          status,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // update riwayat
  static async updateForKebutuhanDokumentasiPic(params: {
    riwayat_id: number;
    data: UpdateRiwayatKebutuhanDokumentasiPicType;
  }): Promise<ResponseRiwayatType | null> {
    const { riwayat_id, data } = params;
    const { keterangan, kebutuhan_dokumentasi_pic_id, status } = data;

    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      if (status) {
        await tx.kebutuhanDokumentasi.update({
          where: {
            id: kebutuhan_dokumentasi_pic_id,
          },
          data: {
            status,
          },
        });
      }

      // create riwayat
      const riwayat = await tx.riwayat.update({
        where: {
          id: riwayat_id,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
        },
        data: {
          keterangan,
          status,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find all by kebutuhan dokumentasi id
  static async findAllRiwayatByKebutuhanDokumentasiOrDokumentasiBorang(data: {
    id: number;
    tipe_riwayat: TipeRiwayat;
  }): Promise<ResponseRiwayatType[]> {
    // get data
    const { id, tipe_riwayat } = data;
    // call db
    const result = await prisma.riwayat.findMany({
      where: {
        OR: [
          {
            kebutuhan_dokumentasi_id:
              tipe_riwayat === TipeRiwayat.KEBUTUHAN_DOKUMENTASI
                ? id
                : undefined,
          },
          {
            dokumentasi_borang_id:
              tipe_riwayat === TipeRiwayat.DOKUMENTASI_BORANG ? id : undefined,
          },
        ],
      },
      select: {
        id: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            id: true,
          },
        },
        dokumentasi_borang: {
          select: {
            id: true,
          },
        },
        status: true,
        tipe_riwayat: true,
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return result.map((item) =>
      toResponseRiwayatType({
        id: item.id,
        kebutuhan_dokumentasi_pic_id: item.kebutuhan_dokumentasi_pic?.id,
        dokumentasi_borang_id: item.dokumentasi_borang?.id,
        status: item.status as Status,
        tipe_riwayat: item.tipe_riwayat as TipeRiwayat,
        keterangan: item.keterangan,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }),
    );
  }

  // create dokumentasi borang
  static async createForDokumentasiBorang(
    data: CreateRiwayatDokumentasiBorangType,
  ): Promise<ResponseRiwayatType | null> {
    const { tipe_riwayat, keterangan, dokumentasi_borang_id, status } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.dokumentasiBorang.update({
        where: {
          id: dokumentasi_borang_id,
        },
        data: {
          status,
        },
      });

      // update active file
      await tx.fileDokumen.updateMany({
        where: {
          dokumentasi_borang_files: {
            some: {
              dokumentasi_borang_id,
            },
          },
        },
        data: {
          ...(status === Status.REVISION && { is_active: false }),
          ...(status === Status.APPROVED && { is_active: true }),
        },
      });

      // create riwayat
      const riwayat = await tx.riwayat.create({
        data: {
          tipe_riwayat,
          keterangan,
          dokumentasi_borang_id: dokumentasi_borang_id,
          status,
        },
        select: {
          id: true,
          dokumentasi_borang: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // create dokumentasi borang
  static async createManyForDokumentasiBorang(
    data: Omit<CreateRiwayatDokumentasiBorangType, "dokumentasi_borang_id"> & {
      dokumentasi_borang_ids: number[];
    },
  ): Promise<number | null> {
    const { tipe_riwayat, keterangan, dokumentasi_borang_ids, status } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.dokumentasiBorang.updateMany({
        where: {
          id: {
            in: dokumentasi_borang_ids,
          },
        },
        data: {
          status,
        },
      });

      // update active file
      await tx.fileDokumen.updateMany({
        where: {
          dokumentasi_borang_files: {
            some: {
              dokumentasi_borang_id: {
                in: dokumentasi_borang_ids,
              },
            },
          },
        },
        data: {
          is_active: true,
        },
      });

      // create riwayat
      const createRiwayat = await tx.riwayat.createMany({
        data: dokumentasi_borang_ids.map((dokumentasi_borang_id) => ({
          tipe_riwayat,
          keterangan,
          dokumentasi_borang_id: dokumentasi_borang_id,
          status,
        })),
      });

      return createRiwayat;
    });

    return result.count;
  }

  static async updateForDokumentasiBorang(params: {
    riwayat_id: number;
    data: UpdateRiwayatDokumentasiBorangType;
  }): Promise<ResponseRiwayatType | null> {
    const { riwayat_id, data } = params;
    const { dokumentasi_borang_id, keterangan, status } = data;

    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      if (dokumentasi_borang_id) {
        await tx.dokumentasiBorang.update({
          where: {
            id: dokumentasi_borang_id,
          },
          data: {
            status,
          },
        });
      }

      // if revision
      if (status === Status.REVISION) {
        // update active file
        await tx.fileDokumen.updateMany({
          where: {
            dokumentasi_borang_files: {
              some: {
                dokumentasi_borang_id,
              },
            },
          },
          data: {
            is_active: false,
          },
        });
      }

      // if approved
      if (status === Status.APPROVED) {
        // update active file
        await tx.fileDokumen.updateMany({
          where: {
            dokumentasi_borang_files: {
              some: {
                dokumentasi_borang_id,
              },
            },
          },
          data: {
            is_active: true,
          },
        });
      }

      // create riwayat
      const riwayat = await tx.riwayat.update({
        where: {
          id: riwayat_id,
          dokumentasi_borang_id,
        },
        data: {
          keterangan,
          status,
        },
        select: {
          id: true,
          dokumentasi_borang: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find by id riwayat and tipe riwayat
  static async findById(params: {
    id: number;
    tipe_riwayat: TipeRiwayat;
  }): Promise<ResponseRiwayatType | null> {
    // get params
    const { id, tipe_riwayat } = params;

    const result = await prisma.riwayat.findUnique({
      where: {
        id,
        tipe_riwayat,
      },
      select: {
        id: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            id: true,
          },
        },
        dokumentasi_borang: {
          select: {
            id: true,
          },
        },
        status: true,
        tipe_riwayat: true,
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!result) return null;

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // // create many
  // static async createMany(data: CreateRiwayatType[]): Promise<boolean> {
  //   const results = await prisma.$transaction(
  //     data.map((item) =>
  //       prisma.riwayat.create({
  //         data: {
  //           jenis: item.jenis,
  //           keterangan: item.keterangan,
  //           status: item.status,
  //           picId: item.picId ?? null,
  //         },
  //       }),
  //     ),
  //   );

  //   return results.length > 0;
  // }

  // // read all riwayat by pic id
  // static async readAllByPicId(picId: number): Promise<ResponseRiwayatType[]> {
  //   // call db
  //   const result = await prisma.riwayat.findMany({
  //     where: {
  //       picId,
  //     },
  //     select: {
  //       id: true,
  //       jenis: true,
  //       status: true,
  //       keterangan: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       pic: {
  //         select: {
  //           id: true,
  //           namaDokumen: true,
  //           status: true,
  //           createdAt: true,
  //           picTimAkreditasi: {
  //             select: {
  //               timAkreditasi: {
  //                 select: {
  //                   id: true,
  //                   namaTimAkreditasi: true,
  //                   userTimAkreditasi: {
  //                     select: {
  //                       user: {
  //                         select: {
  //                           id: true,
  //                           nama: true,
  //                           email: true,
  //                           role: true,
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     orderBy: {
  //       createdAt: "asc",
  //     },
  //   });

  //   // check result
  //   if (!result) return [];

  //   // return
  //   return result.map((item) =>
  //     toResponseRiwayatType({
  //       ...item,
  //       jenis: item.jenis as JenisRiwayat,
  //       status: item.status as Status,
  //       createdData: item.pic ? item.pic.createdAt : null,
  //       highlightDataEmpy: item.pic?.namaDokumen ?? "",
  //       pic: item.pic
  //         ? {
  //             id: item.pic.id,
  //             status: item.pic.status as Status,
  //             namaDokumen: item.pic.namaDokumen,
  //             timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
  //               id: tim.timAkreditasi.id,
  //               namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
  //               anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
  //                 id: user.user.id,
  //                 nama: user.user.nama,
  //                 email: user.user.email,
  //                 role: user.user.role as UserRole,
  //               })),
  //             })),
  //           }
  //         : null,
  //     }),
  //   );
  // }

  // // find riwayat by pic id dan status
  // static async findByPicIdAndStatus(
  //   picId: number,
  //   status: Status,
  // ): Promise<ResponseRiwayatType[] | null> {
  //   // call db
  //   const result = await prisma.riwayat.findMany({
  //     where: {
  //       picId,
  //       status,
  //     },
  //     select: {
  //       id: true,
  //       jenis: true,
  //       status: true,
  //       keterangan: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       pic: {
  //         select: {
  //           id: true,
  //           status: true,
  //           createdAt: true,
  //           namaDokumen: true,
  //           picTimAkreditasi: {
  //             select: {
  //               timAkreditasi: {
  //                 select: {
  //                   id: true,
  //                   namaTimAkreditasi: true,
  //                   userTimAkreditasi: {
  //                     select: {
  //                       user: {
  //                         select: {
  //                           id: true,
  //                           nama: true,
  //                           email: true,
  //                           role: true,
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     orderBy: { createdAt: "desc" },
  //   });

  //   // check result
  //   if (!result) return null;

  //   return result.map((item) =>
  //     toResponseRiwayatType({
  //       ...item,
  //       jenis: item.jenis as JenisRiwayat,
  //       status: item.status as Status,
  //       createdData: item.pic ? item.pic.createdAt : null,
  //       highlightDataEmpy: item.pic?.namaDokumen ?? "",
  //       pic: item.pic
  //         ? {
  //             id: item.pic.id,
  //             status: item.pic.status as Status,
  //             namaDokumen: item.pic.namaDokumen,
  //             timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
  //               id: tim.timAkreditasi.id,
  //               namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
  //               anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
  //                 id: user.user.id,
  //                 nama: user.user.nama,
  //                 email: user.user.email,
  //                 role: user.user.role as UserRole,
  //               })),
  //             })),
  //           }
  //         : null,
  //     }),
  //   );
  // }

  // // read by pic id
  // static async findAllRiwayatByPicId(
  //   picId: number,
  // ): Promise<ResponseRiwayatType[] | null> {
  //   // call db
  //   const result = await prisma.riwayat.findMany({
  //     where: {
  //       pic: {
  //         id: picId,
  //       },
  //     },
  //     select: {
  //       id: true,
  //       jenis: true,
  //       status: true,
  //       keterangan: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       pic: {
  //         select: {
  //           id: true,
  //           status: true,
  //           createdAt: true,
  //           namaDokumen: true,
  //           picTimAkreditasi: {
  //             include: {
  //               timAkreditasi: {
  //                 select: {
  //                   id: true,
  //                   namaTimAkreditasi: true,
  //                   userTimAkreditasi: {
  //                     include: {
  //                       user: {
  //                         select: {
  //                           id: true,
  //                           nama: true,
  //                           email: true,
  //                           role: true,
  //                         },
  //                       },
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   return result.map((item) =>
  //     toResponseRiwayatType({
  //       ...item,
  //       jenis: item.jenis as JenisRiwayat,
  //       status: item.status as Status,
  //       createdData: item.pic ? item.pic.createdAt : null,
  //       highlightDataEmpy: item.pic?.namaDokumen ?? "",
  //       pic: item.pic
  //         ? {
  //             id: item.pic.id,
  //             status: item.pic.status as Status,
  //             namaDokumen: item.pic.namaDokumen,
  //             timAkreditasi: item.pic.picTimAkreditasi.map((tim) => ({
  //               id: tim.timAkreditasi.id,
  //               namaTimAkreditasi: tim.timAkreditasi.namaTimAkreditasi,
  //               anggota: tim.timAkreditasi.userTimAkreditasi.map((user) => ({
  //                 id: user.user.id,
  //                 nama: user.user.nama,
  //                 email: user.user.email,
  //                 role: user.user.role as UserRole,
  //               })),
  //             })),
  //           }
  //         : null,
  //     }),
  //   );
  // }

  // static async checkRiwayatPic(
  //   picId: number,
  //   riwayatId: number,
  // ): Promise<boolean> {
  //   // call db
  //   const result = await prisma.riwayat.findFirst({
  //     where: {
  //       id: riwayatId,
  //       picId,
  //     },
  //   });

  //   // return
  //   return result ? true : false;
  // }

  // // // update riwayat pic
  // // static async updateRiwayatPic(
  // //   picId: number,
  // //   riwayatId: number,
  // //   data: UpdateRiwayatType,
  // // ): Promise<ResponseRiwayatType | null> {
  // //   // call api
  // //   const result = await prisma.riwayat.update({
  // //     where: {
  // //       id: riwayatId,
  // //       picId,
  // //     },
  // //     data: {
  // //       ...data,
  // //       flagRevisi: data.flagRevisi
  // //         ? {
  // //             create: data.flagRevisi.map((item) => ({
  // //               flagRevisi: item,
  // //             })),
  // //           }
  // //         : undefined,
  // //     },
  // //     select: {
  // //       id: true,
  // //       jenis: true,
  // //       status: true,
  // //       keterangan: true,
  // //       createdAt: true,
  // //       updatedAt: true,
  // //       flagRevisi: {
  // //         select: {
  // //           flagRevisi: true,
  // //         },
  // //       },
  // //       pic: {
  // //         select: {
  // //           id: true,
  // //           status: true,
  // //           createdAt: true,
  // //           kebutuhanDokumen: {
  // //             select: {
  // //               id: true,
  // //               namaDokumen: true,
  // //             },
  // //           },
  // //           timAkreditasi: {
  // //             select: {
  // //               id: true,
  // //               namaTimAkreditasi: true,
  // //             },
  // //           },
  // //           picPj: {
  // //             include: {
  // //               user: {
  // //                 select: {
  // //                   id: true,
  // //                   nama: true,
  // //                 },
  // //               },
  // //             },
  // //           },
  // //         },
  // //       },
  // //     },
  // //   });

  // //   // check
  // //   if (!result) return null;

  // //   return toResponseRiwayatType({
  // //     ...result,
  // //     jenis: result.jenis as JenisRiwayat,
  // //     status: result.status as Status,
  // //     flagRevisi: result.flagRevisi?.map(
  // //       (item) => item.flagRevisi as FlagRevisi,
  // //     ) as FlagRevisi[] | null,
  // //     createdData: result.pic ? result.pic.createdAt : null,
  // //     pic: result.pic
  // //       ? {
  // //           id: result.pic.id,
  // //           status: result.pic.status as Status,
  // //           kebutuhanDokumen: {
  // //             id: result.pic.kebutuhanDokumen.id,
  // //             namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
  // //           },
  // //           timAkreditasi: {
  // //             id: result.pic.timAkreditasi.id,
  // //             namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
  // //           },
  // //           pj: result.pic.picPj.map((pj) => ({
  // //             id: pj.user.id,
  // //             nama: pj.user.nama,
  // //           })),
  // //         }
  // //       : null,
  // //   });
  // // }

  // // delete riwayat many
  // static async deleteMany(id: number[]): Promise<boolean> {
  //   // call db
  //   const result = await prisma.riwayat.deleteMany({
  //     where: {
  //       id: {
  //         in: id,
  //       },
  //     },
  //   });

  //   return result.count > 0;
  // }

  // // delete pic id & id riwayat
  // static async delete(data: {
  //   picId?: number;
  //   idRiwayat: number;
  // }): Promise<boolean> {
  //   // call db
  //   const result = await prisma.riwayat.delete({
  //     where: {
  //       id: data.idRiwayat,
  //       picId: data.picId || undefined,
  //     },
  //   });

  //   // return
  //   return result ? true : false;
  // }
}
