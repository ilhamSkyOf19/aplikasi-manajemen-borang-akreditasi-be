import prisma from "../libs/prisma";
import {
  ResponsePendekatanType,
  toResponsePendekatanType,
} from "../models/pendekatan.model";

export class PendekatanService {
  // read by id
  static async readById(id: number): Promise<ResponsePendekatanType | null> {
    // call db
    const result = await prisma.pendekatan.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        tahap: true,
        keterangan: true,
      },
    });

    // check
    if (!result) return null;

    return toResponsePendekatanType(result);
  }
}
