import { StorageProvider } from "../utils/contstanst";

export interface IDokumenPanduan {
  id: number;
  id_file: string;
  periode_id: number;
  storage_provider: StorageProvider;
  nama_file: string;
  created_at: Date;
  updated_at: Date;
}

// request create dokumen panduan
export interface CreateDokumenPanduanRequestType {
  nama_file: string;
  storage_provider: StorageProvider;
}

// update
export interface UpdateDokumenPanduanRequestType extends Partial<CreateDokumenPanduanRequestType> {}

// create service type
export interface CreateDokumenPanduanServiceType extends CreateDokumenPanduanRequestType {
  id_file: string;
  periode_id: number;
}

// updaate
export interface UpdateDokumenPanduanServiceType extends Partial<CreateDokumenPanduanServiceType> {}

// response
export interface ResponseDokumenPanduanType extends IDokumenPanduan {}

// to response
export const toResponseDokumenPanduanType = (
  dokumenPanduan: ResponseDokumenPanduanType,
): ResponseDokumenPanduanType => dokumenPanduan;
