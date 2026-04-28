import { StorageProvider } from "../utils/contstanst";
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
  keterangan: string;
  new_folder?: string;
  files: string;
}

// create kebutuhan dokumentasi borang
export interface CreateDokumentasiBorangDefaultType {
  uploaded_by_id: number;
  kebutuhan_dokumentasi_pic_id: number;
  keterangan: string;
  new_folder?: string;
  files: (FilesRequest & {
    provider_id?: string;
  })[];
}
