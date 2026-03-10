import { object } from "zod";
import prisma from "../libs/prisma";
import {
  DaftarDokumenBorang,
  DaftarKebutuhanDokumentasiItemType,
  KriteriaGrouped,
  PicItem,
} from "../models/dokumenBorang.model";
import { Status } from "../utils/contstanst";
import { KebutuhanDokumenService } from "./kebutuhanDokumen.service";

export class DokumenBorangService {
  // read daftar dokumen by user id
  static async readDaftarDokumen(
    userId: number,
  ): Promise<DaftarDokumenBorang[] | null> {
    // call db
    const result = await prisma.userTimAkreditasi.findMany({
      where: {
        userId,
      },
      select: {
        timAkreditasi: {
          select: {
            picTimAkreditasi: {
              select: {
                pic: {
                  select: {
                    id: true,
                    keterangan: true,
                    picDokumen: {
                      select: {
                        dokumenBorang: {
                          select: {
                            status: true,
                          },
                        },
                      },
                    },
                    kebutuhanDokumen: {
                      select: {
                        id: true,
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
                },
              },
            },
          },
        },
      },
    });

    // get count kebutuhan dokumen
    const countKebutuhanDokumen =
      await KebutuhanDokumenService.getCountKebutuhanDokumenByUserId(userId);

    // get count dokumen borang by user id and status
    const countDokumenBorangDiSetujui = await prisma.dokumenBorang.count({
      where: {
        picDokumen: {
          some: {
            pic: {
              picTimAkreditasi: {
                some: {
                  timAkreditasi: {
                    userTimAkreditasi: {
                      some: {
                        userId,
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

    // progress
    const progress =
      countDokumenBorangDiSetujui === 0
        ? 0
        : Math.floor(
            (countDokumenBorangDiSetujui / countKebutuhanDokumen) * 100,
          );
    console.log(countKebutuhanDokumen);

    // faltten pic
    const allPics: PicItem[] = result.flatMap((uta) =>
      uta.timAkreditasi.picTimAkreditasi.map((pta) => ({
        ...pta.pic,
        picDokumen: pta.pic.picDokumen.map((pd) => ({
          dokumenBorang: {
            status: pd.dokumenBorang.status as Status,
          },
        })),
      })),
    );

    // group
    const grouped = allPics.reduce<Record<number, KriteriaGrouped>>(
      (acc, pic) => {
        // destruct
        const { kriteria, pendekatan } = pic.kebutuhanDokumen;

        // kriteria id
        const kriteriaKey = kriteria.id;

        // pendekatan id
        const pendekatanKey = pendekatan.id;

        // inisialisasi kriteria jika blm ada array nya
        if (!acc[kriteriaKey]) {
          acc[kriteriaKey] = {
            kriteriaId: kriteria.id,
            namaKriteria: kriteria.namaKriteria,
            nomorKriteria: kriteria.kriteria,
            dokumenBorangStatus: pic.picDokumen.map(
              (pd) => pd.dokumenBorang.status,
            ),
            pendekatan: {},
          };
        }

        // inisialiasi pendekatan jika belum ada array nya
        if (!acc[kriteriaKey].pendekatan[pendekatanKey]) {
          acc[kriteriaKey].pendekatan[pendekatanKey] = {
            pendekatanId: pendekatan.id,
            tahap: pendekatan.tahap,
            keterangan: pendekatan.keterangan,
          };
        }

        return acc;
      },
      {},
    );
    const response = Object.values(grouped)
      .map((kriteria) => ({
        ...kriteria,
        pendekatan: Object.values(kriteria.pendekatan),
        progress,
      }))
      .sort((a, b) => a.kriteriaId - b.kriteriaId);

    return response;
  }

  //   get kebutuhan dokumentasi by user id and kriteria and pendekatan
  static async findKebutuhanDokumentasiByUserAndKriteriaAndPendekatan(
    userId: number,
    kriteria: number,
    pendekatan: string,
  ): Promise<DaftarKebutuhanDokumentasiItemType[] | null> {
    // call db
    const result = await prisma.userTimAkreditasi.findMany({
      where: {
        userId,
      },
      select: {
        timAkreditasi: {
          select: {
            picTimAkreditasi: {
              where: {
                pic: {
                  kebutuhanDokumen: {
                    kriteria: {
                      kriteria,
                    },
                    pendekatan: {
                      keterangan: pendekatan,
                    },
                  },
                },
              },
              select: {
                pic: {
                  select: {
                    id: true,
                    keterangan: true,
                    kebutuhanDokumen: {
                      select: {
                        id: true,
                        namaDokumen: true,
                      },
                    },
                    picDokumen: {
                      select: {
                        dokumenBorang: {
                          select: {
                            status: true,
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

    // flattmap
    const allKebutuhanDokumenAndStatus: DaftarKebutuhanDokumentasiItemType[] =
      result.flatMap((uta) =>
        uta.timAkreditasi.picTimAkreditasi.map((pta) => ({
          kebutuhanDokumen: {
            id: pta.pic.kebutuhanDokumen.id,
            namaDokumen: pta.pic.kebutuhanDokumen.namaDokumen,
          },
          dokumenBorangStatus: pta.pic.picDokumen.map(
            (pd) => pd.dokumenBorang.status as Status,
          ),
        })),
      );

    return allKebutuhanDokumenAndStatus;
  }
}
