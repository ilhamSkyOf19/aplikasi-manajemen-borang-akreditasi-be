import prisma from "../libs/prisma";
import {
  CreateRiwayatType,
  ResponseRiwayatType,
  toResponseRiwayatType,
} from "../models/riwayat.model";
import { JenisRiwayat, Status } from "../utils/contstanst";

export class RiwayatService {
  // create
  static async create(
    data: CreateRiwayatType,
  ): Promise<ResponseRiwayatType | null> {
    const { jenis, keterangan, status, kebutuhanDokumenId, picId } = data;
    // call db
    const result = await prisma.riwayat.create({
      data: {
        jenis,
        keterangan,
        status,
        kebutuhanDokumen: kebutuhanDokumenId
          ? {
              connect: {
                id: kebutuhanDokumenId,
              },
            }
          : undefined,
        pic: picId
          ? {
              connect: {
                id: picId,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        jenis: true,
        status: true,
        keterangan: true,
        createdAt: true,
        updatedAt: true,
        kebutuhanDokumen: {
          select: {
            id: true,
            namaDokumen: true,
            status: true,
          },
        },
        pic: {
          select: {
            id: true,
            status: true,
            kebutuhanDokumen: {
              select: {
                id: true,
                namaDokumen: true,
              },
            },
            timAkreditasi: {
              select: {
                id: true,
                namaTimAkreditasi: true,
              },
            },
            pj: {
              include: {
                user: {
                  select: {
                    id: true,
                    nama: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return toResponseRiwayatType({
      ...result,
      jenis: result.jenis as JenisRiwayat,
      status: result.status as Status,
      kebutuhanDokumen: result.kebutuhanDokumen
        ? {
            ...result.kebutuhanDokumen,
            status: result.kebutuhanDokumen.status as Status,
          }
        : null,
      pic: result.pic
        ? {
            id: result.pic.id,
            status: result.pic.status as Status,
            kebutuhanDokumen: {
              id: result.pic.kebutuhanDokumen.id,
              namaDokumen: result.pic.kebutuhanDokumen.namaDokumen,
            },
            timAkreditasi: {
              id: result.pic.timAkreditasi.id,
              namaTimAkreditasi: result.pic.timAkreditasi.namaTimAkreditasi,
            },
            pj: result.pic.pj.map((pj) => ({
              id: pj.user.id,
              nama: pj.user.nama,
            })),
          }
        : null,
    });
  }
}
