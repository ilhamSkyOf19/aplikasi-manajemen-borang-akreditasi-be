import prisma from "../libs/prisma";
import {
  GrafikKriteriaType,
  namaPendekatanArray,
  NamaPendekatanType,
  PendekatanType,
  ResponseStatistikType,
} from "../models/statistik.model";
import { Status } from "../utils/contstanst";

export class StatistikService {
  // get statistik
  static async getStatistik(): Promise<any | null> {
    // get kriteria count
    const total_kriteria = await prisma.kriteria.count();

    // get dosen count
    const total_dosen = await prisma.dosen.count();

    // get dokumentasi count
    const total_dokumentasi = await prisma.kebutuhanDokumentasi.count();

    // get dokumentasi selesai
    const total_dokumentasi_borang_selesai =
      await prisma.dokumentasiBorang.count({
        where: {
          status: Status.APPROVED,
        },
      });

    // total file selesai count
    const total_file_selesai = await prisma.dokumentasiBorangFile.count({
      where: {
        dokumentasi_borang: {
          status: Status.APPROVED,
        },
      },
    });

    // grafik kriteria
    const get_grafik_kriteria = await prisma.kriteria.findMany({
      select: {
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
            dokumentasi_borang_selesai: 0,
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
          dokumentasi_borang_selesai: totalDokumentasiSelesai ?? 0,
          dokumentasi_borang_total: totalDokumentasi ?? 0,
        });
      }

      // get total dokumentasi
      const getTotalDokumentasi = pendekatanResult.reduce((acc, cur) => {
        return acc + cur.dokumentasi_borang_total;
      }, 0);

      // get total dokumentasi selesai
      const getTotalDokumentasiSelesai = pendekatanResult.reduce((acc, cur) => {
        return acc + cur.dokumentasi_borang_selesai;
      }, 0);

      // get total dokumentasi belum selesai
      const getTotalDokumentasiBelumSelesai =
        getTotalDokumentasi - getTotalDokumentasiSelesai;

      //   set
      groupedPendekatan.set(kriteriaId, {
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

    return {
      total_kriteria,
      total_dosen,
      total_dokumentasi,
      total_dokumentasi_borang_selesai,
      total_dokumentasi_borang_belum_selesai:
        total_dokumentasi - total_dokumentasi_borang_selesai,
      total_file_selesai,
      //   get_grafik_kriteria
      grafik_kriteria: finalGrafikKriteria,
    };
  }
}
