import prisma from "../libs/prisma";
import {
  CreatePeriodeType,
  ResponsePeriodeType,
  ResponsePeriodeWithDistribusiType,
  toResponsePeriodeType,
  toResponsePeriodeWithDistribusiType,
} from "../models/periode.model";

export class PeriodeServices {
  // find periode
  static async find(): Promise<ResponsePeriodeType[] | null> {
    // call db
    const result = await prisma.periode.findMany({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result.map((item) => toResponsePeriodeType(item));
  }
  // create
  static async create(
    data: CreatePeriodeType,
  ): Promise<ResponsePeriodeType | null> {
    // call db
    const result = await prisma.periode.create({
      data: {
        ...data,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponsePeriodeType(result);
  }

  // periodeIsActive
  static async isActive(params: {
    id: number;
    is_active: boolean;
  }): Promise<ResponsePeriodeType | null> {
    const { id, is_active } = params;
    // call db
    const result = await prisma.periode.update({
      where: {
        id,
      },
      data: {
        is_active,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return toResponsePeriodeType(result);
  }

  // find periode is active
  static async findIsActive(): Promise<ResponsePeriodeType | null> {
    // call db
    const result = await prisma.periode.findFirst({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    // return null
    if (!result) return null;

    return toResponsePeriodeType(result);
  }

  static async findIsActiveWithDistribusi(): Promise<ResponsePeriodeWithDistribusiType | null> {
    // call db
    const result = await prisma.periode.findFirst({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        start_date: true,
        end_date: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        distribusiKebutuhanDokumentasis: {
          select: {
            id: true,
            is_active: true,
          },
        },
      },
    });

    // return null
    if (!result) return null;

    return toResponsePeriodeWithDistribusiType({
      id: result.id,
      start_date: result.start_date,
      end_date: result.end_date,
      is_active: result.is_active,
      distribusi: result.distribusiKebutuhanDokumentasis
        ? {
            id: result.distribusiKebutuhanDokumentasis.id,
            is_distribusi_active:
              result.distribusiKebutuhanDokumentasis.is_active,
          }
        : null,
      created_at: result.created_at,
      updated_at: result.updated_at,
    });
  }
}
