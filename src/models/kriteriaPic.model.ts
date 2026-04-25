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
export interface UpdateKriteriaPicType {
  dosen_id: number[];
}

// response kriteria model
export interface ResponseKriteriaPicType extends Omit<IKriteriaPic, "id"> {}

// to response
export const toKriteriaPicResponse = (
  data: ResponseKriteriaPicType,
): ResponseKriteriaPicType => data;

// response kriteria model with meta
export interface ResponseKriteriaPicWithMetaType {
  meta: MetaType;
  data: Omit<IKriteriaPic, "id">[];
}

// toresponse kriteria model
export const toKriteriaPicWithMetaResponse = (
  data: ResponseKriteriaPicWithMetaType,
): ResponseKriteriaPicWithMetaType => data;
