import { MetaType } from "../utils/contstanst";
import { IDosen } from "./dosen.model";
import { IKriteria } from "./kriteria.model";

// kriteria model
export interface IKriteriaPic {
  id: number;
  kriteria: Omit<IKriteria, "created_at" | "updated_at" | "periode_id">;
  dosen: Omit<IDosen, "password" | "created_at" | "updated_at">[];
  created_at: Date;
  updated_at: Date;
}

// create kriteria pic model
export interface AddPicToKriteriaType {
  kriteria_id: number;
  dosen_id: number[];
}

// response create kriteria pic model
export interface ResponseCreateUpdateKriteriaPicType {
  kriteria_id: number;
  dosen_id: number[];
  created_at: Date;
  updated_at: Date;
}

// to response
export const toResponseCreateUpdateKriteriaPic = (
  data: ResponseCreateUpdateKriteriaPicType,
): ResponseCreateUpdateKriteriaPicType => data;

// response kriteria model
export interface ResponseKriteriaPicType extends Omit<IKriteriaPic, "id"> {}
