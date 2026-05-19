export interface IPeriode {
  id: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// create
export interface CreatePeriodeType {
  start_date: Date;
  end_date: Date;
}

// response
export interface ResponsePeriodeType extends IPeriode {}

// to response
export const toResponsePeriodeType = (
  periode: ResponsePeriodeType,
): ResponsePeriodeType => periode;
