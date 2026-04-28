import { Status, StorageProvider } from "../utils/contstanst";
import { IKebutuhanDokumentsiPic } from "./kebutuhanDokumentasiPic.model";

export interface IDokumentasiBorang {
  id: number;
  kebutuhan_dokumentasi_id: IKebutuhanDokumentsiPic;
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
