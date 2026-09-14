import { Prisma } from "../../generated/prisma";
import prisma from "../libs/prisma";
import {
  GrafikKriteriaType,
  namaPendekatanArray,
  NamaPendekatanType,
  PendekatanType,
  ResponseStatistikTimAkreditasiType,
  ResponseStatistikType,
  toResponseStatistikType,
} from "../models/statistik.model";
import { DosenRole, Status } from "../utils/contstanst";

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
            status: Status.APPROVED,
          },
        })
      : null;

    // get dokumentasi selesai
    const total_dokumentasi_borang_selesai = periode_id
      ? await prisma.kebutuhanDokumentasi.count({
          where: {
            status: Status.APPROVED,
            kriteria: {
              periode_id,
            },
            OR: [
              {
                dokumentasi_borang: {
                  status: Status.APPROVED,
                },
              },
            ],
          },
        })
      : null;

    const total_kebutuhan_dokumentasi = periode_id
      ? await prisma.kebutuhanDokumentasi.count({
          where: {
            kriteria: {
              periode_id,
            },
          },
        })
      : null;

    // total kebutuhan dokumentasi selesai
    const total_kebutuhan_dokumentasi_selesai = periode_id
      ? await prisma.kebutuhanDokumentasi.count({
          where: {
            status: Status.APPROVED,
            kriteria: {
              periode_id,
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
              where: {
                status: Status.APPROVED,
              },

              select: {
                status: true,

                pendekatan: {
                  select: {
                    id: true,
                    keterangan: true,
                  },
                },

                dokumentasi_borang: {
                  select: {
                    id: true,
                    status: true,
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
          const findPendekatan = kriteria.kebutuhan_dokumentasi.filter(
            (item) => item.pendekatan.keterangan === pendekatan,
          );

          if (!findPendekatan || findPendekatan.length === 0) {
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
          const totalDokumentasiApprove = findPendekatan?.filter(
            (item) => item.dokumentasi_borang?.status === Status.APPROVED,
          ).length;

          // get total dokumentasi selesai
          const totalDokumentasiPending = findPendekatan?.filter(
            (item) => item.dokumentasi_borang?.status === Status.PENDING,
          ).length;

          // get total dokumentasi revisi
          const totalDokumentasiRevisi = findPendekatan?.filter(
            (item) => item.dokumentasi_borang?.status === Status.REVISION,
          ).length;

          // get total dokumentasi
          const totalDokumentasi = findPendekatan.length;

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
    ).sort((a, b) => a.kode_kriteria - b.kode_kriteria);

    // return response
    return toResponseStatistikType({
      total_kriteria,
      total_dosen,
      total_kebutuhan_dokumentasi,
      total_kebutuhan_dokumentasi_selesai,
      total_kebutuhan_dokumentasi_belum_selesai: periode_id
        ? (total_kebutuhan_dokumentasi ?? 0) -
          (total_kebutuhan_dokumentasi_selesai ?? 0)
        : null,
      total_dokumentasi,
      total_dokumentasi_borang_selesai,
      total_dokumentasi_borang_belum_selesai: periode_id
        ? (total_dokumentasi ?? 0) - (total_dokumentasi_borang_selesai ?? 0)
        : null,
      total_file_selesai,
      //   get_grafik_kriteria
      grafik_kriteria: finalGrafikKriteria,
    });
  }

  static async getStatistikForDownload(params: {
    periode_id?: number;
    dosen_id?: number;
    role?: DosenRole;
  }): Promise<ResponseStatistikType | null> {
    const { periode_id, dosen_id, role } = params;
    /** * ============================================================ * FILTER AKSES * ============================================================ * * Hanya tim akreditasi yang menggunakan dosen_id sebagai PIC. * * Jika: * - role bukan tim_akreditasi * - role tidak dikirim * - dosen_id tidak dikirim * * maka data diambil seluruhnya. */ const isFilterByPic =
      role === DosenRole.tim_akreditasi && dosen_id !== undefined;
    /** * ============================================================ * WHERE KRITERIA * ============================================================ * * Filter utama diletakkan pada Kriteria karena seluruh * statistik dokumentasi berada di bawah Kriteria. */ const kriteriaWhere: Prisma.KriteriaWhereInput =
      {
        ...(periode_id && { periode_id }),
        ...(isFilterByPic && { kriteriaPic: { some: { dosen_id } } }),
      };
    /** * ============================================================ * WHERE KEBUTUHAN DOKUMENTASI * ============================================================ * * Digunakan untuk seluruh statistik yang berhubungan dengan * kebutuhan dokumentasi. */ const kebutuhanDokumentasiWhere: Prisma.KebutuhanDokumentasiWhereInput =
      {
        ...(periode_id && { kriteria: kriteriaWhere }),
        ...(!periode_id &&
          isFilterByPic && {
            kriteria: { kriteriaPic: { some: { dosen_id } } },
          }),
      };
    /** * ============================================================ * TOTAL KRITERIA * ============================================================ */ const total_kriteria =
      periode_id ? await prisma.kriteria.count({ where: kriteriaWhere }) : null;
    /** * ============================================================ * TOTAL DOSEN * ============================================================ * * Jika tim akreditasi dan dosen_id dikirim, statistik dosen * mengikuti dosen yang sedang login. * * Selain itu mengambil seluruh dosen. */ const total_dosen =
      isFilterByPic
        ? await prisma.dosen.count({ where: { id: dosen_id } })
        : await prisma.dosen.count();
    /** * ============================================================ * TOTAL KEBUTUHAN DOKUMENTASI * ============================================================ */ const total_kebutuhan_dokumentasi =
      periode_id
        ? await prisma.kebutuhanDokumentasi.count({
            where: kebutuhanDokumentasiWhere,
          })
        : null;
    /** * ============================================================ * TOTAL KEBUTUHAN DOKUMENTASI SELESAI * ============================================================ * * Selesai = status APPROVED pada KebutuhanDokumentasi. */ const total_kebutuhan_dokumentasi_selesai =
      periode_id
        ? await prisma.kebutuhanDokumentasi.count({
            where: { ...kebutuhanDokumentasiWhere, status: Status.APPROVED },
          })
        : null;
    /** * ============================================================ * TOTAL DOKUMENTASI BORANG * ============================================================ * * Dokumentasi yang dihitung adalah kebutuhan dokumentasi * yang sudah APPROVED. */ const total_dokumentasi =
      periode_id
        ? await prisma.kebutuhanDokumentasi.count({
            where: { ...kebutuhanDokumentasiWhere, status: Status.APPROVED },
          })
        : null;
    /** * ============================================================ * TOTAL DOKUMENTASI BORANG SELESAI * ============================================================ * * Kebutuhan dokumentasi APPROVED dan dokumentasi borangnya * juga APPROVED. */ const total_dokumentasi_borang_selesai =
      periode_id
        ? await prisma.kebutuhanDokumentasi.count({
            where: {
              ...kebutuhanDokumentasiWhere,
              status: Status.APPROVED,
              dokumentasi_borang: { status: Status.APPROVED },
            },
          })
        : null;
    /** * ============================================================ * TOTAL FILE SELESAI * ============================================================ * * File hanya dihitung dari dokumentasi borang yang: * - APPROVED * - berada pada kriteria yang sesuai periode * - dan jika tim akreditasi, kriteria tersebut memiliki * PIC dosen yang bersangkutan. */ const total_file_selesai =
      periode_id
        ? await prisma.dokumentasiBorangFile.count({
            where: {
              dokumentasi_borang: {
                status: Status.APPROVED,
                kebutuhan_dokumentasi: { ...kebutuhanDokumentasiWhere },
              },
            },
          })
        : null;
    /** * ============================================================ * GRAFIK KRITERIA * ============================================================ */ const get_grafik_kriteria =
      periode_id
        ? await prisma.kriteria.findMany({
            where: kriteriaWhere,
            select: {
              id: true,
              kode_kriteria: true,
              nama_kriteria: true,
              /** * Semua PIC tetap ditampilkan pada response. */ kriteriaPic: {
                select: {
                  dosen: {
                    select: { id: true, nama: true, email: true, nidn: true },
                  },
                },
              },
              /** * Hanya kebutuhan dokumentasi yang APPROVED * yang digunakan untuk grafik. */ kebutuhan_dokumentasi:
                {
                  where: { status: Status.APPROVED },
                  select: {
                    status: true,
                    pendekatan: { select: { id: true, keterangan: true } },
                    dokumentasi_borang: { select: { id: true, status: true } },
                  },
                },
            },
          })
        : null;
    /** * ============================================================ * GROUPED PENDEKATAN * ============================================================ */ const groupedPendekatan =
      new Map<number, GrafikKriteriaType>();
    /** * ============================================================ * LOOP KRITERIA * ============================================================ */ if (
      periode_id &&
      get_grafik_kriteria
    ) {
      for (const kriteria of get_grafik_kriteria) {
        const kriteriaId = kriteria.kode_kriteria;
        const pendekatanResult: PendekatanType[] = [];
        /** * ======================================================== * MAPPING PENDEKATAN * ======================================================== */ for (const pendekatan of namaPendekatanArray) {
          const findPendekatan = kriteria.kebutuhan_dokumentasi.filter(
            (item) => item.pendekatan.keterangan === pendekatan,
          );
          /** * Tidak ada dokumentasi pada pendekatan tersebut. */ if (
            findPendekatan.length === 0
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
          /** * ====================================================== * TOTAL DOKUMENTASI APPROVED * ====================================================== */ const totalDokumentasiApprove =
            findPendekatan.filter(
              (item) => item.dokumentasi_borang?.status === Status.APPROVED,
            ).length;
          /** * ====================================================== * TOTAL DOKUMENTASI PENDING * ====================================================== */ const totalDokumentasiPending =
            findPendekatan.filter(
              (item) => item.dokumentasi_borang?.status === Status.PENDING,
            ).length;
          /** * ====================================================== * TOTAL DOKUMENTASI REVISION * ====================================================== */ const totalDokumentasiRevisi =
            findPendekatan.filter(
              (item) => item.dokumentasi_borang?.status === Status.REVISION,
            ).length;
          /** * ====================================================== * TOTAL DOKUMENTASI * ====================================================== */ const totalDokumentasi =
            findPendekatan.length;
          pendekatanResult.push({
            nama_pendekatan: pendekatan as NamaPendekatanType,
            dokumentasi_borang_approve: totalDokumentasiApprove,
            dokumentasi_borang_total: totalDokumentasi,
            dokumentasi_pending: totalDokumentasiPending,
            dokumentasi_revisi: totalDokumentasiRevisi,
          });
        }
        /** * ======================================================== * TOTAL DOKUMENTASI DALAM KRITERIA * ======================================================== */ const getTotalDokumentasi =
          pendekatanResult.reduce((acc, cur) => {
            return acc + cur.dokumentasi_borang_total;
          }, 0);
        /** * ======================================================== * TOTAL DOKUMENTASI SELESAI DALAM KRITERIA * ======================================================== */ const getTotalDokumentasiSelesai =
          pendekatanResult.reduce((acc, cur) => {
            return acc + cur.dokumentasi_borang_approve;
          }, 0);
        /** * ======================================================== * TOTAL DOKUMENTASI BELUM SELESAI * ======================================================== */ const getTotalDokumentasiBelumSelesai =
          getTotalDokumentasi - getTotalDokumentasiSelesai;
        /** * ======================================================== * SET DATA GRAFIK * ======================================================== */ groupedPendekatan.set(
          kriteriaId,
          {
            id_kriteria: kriteria.id,
            kode_kriteria: kriteria.kode_kriteria,
            nama_kriteria: kriteria.nama_kriteria,
            dosen_pic: kriteria.kriteriaPic.map((item) => item.dosen),
            total_dokumentasi_in_kriteria: getTotalDokumentasi,
            total_dokumentasi_belum_selesai_in_kriteria:
              getTotalDokumentasiBelumSelesai,
            total_dokumentasi_selesai_in_kriteria: getTotalDokumentasiSelesai,
            pendekatan: pendekatanResult,
          },
        );
      }
    }
    /** * ============================================================ * FINAL GRAFIK KRITERIA * ============================================================ */ const finalGrafikKriteria: GrafikKriteriaType[] =
      Array.from(groupedPendekatan.values()).sort(
        (a, b) => a.kode_kriteria - b.kode_kriteria,
      );
    /** * ============================================================ * RETURN RESPONSE * ============================================================ */ return toResponseStatistikType(
      {
        total_kriteria,
        total_dosen,
        total_kebutuhan_dokumentasi,
        total_kebutuhan_dokumentasi_selesai,
        total_kebutuhan_dokumentasi_belum_selesai: periode_id
          ? (total_kebutuhan_dokumentasi ?? 0) -
            (total_kebutuhan_dokumentasi_selesai ?? 0)
          : null,
        total_dokumentasi,
        total_dokumentasi_borang_selesai,
        total_dokumentasi_borang_belum_selesai: periode_id
          ? (total_dokumentasi ?? 0) - (total_dokumentasi_borang_selesai ?? 0)
          : null,
        total_file_selesai,
        grafik_kriteria: finalGrafikKriteria,
      },
    );
  }

  // get statistik for tim akreditasi
  static async getStatistikForTimAkreditasi(params: {
    periodeId: number;
    dosenId: number;
  }): Promise<ResponseStatistikTimAkreditasiType[] | null> {
    const { dosenId, periodeId } = params;

    // grafik kriteria
    const get_grafik_kriteria = await prisma.kriteria.findMany({
      where: {
        periode_id: periodeId,
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
          where: {
            status: Status.APPROVED,
          },

          select: {
            status: true,

            pendekatan: {
              select: {
                id: true,
                keterangan: true,
              },
            },

            dokumentasi_borang: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    console.log(JSON.stringify(get_grafik_kriteria, null, 2));

    // grouped pendekatan
    const groupedPendekatan = new Map<number, GrafikKriteriaType>();

    // loop kriteria
    for (const kriteria of get_grafik_kriteria) {
      // get kriteria id
      const kriteriaId = kriteria.kode_kriteria;

      const pendekatanResult: PendekatanType[] = [];

      //   mapping pendekatan
      for (const pendekatan of namaPendekatanArray) {
        const findPendekatan = kriteria.kebutuhan_dokumentasi.filter(
          (item) => item.pendekatan.keterangan === pendekatan,
        );

        if (!findPendekatan || findPendekatan.length === 0) {
          pendekatanResult.push({
            nama_pendekatan: pendekatan as NamaPendekatanType,
            dokumentasi_borang_approve: 0,
            dokumentasi_borang_total: 0,
          });

          continue;
        }

        // get total dokumentasi selesai
        const totalDokumentasiSelesai = findPendekatan.filter(
          (item) => item.dokumentasi_borang?.status === Status.APPROVED,
        ).length;

        // get total dokumentasi
        const totalDokumentasi = findPendekatan.length;

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
    ).sort((a, b) => a.kode_kriteria - b.kode_kriteria);

    return finalGrafikKriteria;
  }
}
