import { MetaType } from "../utils/contstanst";
import { IDosen } from "./dosen.model";
import { IKriteria } from "./kriteria.model";

// kriteria model
export interface IKriteriaPic {
  id: number;
  kriteria: Omit<IKriteria, "created_at" | "updated_at">;
  dosen: Omit<IDosen, "password" | "created_at" | "updated_at">[];
  created_at: Date;
  updated_at: Date;
}

// create kriteria pic model
export interface CreateKriteriaPicType {
  kriteria_id: number;
  dosen_id: number[];
}

// update kriteria pic model
export interface UpdateKriteriaPicType extends Partial<CreateKriteriaPicType> {}

// response kriteria model
export interface ResponseKriteriaPicType extends Omit<IKriteriaPic, "id"> {}

// to response
export const toKriteriaPicResponse = (
  kriteria: ResponseKriteriaPicType,
): ResponseKriteriaPicType => kriteria;

// response kriteria model with meta
export interface ResponseKriteriaPicWithMetaType {
  meta: MetaType;
  data: IKriteriaPic[];
}

// toresponse kriteria model
export const toKriteriaPicWithMetaResponse = (
  kriteria: ResponseKriteriaPicWithMetaType,
): ResponseKriteriaPicWithMetaType => kriteria;
