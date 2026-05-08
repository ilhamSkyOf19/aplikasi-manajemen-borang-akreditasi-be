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
  storage_provider: StorageProvider;
  provider_file_id: string | null;
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
