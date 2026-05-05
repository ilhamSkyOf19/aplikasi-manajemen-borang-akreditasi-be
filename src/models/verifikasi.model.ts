import { Status } from "../utils/contstanst";

export interface VerifikasiType {
  kebutuhan_dokumentasi_pic_id?: number;
  dokumentasi_borang_id?: number;
  status: Exclude<Status, "PENDING">;
  keterangan_verifikasi: string;
}

// update
export interface VerifikasiUpdateType extends Partial<VerifikasiType> {}
