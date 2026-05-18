import prisma from "../libs/prisma";
import {
  CreatePeriodeType,
  ResponsePeriodeType,
  toResponsePeriodeType,
} from "../models/periode.model";

export class PeriodeServices {
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
        created_at: true,
        updated_at: true,
      },
    });

    return toResponsePeriodeType(result);
  }
}
