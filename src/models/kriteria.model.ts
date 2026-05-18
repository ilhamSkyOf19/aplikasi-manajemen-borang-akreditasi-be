import { MetaType } from "../utils/contstanst";

// kriteria model
export interface IKriteria {
  id: number;
  periode_id: number;
  kode_kriteria: number;
  nama_kriteria: string;
  created_at: Date;
  updated_at: Date;
}

// create kriteria model
export interface CreateKriteriaType extends Omit<
  IKriteria,
  "id" | "created_at" | "updated_at"
> {}

// update kriteria model
export interface UpdateKriteriaType extends Partial<
  Omit<IKriteria, "id" | "created_at" | "updated_at">
> {}

// response kriteria model
export interface ResponseKriteriaType extends IKriteria {}

// to response
export const toKriteriaResponse = (
  kriteria: ResponseKriteriaType,
): ResponseKriteriaType => kriteria;

// response kriteria model with meta
export interface ResponseKriteriaWithMetaType {
  meta: MetaType;
  data: IKriteria[];
}

// toresponse kriteria model
export const toKriteriaWithMetaResponse = (
  kriteria: ResponseKriteriaWithMetaType,
): ResponseKriteriaWithMetaType => kriteria;

export interface ResponseKriteriaPicWithMetaType {
  meta: MetaType;
  data: (IKriteria & {
    dosen: {
      id: number;
      nama: string;
      email: string;
      nidn: string;
    }[];
  })[];
}

// toresponse kriteria model
export const toResponseKriteriPicWithMetaType = (
  kriteria: ResponseKriteriaPicWithMetaType,
): ResponseKriteriaPicWithMetaType => kriteria;

// response for choose
export interface ResponseKriteriaChooseType {
  id: number;
  nama_kriteria: string;
  kode_kriteria: number;
}
