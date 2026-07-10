import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponseNotifikasiType,
  ResponseNotifikasiWithMetaType,
  toResponseNotifikasiWithMetaType,
} from "../models/notifikasi.model";
import { PaginationType } from "../types/pagination";
import { DosenRole, SortOrder, Status, TipeRiwayat } from "../utils/contstanst";

export class NotifikasiService {
  // get notifikasi by role
  static async getNotifikasiByRole(params: {
    query: PaginationType & { isRead?: boolean };
    role: DosenRole;
    dosenId?: number;
    periodeId?: number;
  }): Promise<ResponseNotifikasiWithMetaType | null> {
    const {
      role,
      periodeId,
      dosenId,
      query: { limit = 8, page = 1, search, sort, isRead },
    } = params;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.RiwayatWhereInput = {
      ...(periodeId && {
        kebutuhan_dokumentasi_pic: {
          kriteria: {
            periode_id: periodeId,
          },
        },
      }),
      ...(isRead && { isRead: isRead }),
      ...(search && { dosen: { nama: { contains: search } } }),
      ...(role === DosenRole.kaprodi && {
        // riwayat dibuat oleh kaprodi
        dosen: {
          dosenRole: {
            some: {
              role: {
                in: [DosenRole.wakil_dekan_1, DosenRole.tim_akreditasi],
              },
            },
          },
        },
        OR: [
          {
            tipe_riwayat: TipeRiwayat.DOKUMENTASI_BORANG,
            status: Status.PENDING,
          },
          {
            tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
            status: {
              in: [Status.REVISION, Status.APPROVED],
            },
          },
        ],
      }),

      ...(role === DosenRole.tim_akreditasi && {
        AND: [
          {
            tipe_riwayat: TipeRiwayat.DOKUMENTASI_BORANG,
            status: {
              in: [Status.REVISION, Status.APPROVED],
            },

            // riwayat dibuat oleh kaprodi
            dosen: {
              dosenRole: {
                some: {
                  role: DosenRole.kaprodi,
                },
              },
            },

            dokumentasi_borang: {
              kebutuhan_dokumentasi: {
                kriteria: {
                  kriteriaPic: {
                    some: {
                      dosen_id: dosenId,
                    },
                  },
                },
              },
            },
          },
        ],
      }),

      // wakil dekan
      ...(role === DosenRole.wakil_dekan_1 && {
        dosen: {
          dosenRole: {
            some: {
              role: DosenRole.kaprodi,
            },
          },
        },
        tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
        status: Status.PENDING,
      }),
    };

    // get count data
    const totalData = await prisma.riwayat.count({ where: conditional });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.riwayat.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      select: {
        id: true,
        dokumentasi_borang: {
          select: {
            kebutuhan_dokumentasi: {
              select: {
                id: true,
                kriteria_id: true,
                pendekatan_id: true,
              },
            },
          },
        },
        kebutuhan_dokumentasi_pic: {
          select: {
            id: true,
            kriteria_id: true,
            pendekatan_id: true,
            status: true,
          },
        },
        dosen: {
          select: {
            nama: true,
          },
        },
        isRead: true,
        status: true,
        tipe_riwayat: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: sort ? (sort as SortOrder) : "asc",
      },
    });

    return toResponseNotifikasiWithMetaType({
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },

      data: result.map((item) => {
        let keterangan_notifikasi = "";
        let kriteriId: number | null = null;
        let pendekatanId: number | null = null;
        let kebutuhanDokumentasiId: number | null = null;

        // kebutuhan dokumentasi
        if (item.kebutuhan_dokumentasi_pic) {
          kriteriId = item.kebutuhan_dokumentasi_pic.kriteria_id;
          pendekatanId = item.kebutuhan_dokumentasi_pic.pendekatan_id;
          kebutuhanDokumentasiId = item.kebutuhan_dokumentasi_pic.id;

          if (role === DosenRole.kaprodi) {
            keterangan_notifikasi =
              "Kebutuhan Dokumentasi sudah diverifikasi oleh Wakil Dekan 1";
          }

          if (role === DosenRole.wakil_dekan_1) {
            keterangan_notifikasi =
              "Kaprodi mengajukan kebutuhan dokumentasi, harap lakukan verifikasi";
          }
        }

        // dokumentasi borang
        if (item.dokumentasi_borang) {
          kriteriId = item.dokumentasi_borang.kebutuhan_dokumentasi.kriteria_id;

          pendekatanId =
            item.dokumentasi_borang.kebutuhan_dokumentasi.pendekatan_id;

          kebutuhanDokumentasiId =
            item.dokumentasi_borang.kebutuhan_dokumentasi.id;

          if (role === DosenRole.tim_akreditasi) {
            keterangan_notifikasi =
              "Dokumentasi Borang sudah diverifikasi oleh Kaprodi";
          }

          if (role === DosenRole.kaprodi) {
            keterangan_notifikasi =
              "Dokumentasi Borang diajukan oleh tim akreditasi, harap lakukan verifikasi";
          }
        }

        return {
          id: item.id,
          dosen: item.dosen,
          keterangan_notifikasi,
          status: item.status as Status,
          tipe_notifikasi: item.tipe_riwayat as TipeRiwayat,
          isRead: item.isRead,
          kriteria_id: kriteriId ?? 0,
          pendekatan_id: pendekatanId ?? 0,
          kebutuhan_dokumentasi_id: kebutuhanDokumentasiId ?? 0,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }),
    });
  }

  // isRead
  static async isRead(id: number): Promise<ResponseNotifikasiType | null> {
    // call db
    const result = await prisma.riwayat.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
      select: {
        id: true,
        isRead: true,
      },
    });

    return result;
  }

  // static async isReadFalse(id: number): Promise<ResponseNotifikasiType | null> {
  //   // call db
  //   const result = await prisma.riwayat.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       isRead: false,
  //     },
  //     select: {
  //       id: true,
  //       isRead: true,
  //     },
  //   });

  //   return result;
  // }
}
