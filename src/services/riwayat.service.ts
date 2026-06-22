import prisma from "../libs/prisma";
import {
  CreateRiwayatDokumentasiBorangType,
  CreateRiwayatKebutuhanDokumentasiPicType,
  ResponseRiwayatType,
  toResponseRiwayatType,
  UpdateRiwayatDokumentasiBorangType,
  UpdateRiwayatKebutuhanDokumentasiPicType,
} from "../models/riwayat.model";
import { Status, TipeRiwayat } from "../utils/contstanst";

export class RiwayatService {
  // create
  static async createForKebutuhanDokumentasi(
    data: CreateRiwayatKebutuhanDokumentasiPicType,
  ): Promise<ResponseRiwayatType | null> {
    const {
      tipe_riwayat,
      keterangan,
      kebutuhan_dokumentasi_id,
      status,
      dosen_id,
    } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.kebutuhanDokumentasi.update({
        where: {
          id: kebutuhan_dokumentasi_id,
        },
        data: {
          status,
        },
      });

      // create riwayat
      const riwayat = await tx.riwayat.create({
        data: {
          dosen_id,
          tipe_riwayat,
          keterangan,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_id,
          status,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // update riwayat
  static async updateForKebutuhanDokumentasiPic(params: {
    riwayat_id: number;
    data: UpdateRiwayatKebutuhanDokumentasiPicType;
  }): Promise<ResponseRiwayatType | null> {
    const { riwayat_id, data } = params;
    const { keterangan, kebutuhan_dokumentasi_pic_id, status } = data;

    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      if (status) {
        await tx.kebutuhanDokumentasi.update({
          where: {
            id: kebutuhan_dokumentasi_pic_id,
          },
          data: {
            status,
          },
        });
      }

      // create riwayat
      const riwayat = await tx.riwayat.update({
        where: {
          id: riwayat_id,
          kebutuhan_dokumentasi_id: kebutuhan_dokumentasi_pic_id,
        },
        data: {
          keterangan,
          status,
        },
        select: {
          id: true,
          kebutuhan_dokumentasi_pic: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find all by kebutuhan dokumentasi id
  static async findAllRiwayatByKebutuhanDokumentasiOrDokumentasiBorang(data: {
    id: number;
    tipe_riwayat: TipeRiwayat;
  }): Promise<ResponseRiwayatType[]> {
    // get data
    const { id, tipe_riwayat } = data;
    // call db
    const result = await prisma.riwayat.findMany({
      where: {
        OR: [
          {
            kebutuhan_dokumentasi_id:
              tipe_riwayat === TipeRiwayat.KEBUTUHAN_DOKUMENTASI
                ? id
                : undefined,
          },
          {
            dokumentasi_borang_id:
              tipe_riwayat === TipeRiwayat.DOKUMENTASI_BORANG ? id : undefined,
          },
        ],
      },
      select: {
        id: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            id: true,
          },
        },
        dokumentasi_borang: {
          select: {
            id: true,
          },
        },
        status: true,
        tipe_riwayat: true,
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return result.map((item) =>
      toResponseRiwayatType({
        id: item.id,
        kebutuhan_dokumentasi_pic_id: item.kebutuhan_dokumentasi_pic?.id,
        dokumentasi_borang_id: item.dokumentasi_borang?.id,
        status: item.status as Status,
        tipe_riwayat: item.tipe_riwayat as TipeRiwayat,
        keterangan: item.keterangan,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }),
    );
  }

  // create dokumentasi borang
  static async createForDokumentasiBorang(
    data: CreateRiwayatDokumentasiBorangType,
  ): Promise<ResponseRiwayatType | null> {
    const {
      tipe_riwayat,
      keterangan,
      dokumentasi_borang_id,
      status,
      dosen_id,
    } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.dokumentasiBorang.update({
        where: {
          id: dokumentasi_borang_id,
        },
        data: {
          status,
        },
      });

      // update active file
      await tx.fileDokumen.updateMany({
        where: {
          dokumentasi_borang_files: {
            some: {
              dokumentasi_borang_id,
            },
          },
        },
        data: {
          ...(status === Status.REVISION && { is_active: false }),
          ...(status === Status.APPROVED && { is_active: true }),
        },
      });

      // create riwayat
      const riwayat = await tx.riwayat.create({
        data: {
          dosen_id,
          tipe_riwayat,
          keterangan,
          dokumentasi_borang_id: dokumentasi_borang_id,
          status,
        },
        select: {
          id: true,
          dokumentasi_borang: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  static async createManyForDokumentasiBorang(
    data: Pick<
      CreateRiwayatDokumentasiBorangType,
      "dosen_id" | "keterangan" | "status" | "tipe_riwayat"
    > & {
      dokumentasi_borang_ids: number[];
    },
  ): Promise<ResponseRiwayatType[] | null> {
    const {
      tipe_riwayat,
      keterangan,
      dokumentasi_borang_ids,
      status,
      dosen_id,
    } = data;
    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      await tx.dokumentasiBorang.updateMany({
        where: {
          id: {
            in: dokumentasi_borang_ids,
          },
        },
        data: {
          status,
        },
      });

      // update active file
      await tx.fileDokumen.updateMany({
        where: {
          dokumentasi_borang_files: {
            some: {
              dokumentasi_borang_id: {
                in: dokumentasi_borang_ids,
              },
            },
          },
        },
        data: {
          ...(status === Status.REVISION && { is_active: false }),
          ...(status === Status.APPROVED && { is_active: true }),
        },
      });

      // create riwayat
      await tx.riwayat.createMany({
        data: dokumentasi_borang_ids.map((item) => ({
          dosen_id,
          tipe_riwayat,
          keterangan,
          dokumentasi_borang_id: item,
          status,
        })),
      });

      // find
      const riwayats = await tx.riwayat.findMany({
        where: {
          dokumentasi_borang_id: {
            in: dokumentasi_borang_ids,
          },
        },
        select: {
          id: true,
          dokumentasi_borang: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayats;
    });

    return result.map((item) =>
      toResponseRiwayatType({
        id: item.id,
        dokumentasi_borang_id: item.dokumentasi_borang?.id,
        status: item.status as Status,
        tipe_riwayat: item.tipe_riwayat as TipeRiwayat,
        keterangan: item.keterangan,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }),
    );
  }

  static async updateForDokumentasiBorang(params: {
    riwayat_id: number;
    data: UpdateRiwayatDokumentasiBorangType;
  }): Promise<ResponseRiwayatType | null> {
    const { riwayat_id, data } = params;
    const { dokumentasi_borang_id, keterangan, status, dosen_id } = data;

    // call db
    const result = await prisma.$transaction(async (tx) => {
      // update status
      if (dokumentasi_borang_id) {
        await tx.dokumentasiBorang.update({
          where: {
            id: dokumentasi_borang_id,
          },
          data: {
            status,
          },
        });
      }

      // create riwayat
      const riwayat = await tx.riwayat.update({
        where: {
          id: riwayat_id,
          dokumentasi_borang_id,
        },
        data: {
          keterangan,
          status,
          dosen_id,
        },
        select: {
          id: true,
          dokumentasi_borang: {
            select: {
              id: true,
            },
          },
          status: true,
          tipe_riwayat: true,
          keterangan: true,
          created_at: true,
          updated_at: true,
        },
      });

      return riwayat;
    });

    return toResponseRiwayatType({
      id: result.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find by id riwayat and tipe riwayat
  static async findById(params: {
    id: number;
    tipe_riwayat: TipeRiwayat;
  }): Promise<ResponseRiwayatType | null> {
    // get params
    const { id, tipe_riwayat } = params;

    const result = await prisma.riwayat.findUnique({
      where: {
        id,
        tipe_riwayat,
      },
      select: {
        id: true,
        kebutuhan_dokumentasi_pic: {
          select: {
            id: true,
          },
        },
        dokumentasi_borang: {
          select: {
            id: true,
          },
        },
        status: true,
        tipe_riwayat: true,
        keterangan: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!result) return null;

    return toResponseRiwayatType({
      id: result.id,
      kebutuhan_dokumentasi_pic_id: result.kebutuhan_dokumentasi_pic?.id,
      dokumentasi_borang_id: result.dokumentasi_borang?.id,
      status: result.status as Status,
      tipe_riwayat: result.tipe_riwayat as TipeRiwayat,
      keterangan: result.keterangan,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }

  // find by id for get dosen id
  static async findByIdForGetDosenId(params: { id: number }) {
    const { id } = params;

    const result = await prisma.riwayat.findUnique({
      where: {
        id,
      },
      select: {
        dosen: {
          select: {
            id: true,
          },
        },
      },
    });

    return result?.dosen?.id;
  }
}
