import { Status } from "../utils/contstanst";

export interface VerifikasiKebutuhanDokumentasiPic {
  kebutuhan_dokumentasi_pic_id: number;
  status: Status;
  keterangan_verifikasi: string;
}
