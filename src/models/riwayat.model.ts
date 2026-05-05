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
export interface UpdateRiwayatKebutuhanDokumentasiPicType extends Partial<
  Omit<
    CreateRiwayatKebutuhanDokumentasiPicType,
    "kebutuhan_dokumentasi_pic_id" | "tipe_riwayat"
  >
> {
  kebutuhan_dokumentasi_pic_id: number;
}

// create riwayat dokumentasi borang
export interface CreateRiwayatDokumentasiBorangType {
  status: Status;
  tipe_riwayat: TipeRiwayat;
  dokumentasi_borang_id: number;
  keterangan: string;
}

// update
export interface UpdateRiwayatDokumentasiBorangType extends Partial<
  Omit<
    CreateRiwayatDokumentasiBorangType,
    "tipe_riwayat" | "dokumentasi_borang_id"
  >
> {
  dokumentasi_borang_id: number;
}
// response
export interface ResponseRiwayatType extends IRiwayat {}

// to response
export const toResponseRiwayatType = (
  riwayat: ResponseRiwayatType,
): ResponseRiwayatType => riwayat;
