import { FlagRevisi, JenisRiwayat, Status } from "../utils/contstanst";
import { IKebutuhanDokumen } from "./kebutuhanDokumen.model";
import { IPic } from "./pic.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { PayloadUserType } from "./user.model";

export interface IRiwayat {
  id: number;
  jenis: JenisRiwayat;
  flagRevisi?: FlagRevisi[] | null;
  status: Status;
  keterangan: string;
  createdData?: Date | null;
  highlightDataEmpy?: string;
  pic?:
    | (Pick<IPic, "id" | "status" | "namaDokumen"> & {
        timAkreditasi: (Pick<ITimAkreditasi, "id" | "namaTimAkreditasi"> & {
          anggota: PayloadUserType[];
        })[];
      })
    | null;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateRiwayatType extends Omit<
  IRiwayat,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "pic"
  | "highlightDataEmpy"
  | "createdData"
  | "flagRevisi"
> {
  picId?: number;
  flagRevisi?: FlagRevisi[];
}

// update
export interface UpdateRiwayatType extends Partial<
  Omit<CreateRiwayatType, "picId">
> {}

// response
export interface ResponseRiwayatType extends IRiwayat {}

// to response
export const toResponseRiwayatType = (riwayat: ResponseRiwayatType) => riwayat;
