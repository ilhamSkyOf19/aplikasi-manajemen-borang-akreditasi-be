import { MetaType } from "../utils/contstanst";

export interface IPicKebutuhanDokumentasi {
  id: number;
  nama: string;
}

// response
export interface ResponsePicKebutuhanDokumentasiWithPaginationType {
  data: IPicKebutuhanDokumentasi[];
  meta: MetaType;
}

// to response
export const toResponsePicKebutuhanDokumentasiWithPaginationType = (
  pic: ResponsePicKebutuhanDokumentasiWithPaginationType,
): ResponsePicKebutuhanDokumentasiWithPaginationType => pic;
