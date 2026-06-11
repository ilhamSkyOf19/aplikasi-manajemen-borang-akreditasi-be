import { MetaType, Status, TipeDokumentasi } from "../utils/contstanst";
import { IPendekatan } from "./pendekatan.model";
import { ResponseKriteriaPicType } from "./kriteriaPic.model";
import { IPeriode } from "./periode.model";

// type
export interface IKebutuhanDokumentsi {
  id: number;
  kriteria: Omit<
    ResponseKriteriaPicType,
    "created_at" | "updated_at" | "dosen" | "periode_id"
  >;
  pendekatan: IPendekatan;
  nama_kebutuhan_dokumentasi: {
    id: number;
    nama: string;
  };
  tipe_dokumentasi: TipeDokumentasi;
  lokasi: {
    id: number;
    nama: string;
  }[];
  periode: Pick<IPeriode, "id" | "start_date" | "end_date">;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  status: Status | null;
}

export interface LokasiRequestType {
  lokasi_old?: number;
  lokasi_new?: string;
}

// create
export interface CreateKebutuhanDokumentasi {
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id: number;
  lokasi: LokasiRequestType[];
  tipe_dokumentasi: TipeDokumentasi;
  keterangan: string;
}

// update
export interface UpdateKebutuhanDokumentasiType extends Partial<CreateKebutuhanDokumentasi> {}

// create request
export interface CreateKebutuhanDokumentasiRequestType {
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id?: number;
  lokasi: LokasiRequestType[];

  nama_dokumentasi_new?: string;

  tipe_dokumentasi: TipeDokumentasi;
  keterangan: string;
}

// update request
export interface UpdateKebutuhanDokumentasiRequestType extends Partial<CreateKebutuhanDokumentasiRequestType> {
  keterangan_update: string;
}

// response create update
export interface ResponseCreateUpdateKebutuhanDokumentasiType {
  id: number;
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id: number;
  lokasi_id: number[];
  tipe_dokumentasi: TipeDokumentasi;
  status: Status;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
}

// to response create update
export const toResponseCreateUpdateKebutuhanDokumentasiType = (
  data: ResponseCreateUpdateKebutuhanDokumentasiType,
): ResponseCreateUpdateKebutuhanDokumentasiType => data;

// response
export interface ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType {
  data: Omit<IKebutuhanDokumentsi, "kriteria" | "pendekatan" | "periode">[];
  meta: MetaType;
}

// to response
export const toResponseKebutuhanDokumentasiNonKriteriPendekatanWithPaginationType =
  (
    data: ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType,
  ): ResponseKebutuhanDokumentasiNonKriteriPendekatanWithPagenationType => data;

// response
export interface ResponseKebutuhanDokumentasiType extends IKebutuhanDokumentsi {}

// to response
export const toResponseKebutuhanDokumentasiType = (
  data: ResponseKebutuhanDokumentasiType,
): ResponseKebutuhanDokumentasiType => data;

// response with pagination
export interface ResponseKebutuhanDokumentasiWithMetaType {
  meta: MetaType;
  data: ResponseKebutuhanDokumentasiType[];
}

// to response with pagination
export const toResponseKebutuhanDokumentasiWithMetaType = (
  data: ResponseKebutuhanDokumentasiWithMetaType,
): ResponseKebutuhanDokumentasiWithMetaType => data;

// response with pagination
export interface ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType {
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
export const toResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType = (
  data: ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType,
): ResponseKebutuhanDokumentasiByKriteriaLokasiWithMetaType => data;
