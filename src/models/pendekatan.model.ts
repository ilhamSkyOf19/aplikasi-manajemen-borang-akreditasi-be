export interface IPendekatan {
  id: number;
  tahap: string;
  keterangan: string;
}

// response
export interface ResponsePendekatanType extends IPendekatan {}

// to response
export const toResponsePendekatanType = (
  pendekatan: ResponsePendekatanType,
): ResponsePendekatanType => {
  return pendekatan;
};
