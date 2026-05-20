import prisma from "../libs/prisma";
import { ResponseDistribusiKebutuhanDokumentasiType } from "../models/distribusiKebutuhanDokumentasi.model";

export class DistribusiKebutuhanDokumentasiService {
  // find by periode
  static async findByPeriode(
    periode_id: number,
  ): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.findFirst({
      where: {
        periode_id,
      },
      select: {
        id: true,
        is_active: true,
        periode_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }
  // create distribusi
  static async create(params: {
    periode_id: number;
  }): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    const { periode_id } = params;

    const result = await prisma.distribusiKebutuhanDokumentasi.create({
      data: {
        is_active: false,
        periode_id,
      },
      select: {
        id: true,
        is_active: true,
        periode_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  // find
  static async find(params: {
    periode_id: number;
  }): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    const { periode_id } = params;
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.findFirst({
      where: {
        periode_id,
      },
      select: {
        id: true,
        is_active: true,
        periode_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  // handle distribusi active
  static async active(params: {
    id: number;
    periode_id: number;
  }): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    const { id, periode_id } = params;
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.update({
      where: {
        id,
        periode_id,
      },
      data: {
        is_active: true,
      },
      select: {
        id: true,
        is_active: true,
        periode_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  // handle distribusi an active
  static async anActive(params: {
    id: number;
    periode_id: number;
  }): Promise<ResponseDistribusiKebutuhanDokumentasiType | null> {
    const { id, periode_id } = params;
    // call db
    const result = await prisma.distribusiKebutuhanDokumentasi.update({
      where: {
        id,
        periode_id,
      },
      data: {
        is_active: false,
      },
      select: {
        id: true,
        is_active: true,
        periode_id: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }
}
