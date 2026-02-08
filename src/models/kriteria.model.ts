// kriteria model
export interface IKriteria {
  id: number;
  kriteria: number;
  namaKriteria: string;
  revisi: number;
  createdAt: Date;
  updatedAt: Date;
}

// create kriteria model
export interface CreateKriteriaType extends Omit<
  IKriteria,
  "id" | "createdAt" | "updatedAt" | "revisi"
> {}

// updatfe kriteria model
export interface UpdateKriteriaType extends Partial<
  Omit<IKriteria, "id" | "createdAt" | "updatedAt" | "revisi">
> {}

// response kriteria model
export interface ResponseKriteriaType extends IKriteria {}

// ro response
export const toKriteriaResponse = (
  kriteria: ResponseKriteriaType,
): ResponseKriteriaType => kriteria;

// response kriteria model with meta
export interface ResponseKriteriaWithMetaType {
  meta: {
    totalData: number;
    currentPage: number;
    totalPage: number;
    limit: number;
  };
  data: IKriteria[];
}

// toresponse user model
export const toKriteriaWithMetaResponse = (
  kriteria: ResponseKriteriaWithMetaType,
): ResponseKriteriaWithMetaType => {
  return {
    meta: {
      totalData: kriteria.meta.totalData,
      currentPage: kriteria.meta.currentPage,
      totalPage: kriteria.meta.totalPage,
      limit: kriteria.meta.limit,
    },
    data: kriteria.data.map((item) => item),
  };
};
