import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumentasiPic,
  ResponseCreateUpdateKebutuhanDokumentasiPicType,
  ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType,
  ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType,
  ResponseKebutuhanDokumentasiPicType,
  toResponseCreateUpdateKebutuhanDokumentasiPicType,
  toResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPaginationType,
  toResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType,
  toResponseKebutuhanDokumentasiPicType,
  toResponseKebutuhanDokumentasiPicWithMetaType,
  UpdateKebutuhanDokumentasiPicType,
} from "../models/kebutuhanDokumentasiPic.model";
import { ResponseKriteriaPicType } from "../models/kriteriaPic.model";
import { PaginationType } from "../types/pagination";
import {
  DosenRole,
  SortOrder,
  Status,
  TipeDokumentasi,
} from "../utils/contstanst";
import { getPriorityStatus } from "../utils/utils";

export class KebutuhanDokumentasiPicServices {
  // create
  static async create(
    data: CreateKebutuhanDokumentasiPic,
  ): Promise<ResponseCreateUpdateKebutuhanDokumentasiPicType | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      tipe_dokumentasi,
      keterangan,
      pic,
    } = data;

    const result = await prisma.$transaction(async (tx) => {
      // pic result
      const picResult: number[] = [];

      // pic looping
      for (const item of pic) {
        if (item.pic_old) {
          // push to pic result
          picResult.push(item.pic_old);

          // continue
          continue;
        } else if (item.pic_new) {
          // create pic
          const picCreated = await tx.pic.create({
            data: {
              nama: item.pic_new,
            },
            select: {
              id: true,
            },
          });

          // check
          if (!picCreated) throw new Error("Failed to create pic");

          // push
          picResult.push(picCreated.id);
        }
      }

      // create kebutuhan dokumentasi
      const kebutuhanDokumentasiCreated = await tx.kebutuhanDokumentasi.create({
        data: {
          kriteria_id,
          pendekatan_id,
          nama_kebutuhan_dokumentasi_id: nama_dokumentasi_id,
          tipe_dokumentasi,
          keterangan,
          kebutuhan_dokumentasi_pic: {
            create: picResult.map((item) => ({
              pic_id: item,
            })),
          },
        },
        select: {
          id: true,
          kriteria: {
            select: {
              id: true,
            },
          },
          pendekatan: {
            select: {
              id: true,
            },
          },
          nama_kebutuhan_dokumentasi: {
            select: {
              id: true,
            },
          },
          tipe_dokumentasi: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              pic: {
                select: {
                  id: true,
                  nama: true,
                },
              },
            },
          },
          keterangan: true,
          created_at: true,
          updated_at: true,
          status: true,
        },
      });

      return kebutuhanDokumentasiCreated;
    });

    return toResponseCreateUpdateKebutuhanDokumentasiPicType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      pic_id: result.kebutuhan_dokumentasi_pic.map((item) => item.pic.id),
      nama_dokumentasi_id: result.nama_kebutuhan_dokumentasi.id,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
      status: result.status as Status,
    });
  }

  // find all by kriteria pic
  static async findAllByKriteriaPic(
    query: PaginationType & {
      status?: Status;
    },
  ): Promise<ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType | null> {
    const { status, limit = 8, page = 1, search, sort } = query;

    const currentPage = page < 1 ? 1 : page;

    const conditional: Prisma.KriteriaWhereInput = {
      ...(search && {
        kriteriaPic: {
          some: {
            dosen: {
              OR: [
                { nama: { contains: search } },
                { email: { contains: search } },
                { nidn: { contains: search } },
              ],
            },
          },
        },
      }),

      ...(status && {
        kebutuhan_dokumentasi: {
          some: {
            status,
          },
        },
      }),
    };

    const totalData = await prisma.kriteria.count({
      where: conditional,
    });

    const totalPage = Math.ceil(totalData / limit);

    const result = await prisma.kriteria.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        kode_kriteria: sort ? (sort as SortOrder) : "asc",
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
                dosenRole: {
                  select: {
                    role: true,
                  },
                },
              },
            },
          },
        },

        kebutuhan_dokumentasi: {
          select: {
            status: true,
          },
        },
      },
    });

    const mappedData = result.map((item) => {
      const dosen = item.kriteriaPic.map((itemChild) => ({
        id: itemChild.dosen.id,
        email: itemChild.dosen.email,
        nidn: itemChild.dosen.nidn,
        nama: itemChild.dosen.nama,
        roles: itemChild.dosen.dosenRole.map(
          (roleItem) => roleItem.role,
        ) as DosenRole[],
      }));

      const statusKebutuhan =
        item.kebutuhan_dokumentasi.length > 0
          ? item.kebutuhan_dokumentasi
              .map((itemChild) => itemChild.status as Status)
              .reduce((prev, current) => getPriorityStatus(prev, current))
          : null;

      return {
        kriteria_pic: {
          kriteria: {
            id: item.id,
            kode_kriteria: item.kode_kriteria,
            nama_kriteria: item.nama_kriteria,
          },
          dosen,
        },
        status: statusKebutuhan,
      };
    });

    return toResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType({
      data: mappedData,
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
    });
  }

  // find all by kriteria & pendekatan
  static async findAllByKriteriaAndPendekatan(data: {
    kriteria_id: number;
    pendekatan_id: number;
    query: PaginationType & {
      status?: Status;
    };
  }): Promise<ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType | null> {
    // get data

    const {
      kriteria_id,
      pendekatan_id,
      query: { status, limit = 8, page = 1, search, sort },
    } = data;

    // get page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.KebutuhanDokumentasiWhereInput = {
      kriteria_id,
      pendekatan_id,
      ...(search && {
        OR: [
          {
            nama_kebutuhan_dokumentasi: {
              nama_kebutuhan_dokumentasi: {
                contains: search,
              },
            },
          },
          {
            kebutuhan_dokumentasi_pic: {
              some: {
                pic: {
                  nama: {
                    contains: search,
                  },
                },
              },
            },
          },
        ],
      }),
      ...((status && { status }) || {}),
    };

    // get count data
    const totalData = await prisma.kebutuhanDokumentasi.count({
      where: conditional,
    });

    // get total page
    const totalPage = Math.ceil(totalData / limit);

    // call db
    const result = await prisma.kebutuhanDokumentasi.findMany({
      where: conditional,
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: {
        updated_at: sort ? (sort as SortOrder) : "asc",
      },
      select: {
        id: true,
        nama_kebutuhan_dokumentasi: {
          select: {
            id: true,
            nama_kebutuhan_dokumentasi: true,
          },
        },
        tipe_dokumentasi: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            pic: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        keterangan: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPaginationType(
      {
        data: result.map((item) => ({
          id: item.id,
          nama_kebutuhan_dokumentasi: {
            id: item.nama_kebutuhan_dokumentasi.id,
            nama: item.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          },
          tipe_dokumentasi: item.tipe_dokumentasi as TipeDokumentasi,
          keterangan: item.keterangan,
          pic: item.kebutuhan_dokumentasi_pic.map((item) => ({
            id: item.pic.id,
            nama: item.pic.nama,
          })),
          status: item.status as Status,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        meta: {
          currentPage,
          limit,
          totalData,
          totalPage,
        },
      },
    );
  }

  // find by id
  static async findById(
    id: number,
  ): Promise<ResponseKebutuhanDokumentasiPicType | null> {
    // call db
    const result = await prisma.kebutuhanDokumentasi.findUnique({
      where: {
        id,
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
            id: true,
            nama_kebutuhan_dokumentasi: true,
          },
        },
        tipe_dokumentasi: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            pic: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    // check
    if (!result) return null;

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
      pic: result.kebutuhan_dokumentasi_pic.map((item) => ({
        id: item.pic.id,
        nama: item.pic.nama,
      })),
      nama_kebutuhan_dokumentasi: {
        id: result.nama_kebutuhan_dokumentasi.id,
        nama: result.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
      },
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
      status: result.status as Status,
    });
  }

  // get  count by id
  static async getExistAndTipeDokumenAndStatus(id: number): Promise<{
    id: number;
    tipe_dokumentasi: TipeDokumentasi;
    status: Status;
  } | null> {
    const result = await prisma.kebutuhanDokumentasi.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        tipe_dokumentasi: true,
        status: true,
      },
    });

    // check
    if (!result) return null;

    return {
      id: result.id,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      status: result.status as Status,
    };
  }

  // update
  static async update(
    kebutuhan_dokumentasi_id: number,
    data: UpdateKebutuhanDokumentasiPicType,
  ): Promise<ResponseCreateUpdateKebutuhanDokumentasiPicType | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      pic,
      tipe_dokumentasi,
      keterangan,
    } = data;

    const result = await prisma.$transaction(async (tx) => {
      const picResult: number[] = [];

      // 1. Selalu hapus semua relasi PIC lama
      await tx.kebutuhanDokumentasiPic.deleteMany({
        where: {
          kebutuhan_dokumentasi_id,
        },
      });

      // 2. Proses PIC baru jika ada
      for (const item of pic ?? []) {
        if (item.pic_old) {
          picResult.push(item.pic_old);
          continue;
        }

        if (item.pic_new) {
          const picCreated = await tx.pic.create({
            data: {
              nama: item.pic_new,
            },
            select: {
              id: true,
            },
          });

          picResult.push(picCreated.id);
        }
      }

      // 3. Update kebutuhan dokumentasi
      const kebutuhanDokumentasiUpdated = await tx.kebutuhanDokumentasi.update({
        where: {
          id: kebutuhan_dokumentasi_id,
        },
        data: {
          kriteria_id,
          pendekatan_id,
          nama_kebutuhan_dokumentasi_id: nama_dokumentasi_id,
          tipe_dokumentasi,
          keterangan,

          // 4. Buat relasi PIC baru jika ada
          ...(picResult.length > 0 && {
            kebutuhan_dokumentasi_pic: {
              create: picResult.map((picId) => ({
                pic_id: picId,
              })),
            },
          }),
        },
        select: {
          id: true,
          kriteria: {
            select: {
              id: true,
            },
          },
          pendekatan: {
            select: {
              id: true,
            },
          },
          nama_kebutuhan_dokumentasi: {
            select: {
              id: true,
            },
          },
          tipe_dokumentasi: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              pic: {
                select: {
                  id: true,
                  nama: true,
                },
              },
            },
          },
          keterangan: true,
          created_at: true,
          updated_at: true,
          status: true,
        },
      });

      return kebutuhanDokumentasiUpdated;
    });

    return toResponseCreateUpdateKebutuhanDokumentasiPicType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      pic_id: result.kebutuhan_dokumentasi_pic.map((item) => item.pic.id),
      nama_dokumentasi_id: result.nama_kebutuhan_dokumentasi.id,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
      status: result.status as Status,
    });
  }

  // delete
  static async delete(id: number): Promise<boolean> {
    const result = await prisma.kebutuhanDokumentasi.delete({
      where: {
        id,
      },
    });

    return result ? true : false;
  }
}
