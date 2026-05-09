import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { IKebutuhanDokumentsiPic } from "./kebutuhanDokumentasiPic.model";

// verifikasi request
export interface VerifikasiDokumentasiBorangType {
  dokumentasi_borang_id: number;
  status: Status;
  keterangan_verifikasi: string;
}

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

export interface IFolderDokumentasiBorang {
  id: number;
  nama_folder: string;
  files_dokumentasi_default?: IDokumentasiBorangDefault[];
}

export interface IDokumentasiBorang {
  id: number;
  kebutuhan_dokumentasi: {
    id: number;
    tipe_dokumentasi: TipeDokumentasi;
  };
  status: Status;
  files_dokumentasi_default?: IDokumentasiBorangDefault[];
  folders?: IFolderDokumentasiBorang[];
}
// create kebutuhan dokumentasi borang
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

export interface ResponseCreateUpdateDokumentasiBorangType {
  id: number;
  dokumentasi_borang_id: number;
  file_dokumen_id: number;
  folder_dokumen_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export const toResponseCreateUpdateDokumentasiBorangType = (
  data: ResponseCreateUpdateDokumentasiBorangType,
): ResponseCreateUpdateDokumentasiBorangType => data;

// response dokumentasi borang
export interface ResponseDokumentasiBorangType extends IDokumentasiBorang {}

// to response dokumentasi borang
export const toResponseDokumentasiBorangType = (
  data: ResponseDokumentasiBorangType,
): ResponseDokumentasiBorangType => data;

// response folder and files
export interface ResponseFoldersAndFilesType extends IFolderDokumentasiBorang {}

// to response folder and files
export const toResponseFoldersAndFilesType = (
  data: ResponseFoldersAndFilesType,
): ResponseFoldersAndFilesType => data;

// response dokumnetasi borang with kebutuhan dokumentasi
export interface ResponseDokumentasiBorangWithKebutuhanDokumentasiType {
  dokumentasi_borang_id: number | null;
  kebutuhan_dokumentasi_pic: Pick<
    IKebutuhanDokumentsiPic,
    | "kriteria"
    | "pendekatan"
    | "tipe_dokumentasi"
    | "pic"
    | "keterangan"
    | "nama_kebutuhan_dokumentasi"
  >;
  files: {
    id: number;
    nama_file: string;
  }[];
  folders: {
    id: number;
    nama_folder: string;
    files: {
      id: number;
      nama_file: string;
    }[];
  }[];
  status: Status | null;
}
