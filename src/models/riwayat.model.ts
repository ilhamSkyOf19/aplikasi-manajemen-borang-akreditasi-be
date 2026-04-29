import { TipeRiwayat, Status } from "../utils/contstanst";

export interface IRiwayat {
  id: number;
  tipe_riwayat: TipeRiwayat;
  kebutuhan_dokumentasi_pic_id?: number;
  dokumentasi_borang_id?: number;
  status: Status;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// create
export interface CreateRiwayatKebutuhanDokumentasiPicType {
  status: Status;
  tipe_riwayat: TipeRiwayat;
  kebutuhan_dokumentasi_pic_id: number;
  keterangan: string;
}

// create riwayat dokumentasi borang
export interface CreateRiwayatDokumentasiBorangType {
  status: Status;
  tipe_riwayat: TipeRiwayat;
  dokumentasi_borang_id: number;
  keterangan: string;
}

// update
// export interface UpdateRiwayatType extends Partial<
//   Omit<CreateRiwayatType, "picId">
// > {}

// response
export interface ResponseRiwayatType extends IRiwayat {}

// to response
export const toResponseRiwayatType = (
  riwayat: ResponseRiwayatType,
): ResponseRiwayatType => riwayat;
