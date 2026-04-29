import { Status, StorageProvider, TipeDokumentasi } from "../utils/contstanst";

// verifikasi request
export interface VerifikasiDokumentasiBorangType {
  dokumentasi_borang_id: number;
  status: Status;
  keterangan_verifikasi: string;
}

// type dokumentasi default
export interface IDokumentasiBorangDefault {
  id: number;
  provider_file_id?: string;
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

export type FilesRequest = {
  old_file?: number;
  storage_provider?: StorageProvider;
  nama_file?: string;
  keterangan?: string;
};

// create kebutuhan dokumentasi borang
export interface CreateDokumentasiBorangDefaultRequestType {
  kebutuhan_dokumentasi_pic_id: number;
  new_folder?: string;
  old_folder?: number;
  files: string;
}

// create kebutuhan dokumentasi borang
export interface CreateDokumentasiBorangDefaultType {
  uploaded_by_id: number;
  kebutuhan_dokumentasi_pic_id: number;
  new_folder?: string;
  old_folder?: number;
  files: (FilesRequest & {
    provider_id?: string;
  })[];
}

export interface ResponseCreateUpdateDokumentasiBorangType {
  id: number;
  dokumentasi_borang_id: number;
  file_dokumen_id: number[];
  folder_dokumen_id: number;
  status: Status;
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
