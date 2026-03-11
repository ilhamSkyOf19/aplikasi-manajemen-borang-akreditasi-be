// type pic

import { MetaType, Status } from "../utils/contstanst";

// pic item
export interface PicItem {
  id: number;
  kebutuhanDokumen: {
    kriteria: {
      id: number;
      kriteria: number;
      namaKriteria: string;
    };
    pendekatan: {
      id: number;
      tahap: string;
      keterangan: string;
    };
  };
  picDokumen: {
    dokumenBorang: {
      status: Status;
    };
  }[];
}

// pendekatan group
export interface PendekatanGrouped {
  pendekatanId: number;
  tahap: string;
  keterangan: string;
}

// kriteria group
export interface KriteriaGrouped {
  kriteriaId: number;
  nomorKriteria: number;
  namaKriteria: string;
  pendekatan: Record<number, PendekatanGrouped>;
  dokumenBorangStatus: Status[];
}

// daftar dokumen
export interface DaftarDokumenBorangByKriteria extends Omit<
  KriteriaGrouped,
  "pendekatan"
> {
  pendekatan: PendekatanGrouped[];
  progress: number;
}

// daftar dokumen with meta
export interface DaftarDokumenBorangByKriteriaWithMeta {
  data: DaftarDokumenBorangByKriteria[];
  meta: MetaType;
}

// type daftar kebutuhan dokumentasi
export interface DaftarKebutuhanDokumentasiItemType {
  kebutuhanDokumen: {
    id: number;
    namaDokumen: string;
  };
  dokumenBorangStatus: Status[];
}

// daftar kebutuhan dokumentasi by kriteria and pendekatan
export interface DaftarKebutuhanDokumenetasiByKriteriaPendekatanWithMeta {
  data: DaftarKebutuhanDokumentasiItemType[];
  meta: MetaType;
}
