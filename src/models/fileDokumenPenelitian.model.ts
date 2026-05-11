import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { IDataFileGlobalType } from "./fileDokumen.model";

export interface IDokumentasiBorangPenelitian {
  id: number;
  file_id: string;
  nama_file: string;
  judul_penelitian: string;
  tahun: number;
  link_publikasi: string;
  uploaded_by: {
    id: number;
    nama: string;
    nidn: string;
  };
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// create
export interface CreateDokumentasiBorangPenelitianRequestType {
  kebutuhan_dokumentasi_id: number;
  dokumentasi_borang_id?: number;
  old_file?: number;
  new_file?: string;
  storage_provider?: StorageProvider;
  judul_penelitian?: string;
  tahun?: number;
  link_publikasi?: string;
  keterangan?: string;
  folder?: number;
}

export interface CreateDokumentasiBorangPenelitianType {
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
    judul_penelitian: string;
    tahun: number;
    link_publikasi: string;
    keterangan: string;
  };
}

export interface ResponseFileDokumenPenelitianForDetailType extends IDataFileGlobalType {
  id: number;
  dokumentasi_penelitian: {
    judul_penelitian: string;
    tahun: number;
    link_publikasi: string;
  };
  status: Status;
}

// update file default
export interface UpdateFilePenelitianType {
  nama_file?: string;
  keterangan?: string;
  judul_penelitian?: string;
  tahun?: number;
  link_publikasi?: string;
}

export interface ResponseUpdateFilePenelitanType {
  id: number;
  nama_file: string;
  keterangan: string;
  dokumentasi_penelitian: {
    judul_penelitian: string;
    tahun: number;
    link_publikasi: string;
  };
  updated_at: Date;
}
