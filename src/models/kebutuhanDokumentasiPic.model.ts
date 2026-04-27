import { MetaType, Status, TipeDokumentasi } from "../utils/contstanst";
import { IKriteria, ResponseKriteriaType } from "./kriteria.model";
import { IPendekatan } from "./pendekatan.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { IKriteriaPic, ResponseKriteriaPicType } from "./kriteriaPic.model";

// type
export interface IKebutuhanDokumentsiPic {
  id: number;
  kriteria_pic: Omit<ResponseKriteriaPicType, "created_at" | "updated_at">;
  pendekatan: IPendekatan;
  nama_kebutuhan_dokumentasi: string;
  tipe_dokumentasi: TipeDokumentasi;
  pic: string;
  keterangan: string;
  created_at: Date;
  updated_at: Date;
  status: Status;
}

// create
export interface CreateKebutuhanDokumentasiPic {
  kriteria_id: number;
  pendekatan_id: number;
  nama_dokumentasi_id: number;
  pic_id: number;
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
  pic_id?: number;

  nama_dokumentasi_new?: string;
  pic_new?: string;

  tipe_dokumentasi: TipeDokumentasi;
  keterangan: string;
}

// update request
export interface UpdateKebutuhanDokumentasiPicRequestType extends Partial<CreateKebutuhanDokumentasiPicRequestType> {
  keterangan_update: string;
}

// response
export interface ResponseKebutuhanDokumentasiNonKriteriPicPendekatanWithPagenationType {
  data: Omit<IKebutuhanDokumentsiPic, "kriteria_pic" | "pendekatan">[];
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
    status: Status;
  }[];
}

// to response with pagination
export const toResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType = (
  data: ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType,
): ResponseKebutuhanDokumentasiPicByKriteriaPicWithMetaType => data;

// // response update status
// export interface ResponsePicUpdateStatusType {
//   id: number;
//   namaDokumen: string;
//   timAkreditasi: {
//     id: number;
//     namaTimAkreditasi: string;
//     anggota: {
//       id: number;
//       nama: string;
//     }[];
//   }[];
//   kriteria: {
//     id: number;
//     kriteria: number;
//     namaKriteria: string;
//   };
//   pendekatan: {
//     id: number;
//     tahap: string;
//     keterangan: string;
//   };
//   status: string;
//   keterangan: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// // to response update status
// export const toResponsePicUpdateStatusType = (
//   pic: ResponsePicUpdateStatusType,
// ) => pic;

// // type for my pic

// export interface PicItem {
//   id: number;
//   status: Status;
//   keterangan: string;
//   namaDokumen: string;
//   kriteria: {
//     id: number;
//     kriteria: number;
//     namaKriteria: string;
//   };
//   pendekatan: {
//     id: number;
//     tahap: string;
//     keterangan: string;
//   };
// }

// export interface DokumenItem {
//   picId: number;
//   dokumenId: number;
//   namaDokumen: string;
//   status: Status;
//   keterangan: string;
// }

// export interface PendekatanGrouped {
//   pendekatanId: number;
//   tahap: string;
//   keterangan: string;
//   kebutuhanDokumen: DokumenItem[];
// }

// export interface KriteriaGrouped {
//   kriteriaId: number;
//   nomorKriteria: number;
//   namaKriteria: string;
//   pendekatan: Record<number, PendekatanGrouped>;
// }

// export interface MyPIcResponse extends Omit<KriteriaGrouped, "pendekatan"> {
//   pendekatan: PendekatanGrouped[];
// }
