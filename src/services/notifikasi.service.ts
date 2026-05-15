import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  ResponseNotifikasiType,
  ResponseNotifikasiWithMetaType,
  toResponseNotifikasiWithMetaType,
} from "../models/notifikasi.model";
import { toResponseRiwayatType } from "../models/riwayat.model";
import dosenRoute from "../routes/dosen.route";
import { PaginationType } from "../types/pagination";
import { DosenRole, SortOrder, Status, TipeRiwayat } from "../utils/contstanst";

export class NotifikasiService {
  // get notifikasi by role
  static async getNotifikasiByRole(params: {
    query: PaginationType & { isRead?: boolean };
    role: DosenRole;
  }): Promise<ResponseNotifikasiWithMetaType | null> {
    const {
      role,
      query: { limit = 8, page = 1, search, sort, isRead },
    } = params;

    // get current page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.RiwayatWhereInput = {
      ...(isRead && { isRead: isRead }),
      ...(role === DosenRole.kaprodi && {
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
            status: { in: [Status.REVISION, Status.APPROVED] },
          },
        ],
      }),

      // wakil dekan
      ...(role === DosenRole.wakil_dekan_1 && {
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

    // notifikasi
    let keterangan_notifikasi: string = "";
    let kriteriId: number | null = null;
    let pendekatanId: number | null = null;
    let kebutuhanDokumentasiId: number | null = null;

    // kebutuhan dokumentasi
    if (result.find((item) => item.kebutuhan_dokumentasi_pic)) {
      kriteriId =
        result.find((item) => item.kebutuhan_dokumentasi_pic)
          ?.kebutuhan_dokumentasi_pic?.kriteria_id || null;
      pendekatanId =
        result.find((item) => item.kebutuhan_dokumentasi_pic)
          ?.kebutuhan_dokumentasi_pic?.pendekatan_id || null;
      kebutuhanDokumentasiId =
        result.find((item) => item.kebutuhan_dokumentasi_pic)
          ?.kebutuhan_dokumentasi_pic?.id || null;

      if (role === DosenRole.kaprodi) {
        keterangan_notifikasi =
          "Kebutuhan Dokumentasi Borang sudah diverifikasi oleh Wakil Dekan 1";
      }

      if (role === DosenRole.wakil_dekan_1) {
        if (result.find((item) => item.kebutuhan_dokumentasi_pic)) {
          keterangan_notifikasi =
            "Kaprodi mengajukan kebutuhan dokumentasi, harap lakukan verifikasi";
        }
      }
    }

    // dokumentasi borang
    if (result.find((item) => item.dokumentasi_borang)) {
      kriteriId =
        result.find((item) => item.dokumentasi_borang)?.dokumentasi_borang
          ?.kebutuhan_dokumentasi.kriteria_id || null;
      pendekatanId =
        result.find((item) => item.dokumentasi_borang)?.dokumentasi_borang
          ?.kebutuhan_dokumentasi.pendekatan_id || null;
      kebutuhanDokumentasiId =
        result.find((item) => item.dokumentasi_borang)?.dokumentasi_borang
          ?.kebutuhan_dokumentasi.id || null;

      if (role === DosenRole.tim_akreditasi) {
        keterangan_notifikasi =
          "Dokumentasi Borang sudah diverifikasi oleh Kaprodi";
      }

      if (role === DosenRole.kaprodi) {
        keterangan_notifikasi =
          "Dokumentasi Borang diajukan oleh tim akreditasi, harap lakukan verifikasi";
      }
    }

    return toResponseNotifikasiWithMetaType({
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
      data: result.map((item) => ({
        id: item.id,
        dosen: item.dosen,
        keterangan_notifikasi: keterangan_notifikasi,
        status: item.status as Status,
        tipe_notifikasi: item.tipe_riwayat as TipeRiwayat,
        isRead: item.isRead,
        kriteria_id: kriteriId ?? 0,
        pendekatan_id: pendekatanId ?? 0,
        kebutuhan_dokumentasi_id: kebutuhanDokumentasiId ?? 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
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
}
