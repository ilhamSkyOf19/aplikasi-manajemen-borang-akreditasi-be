import { MetaType, Status } from "../utils/contstanst";
import { IKebutuhanDokumen } from "./kebutuhanDokumen.model";
import { ResponseKriteriaType } from "./kriteria.model";
import { IPendekatan } from "./pendekatan.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { PayloadUserType } from "./user.model";

// type
export interface IPic {
  id: number;
  timAkreditasi: (Omit<ITimAkreditasi, "user"> & {
    anggota: PayloadUserType[];
  })[];
  namaDokumen: string;
  keterangan: string;
  kriteria: Omit<ResponseKriteriaType, "revisi" | "createdAt" | "updatedAt">;
  pendekatan: IPendekatan;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
}

// create
export interface CreatePicType {
  namaDokumen: string;
  kriteriaId: number;
  pendekatanId: number;
  timAkreditasiId: number[];
  keterangan: string;
}

// update
export interface UpdatePicType extends Partial<CreatePicType> {
  keteranganUpdate: string;
}

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

// response update status
export interface ResponsePicUpdateStatusType {
  id: number;
  namaDokumen: string;
  timAkreditasi: {
    id: number;
    namaTimAkreditasi: string;
    anggota: {
      id: number;
      nama: string;
    }[];
  }[];
  kriteria: {
    id: number;
    kriteria: number;
    namaKriteria: string;
  };
  pendekatan: {
    id: number;
    tahap: string;
    keterangan: string;
  };
  status: string;
  keterangan: string;
  createdAt: Date;
  updatedAt: Date;
}

// to response update status
export const toResponsePicUpdateStatusType = (
  pic: ResponsePicUpdateStatusType,
) => pic;

// type for my pic

export interface PicItem {
  id: number;
  status: Status;
  keterangan: string;
  namaDokumen: string;
  kriteria: {
    id: number;
    kriteria: number;
    namaKriteria: string;
  };
  pendekatan: {
    id: number;
    tahap: string;
    keterangan: string;
  };
}

export interface DokumenItem {
  picId: number;
  dokumenId: number;
  namaDokumen: string;
  status: Status;
  keterangan: string;
}

export interface PendekatanGrouped {
  pendekatanId: number;
  tahap: string;
  keterangan: string;
  kebutuhanDokumen: DokumenItem[];
}

export interface KriteriaGrouped {
  kriteriaId: number;
  nomorKriteria: number;
  namaKriteria: string;
  pendekatan: Record<number, PendekatanGrouped>;
}

export interface MyPIcResponse extends Omit<KriteriaGrouped, "pendekatan"> {
  pendekatan: PendekatanGrouped[];
}
