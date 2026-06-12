import { MetaType } from "../utils/contstanst";

export interface ILokasi {
  id: number;
  nama: string;
}

// response
export interface ResponseLokasiWithPaginationType {
  data: ILokasi[];
  meta: MetaType;
}

// to response
export const toResponseLokasiWithPaginationType = (
  pic: ResponseLokasiWithPaginationType,
): ResponseLokasiWithPaginationType => pic;
