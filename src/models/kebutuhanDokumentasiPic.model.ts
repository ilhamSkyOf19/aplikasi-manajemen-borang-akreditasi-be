import { MetaType, Status, TipeDokumentasi } from "../utils/contstanst";
import { IPendekatan } from "./pendekatan.model";
import { ResponseKriteriaPicType } from "./kriteriaPic.model";

// type
export interface IKebutuhanDokumentsiPic {
  id: number;
  kriteria: Omit<
    ResponseKriteriaPicType,
    "created_at" | "updated_at" | "dosen"
  >;
  pendekatan: IPendekatan;
  nama_kebutuhan_dokumentasi: {
    id: number;
    nama: string;
  };
  tipe_dokumentasi: TipeDokumentasi;
  pic: {
    id: number;
    nama: string;
  }[];
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  status: Status | null;
}

export interface PicRequestType {
  pic_old?: number;
  pic_new?: string;
}

// create
export interface CreateKebutuhanDokumentasiPic {
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id: number;
  pic: PicRequestType[];
  tipe_dokumentasi: TipeDokumentasi;
  keterangan: string;
}

// update
export interface UpdateKebutuhanDokumentasiPicType extends Partial<CreateKebutuhanDokumentasiPic> {}

// create request
export interface CreateKebutuhanDokumentasiPicRequestType {
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id?: number;
  pic: PicRequestType[];

  nama_dokumentasi_new?: string;

  tipe_dokumentasi: TipeDokumentasi;
  keterangan: string;
}

// update request
export interface UpdateKebutuhanDokumentasiPicRequestType extends Partial<CreateKebutuhanDokumentasiPicRequestType> {
  keterangan_update: string;
}

// response create update
export interface ResponseCreateUpdateKebutuhanDokumentasiPicType {
  id: number;
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id: number;
  pic_id: number[];
  tipe_dokumentasi: TipeDokumentasi;
  status: Status;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// to response create update
export const toResponseCreateUpdateKebutuhanDokumentasiPicType = (
  data: ResponseCreateUpdateKebutuhanDokumentasiPicType,
): ResponseCreateUpdateKebutuhanDokumentasiPicType => data;

// response
export interface ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType {
  data: Omit<IKebutuhanDokumentsiPic, "kriteria" | "pendekatan">[];
  meta: MetaType;
}

// to response
export const toResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPaginationType =
  (
    data: ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType,
  ): ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType =>
    data;

// response
export interface ResponseKebutuhanDokumentasiPicType extends IKebutuhanDokumentsiPic {}

// to response
export const toResponseKebutuhanDokumentasiPicType = (
  data: ResponseKebutuhanDokumentasiPicType,
): ResponseKebutuhanDokumentasiPicType => data;

// response with pagination
export interface ResponseKebutuhanDokumentasiPicWithMetaType {
  meta: MetaType;
  data: ResponseKebutuhanDokumentasiPicType[];
}

// to response with pagination
export const toResponseKebutuhanDokumentasiPicWithMetaType = (
  data: ResponseKebutuhanDokumentasiPicWithMetaType,
): ResponseKebutuhanDokumentasiPicWithMetaType => data;

// response with pagination
export interface ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType {
  meta: MetaType;
  data: {
    kriteria_pic: Omit<ResponseKriteriaPicType, "created_at" | "updated_at">;
    status: Status | null;
    status_detail: (Pick<IPendekatan, "id" | "keterangan"> & {
      status: Status | null;
    })[];
  }[];
}

// to response with pagination
export const toResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType = (
  data: ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType,
): ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType => data;
