import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumentasiPic,
  ResponseKebutuhanDokumentasiPicType,
  toResponseKebutuhanDokumentasiPicType,
} from "../models/kebutuhanDokumentasiPic.model";
import { ResponseKriteriaPicType } from "../models/kriteriaPic.model";
import { DosenRole, Status, TipeDokumentasi } from "../utils/contstanst";

export class KebutuhanDokumentasiPicServices {
  // create
  static async create(
    data: CreateKebutuhanDokumentasiPic,
  ): Promise<any | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      pic_id,
      tipe_dokumentasi,
      keterangan,
    } = data;

    const result = await prisma.kebutuhanDokumentasi.create({
      data: {
        kriteria_id,
        pendekatan_id,
        nama_kebutuhan_dokumentasi_id: nama_dokumentasi_id,
        pic_id,
        tipe_dokumentasi,
        keterangan,
      },
      select: {
        id: true,

        kriteria: {
          select: {
            kriteriaPic: {
              select: {
                kriteria: {
                  select: {
                    id: true,
                    nama_kriteria: true,
                    kode_kriteria: true,
                  },
                },
                dosen: {
                  select: {
                    id: true,
                    nama: true,
                    email: true,
                    nidn: true,
                    dosenRole: {
                      select: {
                        role: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        pendekatan: {
          select: {
            id: true,
            tahap: true,
            keterangan: true,
          },
        },
        nama_kebutuhan_dokumentasi: {
          select: {
            nama_kebutuhan_dokumentasi: true,
          },
        },
        tipe_dokumentasi: true,
        pic: {
          select: {
            nama: true,
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    // kriteria pic grouped
    const groupedKriteriaPic = new Map<
      number,
      Omit<ResponseKriteriaPicType, "created_at" | "updated_at">
    >();

    for (const item of result.kriteria.kriteriaPic) {
      const kriteriaId = item.kriteria.id;

      // dosen
      const dosen = {
        id: item.dosen.id,
        nama: item.dosen.nama,
        email: item.dosen.email,
        nidn: item.dosen.nidn,
        roles: item.dosen.dosenRole.map((item) => item.role) as DosenRole[],
      };

      // get exis data by kriteria id
      const existingData = groupedKriteriaPic.get(kriteriaId);

      // set dosen
      if (existingData) {
        existingData.dosen.push(dosen);
        continue;
      }

      groupedKriteriaPic.set(kriteriaId, {
        kriteria: {
          id: item.kriteria.id,
          kode_kriteria: item.kriteria.kode_kriteria,
          nama_kriteria: item.kriteria.nama_kriteria,
        },
        dosen: [dosen],
      });
    }

    const kriteriaPic = Array.from(groupedKriteriaPic.values())[0];

    return toResponseKebutuhanDokumentasiPicType({
      id: result.id,
      kriteria_pic: kriteriaPic,
      pendekatan: result.pendekatan,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      pic: result.pic.nama,
      nama_kebutuhan_dokumentasi:
        result.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
      status: result.status as Status,
    });
  }
}
