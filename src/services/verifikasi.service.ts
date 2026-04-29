import { VerifikasiDokumentasiBorangType } from "../models/dokumentasiBorang.model";
import { VerifikasiKebutuhanDokumentasiPicType } from "../models/kebutuhanDokumentasiPic.model";
import { ResponseRiwayatType } from "../models/riwayat.model";
import { TipeRiwayat } from "../utils/contstanst";
import { RiwayatService } from "./riwayat.service";

export class VerifikasiServices {
  // verifikasi
  static async verifikasiKebutuhanDokumentasiPic(
    data: VerifikasiKebutuhanDokumentasiPicType,
  ): Promise<ResponseRiwayatType | null> {
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

  // verifikasi dokumentasi borang
  static async verifikasiDokumentasiBorang(
    data: VerifikasiDokumentasiBorangType,
  ): Promise<ResponseRiwayatType | null> {
    // get data
    const { dokumentasi_borang_id, keterangan_verifikasi, status } = data;

    // call db
    const result = RiwayatService.createForDokumentasiBorang({
      tipe_riwayat: TipeRiwayat.KEBUTUHAN_DOKUMENTASI,
      dokumentasi_borang_id,
      keterangan: keterangan_verifikasi,
      status,
    });

    return result;
  }
}
