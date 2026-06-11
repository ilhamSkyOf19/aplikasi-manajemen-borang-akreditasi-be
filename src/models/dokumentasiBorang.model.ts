import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";
import { IDosen } from "./dosen.model";
import { IDokumentasiBorangDefault } from "./fileDokumenDefault.model";
import { IKebutuhanDokumentsi } from "./kebutuhanDokumentasi.model";

// verifikasi request
export interface VerifikasiDokumentasiBorangType {
  dokumentasi_borang_id: number;
  status: Status;
  keterangan_verifikasi: string;
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
  kebutuhan_dokumentasi: Pick<
    IKebutuhanDokumentsi,
    | "kriteria"
    | "pendekatan"
    | "tipe_dokumentasi"
    | "lokasi"
    | "keterangan"
    | "nama_kebutuhan_dokumentasi"
  >;
  kriteria_pic: Omit<
    IDosen,
    "password" | "created_at" | "updated_at" | "roles"
  >[];
  files: {
    id: number;
    nama_file: string;
    dokumentasi_borang_id: number;
  }[];
  folders: {
    id: number;
    nama_folder: string;
    files: {
      id: number;
      nama_file: string;
      dokumentasi_borang_id: number;
    }[];
  }[];
  status: Status | null;
}

// ajukan type
export interface AjukanRequestType {
  keterangan: string;
}
