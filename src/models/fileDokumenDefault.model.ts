import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { IDataFileGlobalType } from "./fileDokumen.model";

// type dokumentasi default
export interface IDokumentasiBorangDefault {
  id: number;
  file_id: string;
  nama_file: string;
  nomor_dokumen?: string;
  uploaded_by: {
    id: number;
    nama: string;
    nidn: string;
  };
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// response detail
export interface ResponseFileDokumenDefaultForDetailType extends IDataFileGlobalType {
  id: number;
  dokumentasi_default: {
    nomor_dokumentasi: string | null;
  } | null;
  status: Status;
}

// update file default
export interface UpdateFileDefaultType {
  nama_file?: string;
  keterangan?: string;
  nomor_dokumen?: string;
}

// response update file
export interface ResponseUpdateFileDefaultType {
  id: number;
  nama_file: string;
  keterangan: string;
  dokumentasi_default?: {
    nomor_dokumentasi: string | null;
  } | null;
  updated_at: Date;
}

// create
export interface CreateDokumentasiBorangDefaultRequestType {
  kebutuhan_dokumentasi_id: number;
  dokumentasi_borang_id?: number;
  old_file?: number;
  new_file?: string;
  storage_provider?: StorageProvider;
  nomor_dokumen?: string;
  keterangan?: string;
  folder?: number;
}

// create kebutuhan dokumentasi borang
export interface CreateDokumentasiBorangDefaultType {
  uploaded_by_id: number;
  kebutuhan_dokumentasi_id: number;
  dokumentasi_borang_id?: number;
  folder?: number;
  old_file?: number;
  file?: {
    tipe_dokumentasi: TipeDokumentasi;
    storage_provider: StorageProvider;
    file_id: string;
    nama_file: string;
    nomor_dokumen?: string;
    keterangan: string;
  };
}
