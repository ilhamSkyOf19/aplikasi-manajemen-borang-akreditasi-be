import { JenisRiwayat, Status } from "../utils/contstanst";
import { IKebutuhanDokumen } from "./kebutuhanDokumen.model";
import { IPic } from "./pic.model";
import { ITimAkreditasi } from "./timAkreditasi.model";
import { PayloadUserType } from "./user.model";

export interface IRiwayat {
  id: number;
  jenis: JenisRiwayat;
  status: Status;
  keterangan: string;
  kebutuhanDokumen?: Pick<
    IKebutuhanDokumen,
    "id" | "namaDokumen" | "status"
  > | null;
  pic?:
    | (Pick<IPic, "id" | "status"> & {
        kebutuhanDokumen: Pick<IKebutuhanDokumen, "id" | "namaDokumen">;
        timAkreditasi: Pick<ITimAkreditasi, "id" | "namaTimAkreditasi">;
        pj: Pick<PayloadUserType, "id" | "nama">[];
      })
    | null;
  createdAt: Date;
  updatedAt: Date;
}

// create
export interface CreateRiwayatType extends Omit<
  IRiwayat,
  "id" | "createdAt" | "updatedAt" | "kebutuhanDokumen" | "pic"
> {
  kebutuhanDokumenId?: number;
  picId?: number;
}

// update
export interface UpdateRiwayatType extends Partial<CreateRiwayatType> {}

// response
export interface ResponseRiwayatType extends IRiwayat {}

// to response
export const toResponseRiwayatType = (riwayat: ResponseRiwayatType) => riwayat;
