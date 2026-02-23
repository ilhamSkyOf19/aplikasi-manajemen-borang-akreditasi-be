import { MetaType, Status } from "../utils/contstanst";
import { IKebutuhanDokumen } from "./kebutuhanDokumen.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { PayloadUserType } from "./user.model";

// type
export interface IPic {
  id: number;
  timAkreditasi: Omit<ITimAkreditasi, "user">;
  kebutuhanDokumen: Omit<IKebutuhanDokumen, "createdAt" | "updatedAt">;
  pj: Omit<PayloadUserType, "role">[];
  status: Status;
  keterangan: string;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreatePicType {
  timAkreditasiId: number;
  kebutuhanDokumenId: number;
  pjId: number[];
  keterangan: string;
}

// update
export interface UpdatePicType extends Partial<Omit<CreatePicType, "status">> {}

// response
export interface ResponsePicType extends IPic {}

// to response
export const toResponsePicType = (pic: ResponsePicType): ResponsePicType => pic;

// response with pagination
export interface ResponsePicWithMetaType {
  meta: MetaType;
  data: ResponsePicType[];
}

// to response with pagination
export const toResponsePicWithMetaType = (
  pic: ResponsePicWithMetaType,
): ResponsePicWithMetaType => pic;
