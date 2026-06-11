import { Prisma } from "../../generated/prisma/client";
import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumentasi,
  ResponseCreateUpdateKebutuhanDokumentasiType,
  ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType,
  ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType,
  ResponseKebutuhanDokumentasiType,
  toResponseCreateUpdateKebutuhanDokumentasiType,
  toResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType,
  toResponseKebutuhanDokumentasiNonKriteriPendekatanWithPaginationType,
  toResponseKebutuhanDokumentasiType,
  UpdateKebutuhanDokumentasiType,
} from "../models/kebutuhanDokumentasi.model";
import { IPendekatan } from "../models/pendekatan.model";
import { namaPendekatanArray } from "../models/statistik.model";
import { PaginationType } from "../types/pagination";
import {
  DosenRole,
  SortOrder,
  Status,
  TipeDokumentasi,
} from "../utils/contstanst";
import {
  getPriorityStatusKaprodi,
  getPriorityStatusKaprodiForDokumentasiBorang,
  getPriorityStatusTimAkreditasi,
  getPriorityStatusWakilDekan,
} from "../utils/utils";

export class KebutuhanDokumentasiServices {
  // create
  static async create(
    data: CreateKebutuhanDokumentasi,
  ): Promise<ResponseCreateUpdateKebutuhanDokumentasiType | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      tipe_dokumentasi,
      keterangan,
      lokasi,
    } = data;

    const result = await prisma.$transaction(async (tx) => {
      // pic result
      const lokasiResult: number[] = [];

      // pic looping
      for (const item of lokasi) {
        if (item.lokasi_old) {
          // push to pic result
          lokasiResult.push(item.lokasi_old);

          // continue
          continue;
        } else if (item.lokasi_new) {
          // create pic
          const lokasiCreated = await tx.lokasi.create({
            data: {
              nama: item.lokasi_new,
            },
            select: {
              id: true,
            },
          });

          // check
          if (!lokasiCreated) throw new Error("Failed to create lokasi");

          // push
          lokasiResult.push(lokasiCreated.id);
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
          kebutuhan_dokumentasi_lokasi: {
            create: lokasiResult.map((item) => ({
              lokasi_id: item,
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
          kebutuhan_dokumentasi_lokasi: {
            select: {
              lokasi: {
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

    return toResponseCreateUpdateKebutuhanDokumentasiType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      lokasi_id: result.kebutuhan_dokumentasi_lokasi.map(
        (item) => item.lokasi.id,
      ),
      nama_dokumentasi_id: result.nama_kebutuhan_dokumentasi.id,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
      status: result.status as Status,
    });
  }

  // find all by kriteria pic
  static async findAllByKriteriaLokasi(params: {
    periode_id: number;
    query: Omit<PaginationType, "sort"> & {
      role: DosenRole;
    };
  }): Promise<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType | null> {
    const {
      periode_id,
      query: { limit = 8, page = 1, search, role },
    } = params;

    const currentPage = page < 1 ? 1 : page;

    const conditional: Prisma.KriteriaWhereInput = {
      periode_id,
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
        kode_kriteria: "asc",
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
            pendekatan: {
              select: {
                id: true,
                keterangan: true,
              },
            },
            status: true,
          },
        },
      },
    });

    const mappedData = result.map((item) => {
      // dosen
      const dosen = item.kriteriaPic.map((itemChild) => ({
        id: itemChild.dosen.id,
        email: itemChild.dosen.email,
        nidn: itemChild.dosen.nidn,
        nama: itemChild.dosen.nama,
        roles: itemChild.dosen.dosenRole.map(
          (roleItem) => roleItem.role,
        ) as DosenRole[],
      }));

      // status
      let statusKebutuhan: Status | null = null;

      const kondisi = namaPendekatanArray.every((pendekatan) =>
        item.kebutuhan_dokumentasi.some(
          (itemChild) => itemChild.pendekatan.keterangan === pendekatan,
        ),
      );

      if (kondisi) {
        statusKebutuhan =
          item.kebutuhan_dokumentasi.length > 0
            ? item.kebutuhan_dokumentasi
                .map((itemChild) => itemChild.status as Status | null)
                .reduce((prev, current) =>
                  role === DosenRole.kaprodi
                    ? getPriorityStatusKaprodi(prev, current)
                    : getPriorityStatusWakilDekan(prev, current),
                )
            : null;
      } else {
        statusKebutuhan = null;
      }

      // status detail
      const groupedStatusDetail = new Map<
        number,
        Pick<IPendekatan, "id" | "keterangan"> & { status: Status | null }
      >();

      for (const data of item.kebutuhan_dokumentasi) {
        const pendekatanId = data.pendekatan.id;

        const currentStatus = data.status as Status;

        const existPendekatan = groupedStatusDetail.get(pendekatanId);

        if (existPendekatan) {
          groupedStatusDetail.set(pendekatanId, {
            ...existPendekatan,
            status:
              role === DosenRole.kaprodi
                ? getPriorityStatusKaprodi(
                    existPendekatan.status,
                    currentStatus,
                  )
                : getPriorityStatusWakilDekan(
                    existPendekatan.status,
                    currentStatus,
                  ),
          });

          continue;
        }

        groupedStatusDetail.set(pendekatanId, {
          id: data.pendekatan.id,
          keterangan: data.pendekatan.keterangan,
          status: currentStatus,
        });
      }

      const status_detail = Array.from(groupedStatusDetail.values());

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
        status_detail,
      };
    });

    return toResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType({
      meta: {
        currentPage,
        totalPage,
        limit,
        totalData,
      },
      data: mappedData,
    });
  }

  // find all by kriteria & pendekatan
  static async findAllByKriteriaAndPendekatan(data: {
    periode_id: number;
    kriteria_id: number;
    pendekatan_id: number;
    query: PaginationType & {
      status?: Status;
    };
  }): Promise<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null> {
    // get data

    const {
      periode_id,
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
      kriteria: {
        periode_id,
      },
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
            kebutuhan_dokumentasi_lokasi: {
              some: {
                lokasi: {
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
        kebutuhan_dokumentasi_lokasi: {
          select: {
            lokasi: {
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

    return toResponseKebutuhanDokumentasiNonKriteriPendekatanWithPaginationType(
      {
        data: result.map((item) => ({
          id: item.id,
          nama_kebutuhan_dokumentasi: {
            id: item.nama_kebutuhan_dokumentasi.id,
            nama: item.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          },
          tipe_dokumentasi: item.tipe_dokumentasi as TipeDokumentasi,
          keterangan: item.keterangan,
          lokasi: item.kebutuhan_dokumentasi_lokasi.map((item) => ({
            id: item.lokasi.id,
            nama: item.lokasi.nama,
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
  ): Promise<ResponseKebutuhanDokumentasiType | null> {
    // call db
    const result = await prisma.kebutuhanDokumentasi.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        kriteria: {
          select: {
            id: true,
            nama_kriteria: true,
            kode_kriteria: true,
            periode: {
              select: {
                id: true,
                start_date: true,
                end_date: true,
              },
            },
            kriteriaPic: {
              select: {
                kriteria: {
                  select: {
                    id: true,
                    nama_kriteria: true,
                    kode_kriteria: true,
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
        kebutuhan_dokumentasi_lokasi: {
          select: {
            lokasi: {
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

    return toResponseKebutuhanDokumentasiType({
      id: result.id,
      periode: {
        id: result.kriteria.periode.id,
        start_date: result.kriteria.periode.start_date,
        end_date: result.kriteria.periode.end_date,
      },
      kriteria: {
        kriteria: {
          id: result.kriteria.id,
          nama_kriteria: result.kriteria.nama_kriteria,
          kode_kriteria: result.kriteria.kode_kriteria,
        },
      },
      pendekatan: result.pendekatan,
      tipe_dokumentasi: result.tipe_dokumentasi as TipeDokumentasi,
      lokasi: result.kebutuhan_dokumentasi_lokasi.map((item) => ({
        id: item.lokasi.id,
        nama: item.lokasi.nama,
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

  // get kriteria by dosen
  static async findAllForDokumentasiBorang(params: {
    periode_id: number;
    query: PaginationType;
    dosen_id: number;
    role: DosenRole;
  }): Promise<ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType | null> {
    const {
      periode_id,
      dosen_id,
      query: { limit = 8, page = 1, search, sort },
      role,
    } = params;

    const currentPage = page < 1 ? 1 : page;

    const conditional: Prisma.KriteriaWhereInput = {
      periode_id,
      ...(search && {
        nama_kriteria: {
          contains: search,
        },
      }),
      ...(role === DosenRole.tim_akreditasi && {
        kriteriaPic: {
          some: {
            dosen_id,
          },
        },
      }),
      kebutuhan_dokumentasi: {
        some: {
          status: Status.APPROVED,
        },
      },
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
          where: {
            status: Status.APPROVED,
          },
          select: {
            id: true,
            pendekatan: {
              select: {
                id: true,
                tahap: true,
                keterangan: true,
              },
            },
            dokumentasi_borang: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const mappedData = result.map((item) => {
      // dosen
      const dosen = item.kriteriaPic.map((itemChild) => ({
        id: itemChild.dosen.id,
        email: itemChild.dosen.email,
        nidn: itemChild.dosen.nidn,
        nama: itemChild.dosen.nama,
        roles: itemChild.dosen.dosenRole.map(
          (roleItem) => roleItem.role,
        ) as DosenRole[],
      }));

      // status
      const statusKebutuhan =
        item.kebutuhan_dokumentasi.length > 0
          ? item.kebutuhan_dokumentasi
              .map(
                (itemChild) =>
                  itemChild.dokumentasi_borang?.status as Status | null,
              )
              .reduce((prev, current) =>
                role === DosenRole.tim_akreditasi
                  ? getPriorityStatusTimAkreditasi(prev, current)
                  : getPriorityStatusKaprodiForDokumentasiBorang(prev, current),
              )
          : null;

      // status detail
      const groupedStatusDetail = new Map<
        number,
        Pick<IPendekatan, "id" | "keterangan"> & { status: Status | null }
      >();

      for (const data of item.kebutuhan_dokumentasi) {
        const pendekatanId = data.pendekatan.id;

        const currentStatus = data.dokumentasi_borang?.status as Status;

        const existPendekatan = groupedStatusDetail.get(pendekatanId);

        if (existPendekatan) {
          groupedStatusDetail.set(pendekatanId, {
            ...existPendekatan,
            status:
              role === DosenRole.tim_akreditasi
                ? getPriorityStatusTimAkreditasi(
                    existPendekatan.status,
                    currentStatus,
                  )
                : getPriorityStatusKaprodiForDokumentasiBorang(
                    existPendekatan.status,
                    currentStatus,
                  ),
          });

          continue;
        }

        groupedStatusDetail.set(pendekatanId, {
          id: data.pendekatan.id,
          keterangan: data.pendekatan.keterangan,
          status: currentStatus,
        });
      }

      const status_detail = Array.from(groupedStatusDetail.values());

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
        status_detail,
      };
    });

    // return result;

    return toResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType({
      meta: {
        currentPage,
        totalPage,
        limit,
        totalData,
      },
      data: mappedData,
    });
  }

  // find all for dokumentasi borang by kriteria & pendekatan
  static async findAllforDokumentasiBorangByKriteriaAndPendekatan(data: {
    periode_id: number;
    dosen: {
      id: number;
      role: DosenRole;
    };
    kriteria_id: number;
    pendekatan_id: number;
    query: PaginationType & {
      status?: Status;
    };
  }): Promise<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null> {
    // get data

    const {
      periode_id,
      kriteria_id,
      pendekatan_id,
      dosen: { id, role },
      query: { status, limit = 8, page = 1, search, sort },
    } = data;

    // get page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.KebutuhanDokumentasiWhereInput = {
      kriteria: {
        periode_id,
      },
      ...(role === DosenRole.tim_akreditasi && {
        kriteria: {
          kriteriaPic: {
            some: {
              dosen_id: id,
            },
          },
        },
      }),
      status: Status.APPROVED,
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
            kebutuhan_dokumentasi_lokasi: {
              some: {
                lokasi: {
                  nama: {
                    contains: search,
                  },
                },
              },
            },
          },
        ],
      }),
      ...((status && {
        dokumentasi_borang: {
          status,
        },
      }) ||
        {}),
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
        kebutuhan_dokumentasi_lokasi: {
          select: {
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        dokumentasi_borang: {
          select: {
            status: true,
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseKebutuhanDokumentasiNonKriteriPendekatanWithPaginationType(
      {
        data: result.map((item) => ({
          id: item.id,
          nama_kebutuhan_dokumentasi: {
            id: item.nama_kebutuhan_dokumentasi.id,
            nama: item.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          },
          tipe_dokumentasi: item.tipe_dokumentasi as TipeDokumentasi,
          keterangan: item.keterangan,
          lokasi: item.kebutuhan_dokumentasi_lokasi.map((item) => ({
            id: item.lokasi.id,
            nama: item.lokasi.nama,
          })),
          status: item.dokumentasi_borang?.status
            ? (item.dokumentasi_borang.status as Status)
            : null,
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

  // find all for dokumentasi borang complated
  static async findAllforDokumentasiBorangComplated(data: {
    periode_id: number;
    kriteria_id: number;
    pendekatan_id: number;
    query: PaginationType;
  }): Promise<ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType | null> {
    // get data

    const {
      periode_id,
      kriteria_id,
      pendekatan_id,
      query: { limit = 8, page = 1, search, sort },
    } = data;

    // get page
    const currentPage = page < 1 ? 1 : page;

    // conditional
    const conditional: Prisma.KebutuhanDokumentasiWhereInput = {
      kriteria: {
        periode_id,
      },
      status: Status.APPROVED,
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
            kebutuhan_dokumentasi_lokasi: {
              some: {
                lokasi: {
                  nama: {
                    contains: search,
                  },
                },
              },
            },
          },
        ],
      }),
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
        kebutuhan_dokumentasi_lokasi: {
          select: {
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
          },
        },
        dokumentasi_borang: {
          select: {
            status: true,
          },
        },
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponseKebutuhanDokumentasiNonKriteriPendekatanWithPaginationType(
      {
        data: result.map((item) => ({
          id: item.id,
          nama_kebutuhan_dokumentasi: {
            id: item.nama_kebutuhan_dokumentasi.id,
            nama: item.nama_kebutuhan_dokumentasi.nama_kebutuhan_dokumentasi,
          },
          tipe_dokumentasi: item.tipe_dokumentasi as TipeDokumentasi,
          keterangan: item.keterangan,
          lokasi: item.kebutuhan_dokumentasi_lokasi.map((item) => ({
            id: item.lokasi.id,
            nama: item.lokasi.nama,
          })),
          status: item.dokumentasi_borang?.status
            ? (item.dokumentasi_borang.status as Status)
            : null,
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

  // update
  static async update(
    kebutuhan_dokumentasi_id: number,
    data: UpdateKebutuhanDokumentasiType,
  ): Promise<ResponseCreateUpdateKebutuhanDokumentasiType | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      lokasi,
      tipe_dokumentasi,
      keterangan,
    } = data;

    const result = await prisma.$transaction(async (tx) => {
      const lokasiResult: number[] = [];

      // 1. Selalu hapus semua relasi PIC lama
      await tx.kebutuhanDokumentasiLokasi.deleteMany({
        where: {
          kebutuhan_dokumentasi_id,
        },
      });

      // 2. Proses PIC baru jika ada
      for (const item of lokasi ?? []) {
        if (item.lokasi_old) {
          lokasiResult.push(item.lokasi_old);
          continue;
        }

        if (item.lokasi_new) {
          const lokasiCreated = await tx.lokasi.create({
            data: {
              nama: item.lokasi_new,
            },
            select: {
              id: true,
            },
          });

          lokasiResult.push(lokasiCreated.id);
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
          ...(lokasiResult.length > 0 && {
            kebutuhan_dokumentasi_lokasi: {
              create: lokasiResult.map((lokasiId) => ({
                lokasi_id: lokasiId,
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
          kebutuhan_dokumentasi_lokasi: {
            select: {
              lokasi: {
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

    return toResponseCreateUpdateKebutuhanDokumentasiType({
      id: result.id,
      kriteria_id: result.kriteria.id,
      pendekatan_id: result.pendekatan.id,
      lokasi_id: result.kebutuhan_dokumentasi_lokasi.map(
        (item) => item.lokasi.id,
      ),
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
