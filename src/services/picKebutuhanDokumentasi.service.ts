import prisma from "../libs/prisma";
import {
  ResponsePicKebutuhanDokumentasiType,
  toResponsePicKebutuhanDokumentasiType,
} from "../models/picKebutuhanDokumentasi.model";

export class PicKebutuhanDokumentasiServices {
  // create
  static async create(nama: string): Promise<{ id: number; nama: string }> {
    // call db
    const result = await prisma.pic.create({
      data: {
        nama,
      },
    });

    return {
      id: result.id,
      nama: result.nama,
    };
  }

  //   find by id
  static async findById(id: number): Promise<number> {
    const result = await prisma.pic.findUnique({
      where: {
        id,
      },
    });

    return result?.id ?? 0;
  }
  static async findAll(): Promise<ResponsePicKebutuhanDokumentasiType[]> {
    // call db
    const result = await prisma.pic.findMany();

    return result.map((item) =>
      toResponsePicKebutuhanDokumentasiType({
        id: item.id,
        nama: item.nama,
      }),
    );
  }
}
