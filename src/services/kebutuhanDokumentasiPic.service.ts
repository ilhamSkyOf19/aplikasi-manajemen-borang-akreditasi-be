import prisma from "../libs/prisma";
import {
  CreateKebutuhanDokumentasiPic,
  ResponseKebutuhanDokumentasiPicType,
} from "../models/kebutuhanDokumentasi.model";

export class KebutuhanDokumentasiPicServices {
  // create
  static async create(
    data: CreateKebutuhanDokumentasiPic,
  ): Promise<any | null> {
    // get data
    const {
      kriteria_id,
      pendekatan_id,
      nama_dokumentasi_id,
      pic_id,
      tipe_dokumentasi,
      keterangan,
    } = data;

    const result = await prisma.kebutuhanDokumentasi.create({
      data: {
        kriteria_id,
        pendekatan_id,
        nama_kebutuhan_dokumentasi_id: nama_dokumentasi_id,
        pic_id,
        tipe_dokumentasi,
        keterangan,
      },
    });

    return result;
  }
}
