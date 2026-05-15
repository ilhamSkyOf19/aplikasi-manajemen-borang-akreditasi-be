import { MetaType, Status, TipeRiwayat } from "../utils/contstanst";

export interface INotifikasi {
  id: number;
  dosen: {
    nama: string;
  };
  tipe_notifikasi: TipeRiwayat;
  kriteria_id: number;
  pendekatan_id: number;
  kebutuhan_dokumentasi_id: number;
  keterangan_notifikasi: string;
  isRead: boolean;
  status: Status;
  created_at: Date;
  updated_at: Date;
}

// response
export interface ResponseNotifikasiType {
  id: number;
  isRead: boolean;
}

export const toResponseNotifikasiType = (
  data: ResponseNotifikasiType,
): ResponseNotifikasiType => data;

// response notifikasi
export interface ResponseNotifikasiWithMetaType {
  meta: MetaType;
  data: INotifikasi[];
}

export const toResponseNotifikasiWithMetaType = (
  data: ResponseNotifikasiWithMetaType,
): ResponseNotifikasiWithMetaType => data;
