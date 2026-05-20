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

// response with distribusi
export interface ResponsePeriodeWithDistribusiType extends IPeriode {
  distribusi: {
    id: number;
    is_distribusi_active: boolean;
  } | null;
}

// to response
export const toResponsePeriodeWithDistribusiType = (
  periode: ResponsePeriodeWithDistribusiType,
): ResponsePeriodeWithDistribusiType => periode;
