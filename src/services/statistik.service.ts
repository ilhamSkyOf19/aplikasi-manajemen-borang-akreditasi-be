import prisma from "../libs/prisma";
import {
  GrafikKriteriaType,
  namaPendekatanArray,
  NamaPendekatanType,
  PendekatanType,
  ResponseStatistikTimAkreditasiType,
  ResponseStatistikType,
} from "../models/statistik.model";
import { Status } from "../utils/contstanst";

export class StatistikService {
  // get statistik
  static async getStatistik(params: {
    periode_id?: number;
  }): Promise<ResponseStatistikType | null> {
    const { periode_id } = params;

    // get kriteria count
    const total_kriteria = periode_id
      ? await prisma.kriteria.count({
          where: {
            periode_id,
          },
        })
      : null;

    // get dosen count
    const total_dosen = await prisma.dosen.count();

    // get dokumentasi count
    const total_dokumentasi = periode_id
      ? await prisma.kebutuhanDokumentasi.count({
          where: {
            kriteria: {
              periode_id,
            },
          },
        })
      : null;

    // get dokumentasi selesai
    const total_dokumentasi_borang_selesai = periode_id
      ? await prisma.dokumentasiBorang.count({
          where: {
            status: Status.APPROVED,
            kebutuhan_dokumentasi: {
              kriteria: {
                periode_id,
              },
            },
          },
        })
      : null;

    // total file selesai count
    const total_file_selesai = periode_id
      ? await prisma.dokumentasiBorangFile.count({
          where: {
            dokumentasi_borang: {
              status: Status.APPROVED,
              kebutuhan_dokumentasi: {
                kriteria: {
                  periode_id,
                },
              },
            },
          },
        })
      : null;

    // grafik kriteria
    const get_grafik_kriteria = periode_id
      ? await prisma.kriteria.findMany({
          where: {
            periode_id,
          },
          select: {
            id: true,
            kode_kriteria: true,
            nama_kriteria: true,
            kriteriaPic: {
              select: {
                dosen: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    nidn: true,
                  },
                },
              },
            },
            kebutuhan_dokumentasi: {
              select: {
                pendekatan: {
                  select: {
                    keterangan: true,
                    kebutuhan_dokumentasi: {
                      where: {
                        status: Status.APPROVED,
                      },
                      select: {
                        dokumentasi_borang: {
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
        })
      : null;

    // grouped pendekatan
    const groupedPendekatan = new Map<number, GrafikKriteriaType>();

    // loop kriteria
    if (periode_id && get_grafik_kriteria) {
      for (const kriteria of get_grafik_kriteria) {
        // get kriteria id
        const kriteriaId = kriteria.kode_kriteria;

        const pendekatanResult: PendekatanType[] = [];

        //   mapping pendekatan
        for (const pendekatan of namaPendekatanArray) {
          const findPendekatan = kriteria.kebutuhan_dokumentasi.find(
            (item) => item.pendekatan.keterangan === pendekatan,
          );

          if (
            !findPendekatan ||
            findPendekatan.pendekatan.kebutuhan_dokumentasi.length === 0
          ) {
            pendekatanResult.push({
              nama_pendekatan: pendekatan as NamaPendekatanType,
              dokumentasi_borang_total: 0,
              dokumentasi_borang_approve: 0,
              dokumentasi_pending: 0,
              dokumentasi_revisi: 0,
            });

            continue;
          }

          // get total dokumentasi selesai
          const totalDokumentasiApprove =
            findPendekatan?.pendekatan.kebutuhan_dokumentasi.filter(
              (item) => item.dokumentasi_borang?.status === Status.APPROVED,
            ).length;

          // get total dokumentasi selesai
          const totalDokumentasiPending =
            findPendekatan?.pendekatan.kebutuhan_dokumentasi.filter(
              (item) => item.dokumentasi_borang?.status === Status.PENDING,
            ).length;

          // get total dokumentasi revisi
          const totalDokumentasiRevisi =
            findPendekatan?.pendekatan.kebutuhan_dokumentasi.filter(
              (item) => item.dokumentasi_borang?.status === Status.REVISION,
            ).length;

          // get total dokumentasi
          const totalDokumentasi =
            findPendekatan?.pendekatan.kebutuhan_dokumentasi.length;

          pendekatanResult.push({
            nama_pendekatan: pendekatan as NamaPendekatanType,
            dokumentasi_borang_approve: totalDokumentasiApprove ?? 0,
            dokumentasi_borang_total: totalDokumentasi ?? 0,
            dokumentasi_pending: totalDokumentasiPending ?? 0,
            dokumentasi_revisi: totalDokumentasiRevisi ?? 0,
          });
        }

        // get total dokumentasi
        const getTotalDokumentasi = pendekatanResult.reduce((acc, cur) => {
          return acc + cur.dokumentasi_borang_total;
        }, 0);

        // get total dokumentasi selesai
        const getTotalDokumentasiSelesai = pendekatanResult.reduce(
          (acc, cur) => {
            return acc + cur.dokumentasi_borang_approve;
          },
          0,
        );

        // get total dokumentasi belum selesai
        const getTotalDokumentasiBelumSelesai =
          getTotalDokumentasi - getTotalDokumentasiSelesai;

        //   set
        groupedPendekatan.set(kriteriaId, {
          id_kriteria: kriteria.id,
          kode_kriteria: kriteria.kode_kriteria,
          nama_kriteria: kriteria.nama_kriteria,
          dosen_pic: kriteria.kriteriaPic.map((item) => item.dosen),
          total_dokumentasi_in_kriteria: getTotalDokumentasi,
          total_dokumentasi_belum_selesai_in_kriteria:
            getTotalDokumentasiBelumSelesai,
          total_dokumentasi_selesai_in_kriteria: getTotalDokumentasiSelesai,
          pendekatan: pendekatanResult,
        });
      }
    }

    // get grafik kriteria
    const finalGrafikKriteria: GrafikKriteriaType[] = Array.from(
      groupedPendekatan.values(),
    );

    return {
      total_kriteria,
      total_dosen,
      total_dokumentasi,
      total_dokumentasi_borang_selesai,
      total_dokumentasi_borang_belum_selesai: periode_id
        ? (total_dokumentasi ?? 0) - (total_dokumentasi_borang_selesai ?? 0)
        : null,
      total_file_selesai,
      //   get_grafik_kriteria
      grafik_kriteria: finalGrafikKriteria,
    };
  }

  // get statistik for tim akreditasi
  static async getStatistikForTimAkreditasi(params: {
    dosenId: number;
  }): Promise<ResponseStatistikTimAkreditasiType[] | null> {
    const { dosenId } = params;

    // grafik kriteria
    const get_grafik_kriteria = await prisma.kriteria.findMany({
      where: {
        kriteriaPic: {
          some: {
            dosen: {
              id: dosenId,
            },
          },
        },
      },
      select: {
        id: true,
        kode_kriteria: true,
        nama_kriteria: true,
        kriteriaPic: {
          select: {
            dosen: {
              select: {
                id: true,
                nama: true,
                email: true,
                nidn: true,
              },
            },
          },
        },
        kebutuhan_dokumentasi: {
          select: {
            pendekatan: {
              select: {
                keterangan: true,
                kebutuhan_dokumentasi: {
                  select: {
                    dokumentasi_borang: {
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
    });

    // grouped pendekatan
    const groupedPendekatan = new Map<number, GrafikKriteriaType>();

    // loop kriteria
    for (const kriteria of get_grafik_kriteria) {
      // get kriteria id
      const kriteriaId = kriteria.kode_kriteria;

      const pendekatanResult: PendekatanType[] = [];

      //   mapping pendekatan
      for (const pendekatan of namaPendekatanArray) {
        const findPendekatan = kriteria.kebutuhan_dokumentasi.find(
          (item) => item.pendekatan.keterangan === pendekatan,
        );

        if (
          !findPendekatan ||
          findPendekatan.pendekatan.kebutuhan_dokumentasi.length === 0
        ) {
          pendekatanResult.push({
            nama_pendekatan: pendekatan as NamaPendekatanType,
            dokumentasi_borang_approve: 0,
            dokumentasi_borang_total: 0,
          });

          continue;
        }

        // get total dokumentasi selesai
        const totalDokumentasiSelesai =
          findPendekatan?.pendekatan.kebutuhan_dokumentasi.filter(
            (item) => item.dokumentasi_borang?.status === Status.APPROVED,
          ).length;

        // get total dokumentasi
        const totalDokumentasi =
          findPendekatan?.pendekatan.kebutuhan_dokumentasi.length;

        pendekatanResult.push({
          nama_pendekatan: pendekatan as NamaPendekatanType,
          dokumentasi_borang_approve: totalDokumentasiSelesai ?? 0,
          dokumentasi_borang_total: totalDokumentasi ?? 0,
        });
      }

      // get total dokumentasi
      const getTotalDokumentasi = pendekatanResult.reduce((acc, cur) => {
        return acc + cur.dokumentasi_borang_total;
      }, 0);

      // get total dokumentasi selesai
      const getTotalDokumentasiSelesai = pendekatanResult.reduce((acc, cur) => {
        return acc + cur.dokumentasi_borang_approve;
      }, 0);

      // get total dokumentasi belum selesai
      const getTotalDokumentasiBelumSelesai =
        getTotalDokumentasi - getTotalDokumentasiSelesai;

      //   set
      groupedPendekatan.set(kriteriaId, {
        id_kriteria: kriteria.id,
        kode_kriteria: kriteria.kode_kriteria,
        nama_kriteria: kriteria.nama_kriteria,
        dosen_pic: kriteria.kriteriaPic.map((item) => item.dosen),
        total_dokumentasi_in_kriteria: getTotalDokumentasi,
        total_dokumentasi_belum_selesai_in_kriteria:
          getTotalDokumentasiBelumSelesai,
        total_dokumentasi_selesai_in_kriteria: getTotalDokumentasiSelesai,
        pendekatan: pendekatanResult,
      });
    }

    // get grafik kriteria
    const finalGrafikKriteria: GrafikKriteriaType[] = Array.from(
      groupedPendekatan.values(),
    );

    return finalGrafikKriteria;
  }
}
