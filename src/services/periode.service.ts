import prisma from "../libs/prisma";
import {
  CreatePeriodeType,
  ResponsePeriodeType,
  toResponsePeriodeType,
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
}
