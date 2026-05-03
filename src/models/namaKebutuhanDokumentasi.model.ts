import { MetaType } from "../utils/contstanst";

export interface INamaKebutuhanDokumentasi {
  id: number;
  nama_kebutuhan_dokumentasi: string;
}

// response
export interface ResponseNamaKebutuhanDokumentasiWithMetaType {
  data: INamaKebutuhanDokumentasi[];
  meta: MetaType;
}

// to response
export const toResponseNamaKebutuhanDokumentasiWithMetaType = (
  namaKebutuhanDokumentasi: ResponseNamaKebutuhanDokumentasiWithMetaType,
): ResponseNamaKebutuhanDokumentasiWithMetaType => namaKebutuhanDokumentasi;
