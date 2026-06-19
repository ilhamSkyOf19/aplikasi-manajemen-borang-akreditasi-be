import { StorageProvider } from "../../generated/prisma/enums";
import { MetaType, Status, TipeDokumentasi } from "../utils/contstanst";

export interface ResponseFileDokumenForChooseWithMetaType {
  meta: MetaType;
  data: {
    id: number;
    nama_file: string;
  }[];
}

// IData umum
export interface IDataFileGlobalType {
  dokumentasi_borang_id: number;
  nama_file: string;
  kriteria: {
    kode_kriteria: number;
    nama_kriteria: string;
  };
  pendekatan: {
    tahap: string;
    keterangan: string;
  };
  storage_provider: StorageProvider;
  file_id: string;
  uploaded_by?: {
    id: number;
    nama: string;
    email: string;
    nidn: string;
  } | null;
  keterangan: string;
  tipe_file: TipeDokumentasi;
  total_digunakan: number;
  created_at: Date;
  updated_at: Date;
}

// response search global
export interface ResponseSearchGlobalType {
  kriteria: {
    id: number;
    nama_kriteria: string;
  };
  pendekatan: {
    id: number;
    keterangan: string;
  };
  kebutuhan_dokumentasi: {
    id: number;
    nama_kebutuhan_dokumentasi: string;
  };
  dokumentasi_borang_id: number;
  file: {
    id: number;
    nama_file: string;
    tipe_file: TipeDokumentasi;
  };
}

// to response search global
export const toResponseSearchGlobalType = (
  file: ResponseSearchGlobalType,
): ResponseSearchGlobalType => file;
