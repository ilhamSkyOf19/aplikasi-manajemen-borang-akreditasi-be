import { MetaType, Status } from "../utils/contstanst";
import { ResponseKriteriaType } from "./kriteria.model";
import { IPendekatan } from "./pendekatan.model";

export interface IKebutuhanDokumen {
  id: number;
  namaDokumen: string;
  keterangan: string;
  kriteria: Omit<ResponseKriteriaType, "revisi" | "createdAt" | "updatedAt">;
  pendekatan: IPendekatan;
  //   pic: [];
  createdAt: Date;
  updatedAt: Date;
  status: Status;
}

// create
export interface CreateKebutuhanDokumenType extends Omit<
  IKebutuhanDokumen,
  | "id"
  | "pic"
  | "kriteria"
  | "pendekatan"
  | "createdAt"
  | "updatedAt"
  | "status"
> {
  kriteriaId: number;
  pendekatanId: number;
}

// update
export interface UpdateKebutuhanDokumenType extends Partial<CreateKebutuhanDokumenType> {}

// response
export interface ResponseKebutuhanDokumenType extends IKebutuhanDokumen {}

// to response
export const toResponseKebutuhanDokumenType = (
  kebutuhanDokumen: ResponseKebutuhanDokumenType,
): ResponseKebutuhanDokumenType => kebutuhanDokumen;

// response with pagination
export interface ResponseKebutuhanDokumenWithMetaType {
  meta: MetaType;
  data: ResponseKebutuhanDokumenType[];
}

// to response with pagination
export const toResponseKebutuhanDokumenWithMetaType = (
  kebutuhanDokumen: ResponseKebutuhanDokumenWithMetaType,
): ResponseKebutuhanDokumenWithMetaType => kebutuhanDokumen;

// response choose
export interface ResponseKebutuhanDokumenChooseWithMetaType {
  data: { id: number; namaDokumen: string }[];
  meta: MetaType;
}

// to response
export const toResponseKebutuhanDokumenChooseWithMetaType = (
  kebutuhanDokumen: ResponseKebutuhanDokumenChooseWithMetaType,
): ResponseKebutuhanDokumenChooseWithMetaType => kebutuhanDokumen;

// response update status
export interface ResponseKebutuhanDokumenUpdateStatusType {
  id: number;
  namaDokumen: string;
  kriteria: Omit<ResponseKriteriaType, "revisi" | "createdAt" | "updatedAt">;
  pendekatan: IPendekatan;
  status: string;
  keterangan: string;
  createdAt: Date;
  updatedAt: Date;
}

// to response update status
export const toResponseKebutuhanDokumenUpdateStatusType = (
  pic: ResponseKebutuhanDokumenUpdateStatusType,
) => pic;
