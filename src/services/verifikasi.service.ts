import { ResponseCreateRiwayatKebutuhanDokumentasiPicType } from "../models/riwayat.model";
import { VerifikasiKebutuhanDokumentasiPic } from "../models/verifikasiKebutuhanDokumentasiPic.model";
import { TipeRiwayat } from "../utils/contstanst";
import { RiwayatService } from "./riwayat.service";

export class VerifikasiServices {
  // verifikasi
  static async verifikasiKebutuhanDokumentasiPic(
    data: VerifikasiKebutuhanDokumentasiPic,
  ): Promise<ResponseCreateRiwayatKebutuhanDokumentasiPicType | null> {
    // get data
    const { kebutuhan_dokumentasi_pic_id, keterangan_verifikasi, status } =
      data;

    // call db
    const result = RiwayatService.createForKebutuhanDokumentasiPic({
      tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
      kebutuhan_dokumentasi_pic_id,
      keterangan: keterangan_verifikasi,
      status,
    });

    return result;
  }
}
