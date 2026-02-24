import { MetaType } from "../utils/contstanst";
import { PayloadUserType, ResponseUserType } from "./user.model";

export interface ITimAkreditasi {
  id: number;
  namaTimAkreditasi: string;
  user: PayloadUserType[];
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateTimAkreditasiType {
  namaTimAkreditasi: string;
  users: number[];
}

// update
export interface UpdateTimAkreditasiType extends Partial<CreateTimAkreditasiType> {}

// response
export interface ResponseTimAkreditasiType extends ITimAkreditasi {}

// to response
export const toResponseTimAkreditasiType = (
  timAkreditasi: ITimAkreditasi,
): ResponseTimAkreditasiType => timAkreditasi;

// response with meta
export interface ResponseTimAkreditasiWithMetaType {
  data: ResponseTimAkreditasiType[];
  meta: MetaType;
}

// to response with meta
export const toResponseTimAkreditasiWithMetaType = (
  timAkreditasi: ResponseTimAkreditasiWithMetaType,
): ResponseTimAkreditasiWithMetaType => timAkreditasi;

//  response choose tim akreditasi
export interface ResponseTimAkreditasiChooseWithMetaType {
  data: {
    id: number;
    namaTimAkreditasi: string;
    anggota: { id: number; nama: string }[];
  }[];
  meta: MetaType;
}

// to response
export const toResponseTimAkreditasiChooseWithMetaType = (
  timAkreditasi: ResponseTimAkreditasiChooseWithMetaType,
): ResponseTimAkreditasiChooseWithMetaType => timAkreditasi;
