import { StorageProvider } from "../../generated/prisma/enums";
import { MetaType, TipeDokumentasi } from "../utils/contstanst";

export interface ResponseFileDokumenForChooseWithMetaType {
  meta: MetaType;
  data: {
    id: number;
    nama_file: string;
  }[];
}

// response detail
export interface ResponseFileDokumenForDetailType {
  id: number;
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
  uploaded_by: {
    id: number;
    nama: string;
    email: string;
    nidn: string;
  };
  keterangan: string;
  tipe_file: TipeDokumentasi;
  created_at: Date;
  updated_at: Date;
  dokumentasi_default: {
    nomor_dokumentasi: string | null;
  } | null;
}

// update file default
export interface UpdateFileDefaultType {
  nama_file?: string;
  keterangan?: string;
  nomor_dokumen?: string;
}

// response update file
export interface ResponseUpdateFileType {
  id: number;
  nama_file: string;
  keterangan: string;
  dokumentasi_default?: {
    nomor_dokumentasi: string | null;
  } | null;
  updated_at: Date;
}
