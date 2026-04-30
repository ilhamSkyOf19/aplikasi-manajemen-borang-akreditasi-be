export interface IPicKebutuhanDokumentasi {
  id: number;
  nama: string;
}

// response
export interface ResponsePicKebutuhanDokumentasiType extends IPicKebutuhanDokumentasi {}

// to response
export const toResponsePicKebutuhanDokumentasiType = (
  pic: ResponsePicKebutuhanDokumentasiType,
): ResponsePicKebutuhanDokumentasiType => pic;
