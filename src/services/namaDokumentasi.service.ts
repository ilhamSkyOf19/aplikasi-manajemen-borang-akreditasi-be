import prisma from "../libs/prisma";

export class NamaDokumentasiServices {
  // create
  static async create(
    nama_kebutuhan_dokumentasi: string,
  ): Promise<{ id: number; nama_dokumentasi: string }> {
    // call db
    const result = await prisma.namaKebutuhanDokumentasi.create({
      data: {
        nama_kebutuhan_dokumentasi,
      },
    });

    return {
      id: result.id,
      nama_dokumentasi: result.nama_kebutuhan_dokumentasi,
    };
  }

  //   find by id
  static async findById(id: number): Promise<number> {
    const result = await prisma.namaKebutuhanDokumentasi.findUnique({
      where: {
        id,
      },
    });

    return result?.id ?? 0;
  }
}
