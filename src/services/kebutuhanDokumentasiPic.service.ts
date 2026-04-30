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
        pic: {
          select: {
            id: true,
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    return toResponseCreateUpdateKebutuhanDokumentasiPicType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      pic_id: result.pic.id,
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
    // get query
    const { status, limit = 8, page = 1, search, sort } = query;

    // get page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.KebutuhanDokumentasiWhereInput = {
      ...(search && {
        kriteria: {
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
        },
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
        kriteria: {
          kode_kriteria: sort ? (sort as SortOrder) : "asc",
        },
      },
      select: {
        kriteria: {
          select: {
            kriteriaPic: {
              select: {
                kriteria: {
                  select: {
                    id: true,
                    kode_kriteria: true,
                    nama_kriteria: true,
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
        status: true,
      },
    });

    const groupedMap = new Map<
      number,
      Omit<ResponseKriteriaPicType, "created_at" | "updated_at"> & {
        status: Status;
      }
    >();

    for (const item of result) {
      for (const itemChild of item.kriteria.kriteriaPic) {
        const kriteriaId = itemChild.kriteria.id;

        // dosen
        const dosen = {
          id: itemChild.dosen.id,
          email: itemChild.dosen.email,
          nidn: itemChild.dosen.nidn,
          nama: itemChild.dosen.nama,
          roles: itemChild.dosen.dosenRole.map(
            (item) => item.role,
          ) as DosenRole[],
        };

        // get exis data by kriteria id
        const existingData = groupedMap.get(kriteriaId);

        // set dosen
        if (existingData) {
          // check status
          existingData.status = getPriorityStatus(
            existingData.status,
            item.status as Status,
          );

          // check dosen exist
          const dosenExist = existingData?.dosen.find(
            (item) => item.id === dosen.id,
          );

          if (!dosenExist) {
            existingData.dosen.push(dosen);
          }

          continue;
        }

        groupedMap.set(kriteriaId, {
          kriteria: {
            id: itemChild.kriteria.id,
            kode_kriteria: itemChild.kriteria.kode_kriteria,
            nama_kriteria: itemChild.kriteria.nama_kriteria,
          },
          dosen: [dosen],
          status: item.status as Status,
        });
      }
    }

    // grouped
    const finalGrouped = Array.from(groupedMap.values());

    // return
    return toResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType({
      data: finalGrouped.map((item) => ({
        kriteria_pic: {
          kriteria: item.kriteria,
          dosen: item.dosen,
        },
        status: item.status,
      })),
      meta: {
        currentPage,
        limit,
        totalData,
        totalPage,
      },
    });

    // return result;
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
            pic: {
              nama: {
                contains: search,
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
        kriteria: {
          kode_kriteria: sort ? (sort as SortOrder) : "asc",
        },
      },
      select: {
        id: true,
        nama_kebutuhan_dokumentasi: {
          select: {
            nama_kebutuhan_dokumentasi: true,
          },
        },
        tipe_dokumentasi: true,
        pic: true,
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
          nama_kebutuhan_dokumentasi:
            item.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          tipe_dokumentasi: item.tipe_dokumentasi as TipeDokumentasi,
          keterangan: item.keterangan,
          pic: item.pic.nama,
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
      pic: result.pic.nama,
      nama_kebutuhan_dokumentasi:
        result.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
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
      pic_id,
      tipe_dokumentasi,
      keterangan,
    } = data;

    const result = await prisma.kebutuhanDokumentasi.update({
      where: {
        id: kebutuhan_dokumentasi_id,
      },
      data: {
        kriteria_id: kriteria_id ?? undefined,
        pendekatan_id: pendekatan_id ?? undefined,
        nama_kebutuhan_dokumentasi_id: nama_dokumentasi_id ?? undefined,
        pic_id: pic_id ?? undefined,
        tipe_dokumentasi,
        keterangan,
        status: Status.PENDING,
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
        pic: {
          select: {
            id: true,
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
        status: true,
      },
    });

    return toResponseCreateUpdateKebutuhanDokumentasiPicType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      pic_id: result.pic.id,
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
