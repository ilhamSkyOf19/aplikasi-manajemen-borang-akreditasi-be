import prisma from "../libs/prisma";
import { ResponseDistribusiKebutuhanDokumentasiType } from "../models/distribusiKebutuhanDokumentasi.model";

export class DistribusiKebutuhanDokumentasiService {
  // create distribusi
  static async create(): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.distribusiKebutuhanDokumentasi.findFirst({
        select: {
          id: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (existing) {
        return existing;
      }

      const created = await tx.distribusiKebutuhanDokumentasi.create({
        data: {
          id: 1,
          is_active: false,
        },
        select: {
          id: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });

      return created;
    });

    return result;
  }

  // find
  static async find(): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.findFirst({
      select: {
        id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  // handle distribusi active
  static async active(): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.update({
      where: {
        id: 1,
      },
      data: {
        is_active: true,
      },
      select: {
        id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  // handle distribusi an active
  static async anActive(): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.update({
      where: {
        id: 1,
      },
      data: {
        is_active: false,
      },
      select: {
        id: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }
}
