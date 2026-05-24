import { DosenRole } from "../utils/contstanst";
import { ResponseDosenType } from "./dosen.model";

export interface IActivationCode {
  id: number;
  dosen: Pick<ResponseDosenType, "id" | "nama" | "email" | "nidn"> & {
    roles?: DosenRole[];
  };
  expire_at: Date;
  reset_token: string;
  code: number;
}

// send email
export interface SendEmailType {
  email: string;
}

// activation code
export interface ActivationRequestType {
  code: number;
}

// response activation code
export interface ResponseActivationType extends Omit<
  IActivationCode,
  "code" | "reset_token"
> {}

// to response
export const toResponseActivationType = (
  activation: ResponseActivationType,
): ResponseActivationType => activation;
